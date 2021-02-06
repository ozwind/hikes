var hikes = hikes || new Hikes();
const spaces = "&nbsp;&nbsp;&nbsp;";


function Hikes() {
    this.init = function () {
        var furthest = 0;
        var fastest = 0;
        var longest = 0;
        var coldest = 0;
        var warmest = 0;
        for (var i = 0; i < data.length; i++) {
            var photos = "<td>";
            if (data[i].photos && data[i].photos.length > 0) {
                for (j = 0; j < data[i].photos.length; j++) {
                    photos += "<a href='" + data[i].photos[j] +
                        "'><img class='thumb' onmouseover='mouseover(this)' onmouseout='mouseout(this)' data-src='" + data[i].photos[j] + "'></a>";
                }
            }
            photos += "</td>";

            var morePhotos = "";
            if (data[i].morePhotos && data[i].morePhotos.length > 0) {
                morePhotos = "<br><br><a href='" + data[i].morePhotos + "'>Photos</a>";
            }

            if (data[i].videos) {
                for (var j = 0; j < data[i].videos.length; j++) {
                    morePhotos += "<br><br><a href='" + data[i].videos[j] + "'>Video</a>";
                }
            }

            if (!data[i].mph) {
                var dur = data[i].duration.split(":");
                var time = parseInt(dur[0]) + parseInt(dur[1]) / 60.0;
                data[i].mph = data[i].miles / time;
            }

            var html = "<tr>" +
                "<td class='date'>" + data[i].date + "</td>" +
                "<td class='miles'>" + data[i].miles.toFixed(1) + "</td>" +
                "<td class='mph'>" + data[i].mph.toFixed(1) + "</td>" +
                "<td class='duration'>" + data[i].duration + "</td>" +
                "<td class='conditions'>" + data[i].conditions + morePhotos + "</td>" +
                "<td class='trail'><a href='" + data[i].url + "'>" + data[i].trail + "</a></td>" +
                photos +
                "</tr>";
            $("#tdata").append(html);

            if (data[i].miles > data[furthest].miles) {
                furthest = i;
            }
            if (data[i].mph > data[fastest].mph) {
                fastest = i;
            }
            if (data[i].duration > data[longest].duration) {
                longest = i;
            }
            var low = 100;
            var high = 0;
            var temps = data[i].conditions.match(/\d+/g);
            temps = temps ? temps.map(Number) : undefined;
            if (temps) {
                if (temps.length == 1) {
                    low = temps[0];
                    high = low;
                }
                else if (temps.length > 1) {
                    low = temps[0];
                    high = temps[1];
                }
            }
            data[i].low = low;
            data[i].high = high;
            if (data[i].low < data[coldest].low) {
                coldest = i;
            }
            if (data[i].high > data[warmest].high) {
                warmest = i;
            }
        }

        tooltip(furthest, "miles");
        tooltip(fastest, "mph");
        tooltip(longest, "duration");
        conditionTooltip(coldest, warmest);
        setTimeout(()=>{
            $('html, body').scrollTop(0);            
        },0);
    }
}

function tooltip(index, type) {
    var tooltip = type + "Tooltip";
    var date = data[index].date;
    var html = "<div id='" + tooltip + "'>" + data[index][type] + spaces + date + "</div>";
    $("#th" + type).html(html);
    animate(tooltip, date);
}

function conditionTooltip(coldest, warmest) {
    var coldTooltip = "coldTooltip";
    var warmTooltip = "warmTooltip";
    var coldDate = data[coldest].date;
    var warmDate = data[warmest].date;
    var html = "<div id='" + coldTooltip + "'>" + data[coldest].low + "°" + spaces + coldDate + "</div>"
             + "<div id='" + warmTooltip + "'>" + data[warmest].high + "°" + spaces + warmDate + "</div>";
    $("#thCond").html(html);
    animate(coldTooltip, coldDate);
    animate(warmTooltip, warmDate);
}

//function animate(tooltip, date) {
const animate = (tooltip, date) => {
    $("#" + tooltip).on('click', () => {
        var elem = $("td:contains('" + date + "')");
        $('html, body').animate({scrollTop: elem.offset().top - 2}, 1000);
    });    
}

function mouseover(img) {
    var windowpos = $(window).scrollTop();
    $("#rollImg").attr("src", img.src);
    $("#rollImg").css("display", "flex");
    $(".image").css("top", windowpos);
}

function mouseout(img) {
    $("#rollImg").css("display", "none");
}

function sort(n) {
    var rows;
    var shouldSwitch;
    var switchCount = 0;
    var table = $("table")[0];
    var switching = true;
    var dir = "desc";

    if (!this.sortDir) {
        this.sortDir = {};
    }
    if (this.sortDir[n]) {
        dir = this.sortDir[n] === "desc" ? "asc" : "desc";
    }
    this.sortDir[n] = dir;

    $('body').addClass('waiting');

    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            var x = rows[i].getElementsByTagName("TD")[n];
            var y = rows[i + 1].getElementsByTagName("TD")[n];
            var xVal = n == 3 ? toHours(x.innerHTML) : parseFloat(x.innerHTML);
            var yVal = n == 3 ? toHours(y.innerHTML) : parseFloat(y.innerHTML);
            if (dir == "asc") {
                if (xVal > yVal) {
                    shouldSwitch = true;
                    break;
                }
            }
            else if (dir == "desc") {
                if (xVal < yVal) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCount++;
        } else {
            if (switchCount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }

    $(window).trigger('resize');
    $('body').removeClass('waiting');
}

function toHours(str) {
    var dur = str.split(":");
    return parseInt(dur[0]) + parseInt(dur[1]) / 60.0;
}

var data = [
    {
        date: '2/6/2021',
        duration: '3:43',
        miles: 9.7,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-ab24cd2--45',
        conditions: 'Sunny 48°-68°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/33477841/extra_large_4cb363a3cd8c1b0750ecb27680ab860d.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/33477845/extra_large_28696098c136614c5404c497e074305e.jpg']
    },
    {
        date: '1/16/2021',
        duration: '3:31',
        miles: 10.2,
        trail: 'Horseshoe loop',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-d14fe37--36',
        conditions: 'Sunny 56°-80°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/32909630/extra_large_1c4ceee405d947dcb9906115b3b51dd6.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/32909657/extra_large_c3dd07d8c3a4dd14399df285882fde8d.jpg']
    },
    {
        date: '1/10/2021',
        duration: '3:33',
        miles: 10.5,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-0829424--47',
        conditions: 'Sunny 63°-70°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/32770482/extra_large_2a8ff05c0e312d20a8c38467c09ea7d0.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/32770475/extra_large_a232604cd129623c42d1a1a3b71ab52c.jpg']
    },
    {
        date: '1/2/2021',
        duration: '3:41',
        miles: 9.8,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-615299a--27',
        conditions: 'Clouds/Sun 46°-60°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/32517633/extra_large_d4fc3565e12126b8cefcd2b2be44548a.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/32517782/extra_large_092d862a00fdc665edfef29df01921af.jpg']
    },
    {
        date: '12/24/2020',
        duration: '1:59',
        miles: 4.7,
        trail: 'Chutes',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-536a76f--35',
        conditions: 'Cloudy 55°-60°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/32245084/extra_large_436bd52797a3ec4e93fcf7bd8bccc41c.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/32245089/extra_large_882e75946bcde0b3b82782d354bc4657.jpg']
    },
    {
        date: '12/14/2020',
        duration: '3:46',
        miles: 10.5,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-d87aa42--34',
        conditions: 'Clouds/Sun 54°-63°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/32076987/extra_large_4146a55dd3ab4e703c81683323d27fbc.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/32076882/extra_large_48a1b64a8a92fb85440db81c9417bccd.jpg']
    },
    {
        date: '12/5/2020',
        duration: '3:33',
        miles: 9.8,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-6add07c--21',
        conditions: 'Sunny 45°-65°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/31883811/extra_large_06384d891c011a3c3eabcadd5cc9a16d.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/31883810/extra_large_cba866ae07594caab418f2ba302f1422.jpg']
    },
    {
        date: '11/28/2020',
        duration: '3:51',
        miles: 10.7,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-05c7ac9--28',
        conditions: 'Sunny 56°-70°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/31732482/extra_large_51583d3af2417a5634af91156eebf69c.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/31732475/extra_large_ead7d51c1409db63f27a1e0c93c2e8e4.jpg']
    },
    {
        date: '11/21/2020',
        duration: '2:37',
        miles: 7.3,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-ad61ab1--19',
        conditions: 'Sunny 52°-67°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/31540833/extra_large_e6aef1f87b9394f76b31503d8c4f688b.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/31540846/extra_large_056cee02fb3a9c77355083782a52354b.jpg']
    },
    {
        date: '11/16/2020',
        duration: '4:36',
        miles: 12.5,
        trail: 'Irvine Weir',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-34f9a34--23',
        conditions: 'Sunny 61°-78°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/31457205/extra_large_bb689699759f3107748fa4694770547b.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/31457210/extra_large_a8ae514fce163dfeb5a9199c3a1ae366.jpg']
    },
    {
        date: '11/9/2020',
        duration: '3:46',
        miles: 10.4,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-7c792a8--20',
        conditions: 'Sunny 46°-59°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/31290000/extra_large_d566f7db87f1cbff3731ab8e87f8b1bb.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/31289996/extra_large_2be6e6b68b68b89edae38866ce209c62.jpg']
    },
    {
        date: '11/2/2020',
        duration: '3:27',
        miles: 9.5,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-7e8d7e5--21',
        conditions: 'Sunny 60°-76°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/31098315/extra_large_3dbaa1f42a41c188093bad43fe77b483.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/31098312/extra_large_1f8bca551034ecca40c470cf7d8b9a3f.jpg']
    },
    {
        date: '10/19/2020',
        duration: '3:34',
        miles: 10.5,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-b0eb9a9--17',
        conditions: 'Clouds/Sun 61°-71°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/30732492/extra_large_5e4c1504082160269a172490e901e300.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/30732504/extra_large_c52bd449b6d7cabc7995c0478a1c2ab6.jpg']
    },
    {
        date: '10/12/2020',
        duration: '3:05',
        miles: 6.4,
        trail: 'Chutes',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-e58cc5c--24',
        conditions: 'Sunny 61°-73°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/30506736/extra_large_29e1ef46dae6fa1762c3d16e6084b0fd.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/30506769/extra_large_9860c45e5b9a6f999962c7c8d99eadad.jpg']
    },
    {
        date: '10/5/2020',
        duration: '4:26',
        miles: 12.6,
        trail: 'Irvine Weir',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-90a82bf--13',
        conditions: 'High Clouds 64°-81°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/30276132/extra_large_be6107b86c5b17eac65a11ada3c5dff2.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/30276128/extra_large_926309150ff1eef8cbd6b44ba7362265.jpg']
    },
    {
        date: '9/28/2020',
        duration: '3:43',
        miles: 10.4,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-c22ad2b--23',
        conditions: 'Sunny 61°-73°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/30046361/extra_large_de2b941d5c08bc1d8d5cbc1f767bd5fc.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/30046501/extra_large_b105ffa7a81a962942a469bfb50abcf5.jpg']
    },
    {
        date: '9/21/2020',
        duration: '3:32',
        miles: 9.9,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-d28d296--10',
        conditions: 'Overcast 63°-71°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/29804859/extra_large_20449d6ac281c8ba8e1079a9750223b7.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/29804853/extra_large_8d6c54f415a27d7021df727cad126ce5.jpg']
    },
    {
        date: '9/14/2020',
        duration: '3:26',
        miles: 9.5,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-4aaa761--9',
        conditions: 'Hazy 63°-80°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/29574256/extra_large_64ef23655fdac3c6f8f3ef3b9ff3825d.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/29574258/extra_large_23d1684f3084f0619d71f8bf9468578c.jpg']
    },
    {
        date: '9/5/2020',
        duration: '2:43',
        miles: 7.7,
        trail: 'Egret',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-a8345c3--7',
        conditions: 'Sunny 73°-92°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/29221204/extra_large_fd6e3d1dad936f11fc0eaac1703c5064.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/29221573/extra_large_4654d8a74e92838f24d2d03099185731.jpg']
    },
    {
        date: '8/22/2020',
        duration: '3:25',
        miles: 10.2,
        trail: 'Irvine Park',
        url: 'https://www.alltrails.com/explore/recording/morning-hike-e2e1423--6',
        conditions: 'Sunny 78°-89°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/28781336/extra_large_37e62db0a1038f7a6e1238e2c568f4bc.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/28781342/extra_large_969c4724c5a73b9bca244eceebc8da42.jpg']
    },
    {
        date: '8/15/2020',
        duration: '6:05',
        miles: 10.7,
        trail: 'Mt. Baldy',
        url: 'https://www.alltrails.com/explore/recording/mount-san-antonio-and-mount-baldy-notch-trail-275d7fb',
        conditions: 'Clouds 75°-94°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/28575708/extra_large_874892e2e4c8ca6fcc4e7f75a9a029c4.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/28575849/extra_large_a7554e05bc741f716b9820e19e932ad4.jpg']
    },
    {
        date: '8/10/2020',
        duration: '5:00',
        miles: 12.7,
        trail: 'Sierra Peak',
        url: 'https://www.alltrails.com/explore/recording/sierra-peak-via-pipeline-trail-and-coal-canyon-trail-36e729e',
        conditions: 'Sunny 59°-85°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/28421025/extra_large_203f7107533ce2cd89b6df11c6315777.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/28421100/extra_large_1c32ab531fcce14694ec23d4e6c8120c.jpg']
    },
    {
        date: '8/1/2020',
        duration: '4:23',
        miles: 12.3,
        trail: 'Blue Sky',
        url: 'https://www.alltrails.com/explore/recording/recording-aug-01-11-19-am-dc36381',
        conditions: 'Sunny 70°-92°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/28091348/extra_large_55f37d9221c43a0793604dd88b797f9e.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/28091373/extra_large_6ab99f11698bf459b061d1b863e7d612.jpg']
    },
    {
        date: '7/25/2020',
        duration: '3:39',
        miles: 9.5,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-25-10-47-am-7380ad8',
        conditions: 'Cloudy 64°-76°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27921872/extra_large_17cf73d194d2cf2dde5a3555cb000240.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27921904/extra_large_2e405d6b72ad0a367ce4866731772b9e.jpg']
    },
    {
        date: '7/19/2020',
        duration: '1:48',
        miles: 4.3,
        trail: 'Weir Canyon',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-19-9-08-am-aeefb05',
        conditions: 'Sunny 64°-74°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27800129/extra_large_88a350ecc4277d90023bb9dbf209bff1.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27800109/extra_large_f77bc72005e794c5e5a20b702ec56f8e.jpg']
    },
    {
        date: '7/11/2020',
        duration: '4:45',
        miles: 12.9,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-11-11-46-am-f2fb9d7',
        conditions: 'Sunny 70°-91°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27621121/extra_large_082601f503b63c93fd51025b543885c6.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27621134/extra_large_d83c258e5d3a9045f1f50033c9e44590.jpg']
    },
    {
        date: '7/3/2020',
        duration: '2:49',
        miles: 6.6,
        trail: 'Lower Calf Creek',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-03-10-33-am-1368ba1',
        morePhotos: 'https://chewi0.smugmug.com/Utah-2020/i-BX8mFXN',
        conditions: 'Cloudy',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27484419/extra_large_cc151db843cf65ce6ee97a9557423a52.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27484384/extra_large_8b7a9cee0bedfa2bdb62152f43a2ee9c.jpg']
    },
    {
        date: '7/2/2020',
        duration: '1:04',
        miles: 2.3,
        trail: 'Grand Parade',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-02-9-37-am-eae27d7',
        morePhotos: 'https://chewi0.smugmug.com/Utah-2020/i-mqs72SX',
        conditions: 'Sunny',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27484339/extra_large_88cdbdb71858937197067185e9afc303.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27484346/extra_large_1b24830b449819dc7430c65056759b5e.jpg']
    },
    {
        date: '7/1/2020',
        duration: '0:52',
        miles: 2.3,
        trail: 'Tanks',
        url: 'https://www.alltrails.com/explore/recording/capitol-gorge-to-tanks-trail-dd1016d',
        conditions: 'Sunny',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27484265/extra_large_e470a01db4a02ed3a69e2a1e8c5a2799.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27484261/extra_large_2af6b935d63922dc1196500d9eb6dd79.jpg']
    },
    {
        date: '7/1/2020',
        duration: '1:58',
        miles: 3.9,
        trail: 'Golden Throne',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-01-11-42-am-42c8938',
        morePhotos: 'https://chewi0.smugmug.com/Utah-2020/i-G5C76w7',
        conditions: 'Sunny',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27484108/extra_large_af2ec6098e59308b33f9f1d3ea2e4052.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27484178/extra_large_56925adc57bbaa2144a44635dc55d35d.jpg']
    },
    {
        date: '6/30/2020',
        duration: '1:22',
        miles: 2.9,
        trail: 'Navajo Loop',
        url: 'https://www.alltrails.com/explore/recording/navajo-loop-and-queen-s-garden-trail-1fd09c5',
        morePhotos: 'https://chewi0.smugmug.com/Utah-2020/i-DVPS6c8',
        conditions: 'Sunny',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27483918/extra_large_5146a2dadab8d14d22923d27becd3536.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27483998/extra_large_d4d394bf78e1fd796c35304c149483aa.jpg']
    },
    {
        date: '6/29/2020',
        duration: '1:44',
        miles: 3.1,
        trail: 'Fire Wave',
        url: 'https://www.alltrails.com/explore/recording/recording-jun-29-10-22-am-0d770c4',
        morePhotos: 'https://chewi0.smugmug.com/Utah-2020/i-hNFKPjc',
        conditions: 'Sunny',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27483797/extra_large_a9bdfccda5c4476aeec251bef634521d.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27483686/extra_large_bc1c45071fadf901383d20d511eaebb6.jpg']
    },
    {
        date: '6/20/2020',
        duration: '2:47',
        miles: 7.5,
        trail: 'Coachwhip',
        url: 'https://www.alltrails.com/explore/recording/recording-jun-20-9-54-am-87ec2f4',
        conditions: 'Overcast 64°-65°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27170226/extra_large_e8bbf5307e0196374a9276f0baa336ab.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27170262/extra_large_2b10162003d9f502dfaaf9ff6ffe410a.jpg']
    },
    {
        date: '6/13/2020',
        duration: '3:37',
        miles: 10.3,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-jun-13-10-45-am-6ea2ef7',
        conditions: 'Clouds 61°-72°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/27024158/extra_large_557312fbc6a114a2220954d5e15107a0.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/27024055/extra_large_3973ca3a4703afc2ea7f770bc488a04c.jpg']
    },
    {
        date: '6/6/2020',
        duration: '3:32',
        miles: 10.6,
        trail: 'Horseshoe loop',
        url: 'https://www.alltrails.com/explore/recording/recording-jun-06-10-42-am-58238e9',
        conditions: 'Drizzle 64°-66°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/26884405/extra_large_cf7afd0f1c3cf06019c40b2edb7e86c6.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/26884349/extra_large_f4bcc9ba2cb4e87cd680fab79e79035a.jpg']
    },
    {
        date: '5/30/2020',
        duration: '3:53',
        miles: 11.0,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/recording-may-30-11-10-am-61c66a2',
        conditions: 'Clouds 62°-73°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/26749863/extra_large_bb2333e4766d29eaa6fbb3e443286a55.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/26749858/extra_large_38ff6273ac61ca125def3f6fc2a3a0ee.jpg']
    },
    {
        date: '5/23/2020',
        duration: '2:07',
        miles: 6.0,
        trail: 'Weir Canyon',
        url: 'https://www.alltrails.com/explore/recording/recording-may-23-9-46-am-b096577',
        conditions: 'Clouds 63°-70°',
        photos: ['https://cdn-assets.alltrails.com/uploads/photo/image/26585747/extra_large_e4ab10a7725a3a3ef4012ae6bed9169a.jpg','https://cdn-assets.alltrails.com/uploads/photo/image/26585750/extra_large_73167f0d04a8f58990c716b834cc7dde.jpg']
    },
    {
        date: '5/14/2020',
        duration: '1:12',
        miles: 2.6,
        trail: 'Castlewood',
        url: 'https://www.alltrails.com/explore/recording/recording-may-14-2-43-pm-2156795',
        morePhotos: 'https://chewi0.smugmug.com/Vacation/St-Louis-2020/i-CBRcMhb/A',
        conditions: 'Thunderstorm',
        photos: ['https://www.alltrails.com/api/alltrails/photos/26488153/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/26488342/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/9/2020',
        duration: '3:23',
        miles: 9.7,
        trail: 'Chutes',
        url: 'https://www.alltrails.com/explore/recording/recording-may-09-10-38-am-bb7946e',
        conditions: 'Overcast 62&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/26335255/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/26335231/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/2/2020',
        duration: '4:20',
        miles: 12.0,
        trail: 'Blue Sky',
        url: 'https://www.alltrails.com/explore/recording/recording-may-02-11-23-am-8216124',
        conditions: 'Sunny 59&deg;-79&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/26224965/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/26225079/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/25/2020',
        duration: '4:50',
        miles: 13.1,
        trail: 'Hidden Canyon',
        url: 'https://www.alltrails.com/explore/recording/recording-apr-25-11-56-am-0172d28',
        conditions: 'Sunny 64&deg;-88&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/26128760/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/26128798/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/4/2020',
        duration: '3:30',
        miles: 10.1,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/recording-apr-04-11-04-am-a9a1d53',
        conditions: 'Clouds 55&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25883354/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25883352/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/28/2020',
        duration: '3:51',
        miles: 10.4,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/recording-mar-28-11-14-am-d5ff135',
        conditions: 'Sunny 47&deg;-63&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25816705/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25816707/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/22/2020',
        duration: '2:26',
        miles: 4.8,
        trail: 'Elementary',
        url: 'https://www.alltrails.com/explore/recording/recording-mar-22-10-05-am-18de4be',
        conditions: 'Sunny 49&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25752737/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25752759/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/7/2020',
        duration: '3:26',
        miles: 6.6,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/recording-mar-07-11-08-am-a5e0013',
        conditions: 'Clouds 57&deg;-65&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25615997/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25615971/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/29/2020',
        duration: '3:45',
        miles: 10.1,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-feb-29-11-24-am-06f2e09',
        conditions: 'Clouds 57&deg;-69&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25560542/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25560523/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/15/2020',
        duration: '3:59',
        miles: 10.3,
        trail: 'Crystal Cove',
        url: 'https://www.alltrails.com/explore/recording/recording-feb-15-12-35-pm-7a68443',
        conditions: 'Sunny 50&deg;-66&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25445270/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25445238/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/8/2020',
        duration: '3:24',
        miles: 10.3,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/recording-feb-08-1052-am--3',
        conditions: 'Sunny 46&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25397051/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25397056/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/1/2020',
        duration: '3:36',
        miles: 10.0,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-feb-01-1115-am--5',
        conditions: 'Sunny 54&deg;-78&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25349345/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25349355/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/26/2020',
        duration: '2:23',
        miles: 4.9,
        trail: 'Elementary',
        url: 'https://www.alltrails.com/explore/recording/recording-jan-26-1033-am--4',
        conditions: 'Foggy 53&deg;-58&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25305061/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25305065/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/19/2020',
        duration: '3:23',
        miles: 9.9,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/recording-jan-19-1118-am--3',
        conditions: 'Sunny 59&deg;-71&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25258386/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25258391/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/12/2020',
        duration: '2:03',
        miles: 4.1,
        trail: 'Elementary',
        url: 'https://www.alltrails.com/explore/recording/recording-jan-12-956-am--5',
        conditions: 'Sunny 46&deg;-55&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25174575/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25174571/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/11/2020',
        duration: '2:28',
        miles: 7.0,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/recording-jan-11-956-am',
        conditions: 'Sun/Clouds 44&deg;-56&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25160946/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25160942/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/4/2020',
        duration: '3:39',
        miles: 10.0,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-jan-04-1052-am--5',
        conditions: 'Sunny 46&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/25012449/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/25012422/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/30/2019',
        duration: '1:09',
        miles: 3.5,
        trail: 'Irvine Park',
        url: 'https://www.alltrails.com/explore/recording/recording-dec-30-1142-am--2',
        conditions: 'Cloudy 57&deg;-59&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24953761/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24953758/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/21/2019',
        duration: '1:51',
        miles: 4.9,
        trail: 'Elementary',
        url: 'https://www.alltrails.com/explore/recording/recording-dec-21-1228-pm--3',
        conditions: 'High clouds 64&deg;-71&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24881034/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24881043/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/14/2019',
        duration: '3:37',
        miles: 10.1,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-dec-14-1104-am--6',
        conditions: 'Drizzle 56&deg;-61&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24820618/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24820623/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/23/2019',
        duration: '3:35',
        miles: 10.4,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/recording-nov-23-1106-am--4',
        conditions: 'Sunny 56&deg;-70&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24652650/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24652646/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/16/2019',
        duration: '1:42',
        miles: 4.8,
        trail: 'Barham Ridge',
        url: 'https://www.alltrails.com/explore/recording/recording-nov-16-9-22-am--3',
        conditions: 'Sunny 56&deg;-65&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24606479/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24606488/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/23/2019',
        duration: '2:43',
        miles: 6.0,
        trail: 'Green Gulch',
        url: 'https://www.alltrails.com/explore/recording/recording-oct-23-12-37-pm--7',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24465122/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24465120/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/22/2019',
        duration: '2:08',
        miles: 4.1,
        trail: "Pirate's Cove",
        url: 'https://www.alltrails.com/explore/recording/recording-oct-22-4-03-pm',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24464891/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24464899/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/21/2019',
        duration: '1:34',
        miles: 2.8,
        trail: 'Shell Beach',
        url: 'https://www.alltrails.com/explore/recording/recording-oct-21-10-39-am--3',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24464055/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24464066/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/12/2019',
        duration: '3:35',
        miles: 10.1,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-oct-12-10-53-am--7',
        conditions: 'Sunny 55&deg;-82&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24335016/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24335021/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/5/2019',
        duration: '2:35',
        miles: 7.5,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/recording-oct-05-9-51-am--4',
        conditions: 'Sunny 56&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24265884/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24265893/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/27/2019',
        duration: '2:49',
        miles: 8.3,
        trail: 'Peters Canyon',
        url: 'https://www.alltrails.com/explore/recording/recording-sep-27-10-32-am--5',
        conditions: 'Cloudy 70&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24176120/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24176123/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/21/2019',
        duration: '3:48',
        miles: 10.4,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-sep-21-10-47-am--7',
        conditions: 'Sunny 60&deg;-82&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24117710/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24117708/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/13/2019',
        duration: '3:28',
        miles: 9.9,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/recording-sep-13-11-01-am--2',
        conditions: 'Sunny 67&deg;-78&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/24035632/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/24035620/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/8/2019',
        duration: '2:07',
        miles: 5.0,
        trail: 'Elementary',
        url: 'https://www.alltrails.com/explore/recording/recording-sep-08-9-47-am--6',
        conditions: 'Sunny 66&deg;-78&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23987643/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23987651/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/30/2019',
        duration: '3:23',
        miles: 10.0,
        trail: 'Oak',
        url: 'https://www.alltrails.com/explore/recording/recording-aug-30-10-57-am--3',
        conditions: 'Sunny 72&deg;-86&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23868695/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23868687/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/24/2019',
        duration: '3:53',
        miles: 10.9,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-aug-24-11-08-am--4',
        conditions: 'Sunny 64&deg;-87&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23801279/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23801281/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/16/2019',
        duration: '3:30',
        miles: 10.0,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/recording-aug-16-10-52-am--3',
        conditions: 'Clouds/Sun 64&deg;-79&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23682697/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23682691/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/10/2019',
        duration: '3:32',
        miles: 10.3,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/recording-aug-10-10-42-am--9',
        conditions: 'Clouds/Sun 63&deg;-78&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23605172/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23605171/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/2/2019',
        duration: '3:13',
        miles: 9.1,
        trail: 'Irvine Park',
        url: 'https://www.alltrails.com/explore/recording/recording-aug-02-10-45-am--2',
        conditions: 'Sunny 64&deg;-83&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23482202/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23482211/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/27/2019',
        duration: '4:01',
        miles: 11.2,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-27-11-20-am--4',
        conditions: 'Sunny 72&deg;-90&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23392783/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23392774/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/20/2019',
        duration: '3:49',
        miles: 8.0,
        trail: 'Baden-Powell',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-20-1-17-pm--2',
        conditions: 'Sunny 62&deg;-82&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23296550/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23296549/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/14/2019',
        duration: '3:52',
        miles: 10.9,
        trail: 'Deer Den',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-14-11-15-am--6',
        conditions: 'Sunny 66&deg;-86&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23235981/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23235984/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/5/2019',
        duration: '3:00',
        miles: 8.1,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/recording-jul-05-10-37-am--4',
        conditions: 'Overcast 65&deg;-74&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23140828/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23140813/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/28/2019',
        duration: '2:28',
        miles: 7.0,
        trail: 'Irvine Park',
        url: 'https://www.alltrails.com/explore/recording/recording-jun-28-10-02-am--4',
        conditions: 'Overcast 63&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23069502/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23069505/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/22/2019',
        duration: '3:36',
        miles: 10.2,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/recording-jun-22-10-41-am--6',
        conditions: 'Cloudy 63&deg;-73&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/23008450/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/23008458/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/15/2019',
        duration: '3:41',
        miles: 10.4,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/recording-jun-15-10-59-am--7',
        conditions: 'Overcast 66&deg;-71&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22938806/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22938813/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/8/2019',
        duration: '2:17',
        miles: 6.7,
        trail: 'Deer Trail',
        url: 'https://www.alltrails.com/explore/recording/recording-jun-08-9-36-am--2',
        conditions: 'Overcast 63&deg;-66&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22871082/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22871083/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/1/2019',
        duration: '3:45',
        miles: 10.6,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/puma-ridge--8',
        conditions: 'Cloudy 60&deg;-65&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22809378/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22809382/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/25/2019',
        duration: '2:47',
        miles: 7.8,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/willows--17',
        conditions: 'Sunny 56&deg;-65&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22730852/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22730875/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/18/2019',
        duration: '3:05',
        miles: 8.3,
        trail: 'Bumblebee',
        url: 'https://www.alltrails.com/explore/recording/bumblebee--10',
        conditions: 'Clouds 57&deg;-66&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22675887/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22675894/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/11/2019',
        duration: '4:37',
        miles: 12.5,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe-loop--69',
        conditions: 'Clouds 61&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22625515/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22625507/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/4/2019',
        duration: '3:34',
        miles: 9.5,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--16',
        conditions: 'Clouds 55&deg;-70&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22572588/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22572589/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/28/2019',
        duration: '3:05',
        miles: 8.4,
        trail: 'Yucca Ridge',
        url: 'https://www.alltrails.com/explore/recording/yucca-ridge',
        conditions: 'Cloudy 59&deg;-66&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22532229/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22532216/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/20/2019',
        duration: '2:44',
        miles: 7.6,
        trail: 'Coachwhip',
        url: 'https://www.alltrails.com/explore/recording/coachwhip--7',
        conditions: 'Cloudy 57&deg;-61&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22453378/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22453377/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/13/2019',
        duration: '3:40',
        miles: 10.6,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/puma-ridge--7',
        conditions: 'Sunny 54&deg;-73&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22402613/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22402619/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/6/2019',
        duration: '2:54',
        miles: 8.2,
        trail: 'Egret trail',
        url: 'https://www.alltrails.com/explore/recording/egret--5',
        conditions: 'Clouds 57&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22354058/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22354062/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/30/2019',
        duration: '3:36',
        miles: 9.6,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--15',
        conditions: 'Sunny 54&deg;-75&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22305425/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22305442/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/24/2019',
        duration: '3:57',
        miles: 10.8,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe-loop--63',
        conditions: 'Sunny 55&deg;-66&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22268239/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22268242/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/17/2019',
        duration: '3:14',
        miles: 8.3,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/willows--16',
        morePhotos: 'https://chewi0.smugmug.com/Nature/Socal-2019/i-rrQ6HmW/A',
        conditions: 'Sunny 57&deg;-79&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22219454/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22219455/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/10/2019',
        duration: '2:14',
        miles: 6.0,
        trail: 'Elementary',
        url: 'https://www.alltrails.com/explore/recording/elementary--7',
        conditions: 'Overcast 48&deg;-55&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22181426/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22181427/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/24/2019',
        duration: '1:41',
        miles: 4.3,
        trail: 'Weir',
        url: 'https://www.alltrails.com/explore/recording/weir--22',
        morePhotos: 'https://chewi0.smugmug.com/Nature/Socal-2019/',
        conditions: 'Sunny 48&deg;-57&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22123761/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22123784/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/26/2019',
        duration: '4:14',
        miles: 12.0,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/puma-ridge--6',
        conditions: 'Windy 68&deg;-77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/22002483/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/22060594/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/5/2019',
        duration: '1:54',
        miles: 4.6,
        trail: 'Elementary',
        url: 'https://www.alltrails.com/explore/recording/elementary--5',
        conditions: 'Cloudy 50&deg;-55&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21907387/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21907390/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/31/2018',
        duration: '4:19',
        miles: 12.1,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe-loop--49',
        conditions: 'Cloudy 50&deg;-59&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21881829/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21881818/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/27/2018',
        duration: '1:45',
        miles: 4.5,
        trail: 'Irvine Park',
        url: 'https://www.alltrails.com/explore/recording/irvine-park--29',
        conditions: 'Clouds 54&deg;-62&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21856349/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21856355/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/22/2018',
        duration: '1:55',
        miles: 4.9,
        trail: 'Elementary',
        url: 'https://www.alltrails.com/explore/recording/elementary--4',
        conditions: 'Sunny 50&deg;-61&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21833064/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21833062/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/15/2018',
        duration: '2:23',
        miles: 6.9,
        trail: 'Hidden Canyon',
        url: 'https://www.alltrails.com/explore/recording/hidden-canyon--166',
        conditions: 'Sunny 50&deg;-61&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21812401/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21812402/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/9/2018',
        duration: '1:18',
        miles: 3.6,
        trail: 'Weir',
        url: 'https://www.alltrails.com/explore/recording/weir--20',
        conditions: 'Sunny 59&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21798392/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21798394/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/23/2018',
        duration: '2:41',
        miles: 7.6,
        trail: 'Bumblebee',
        url: 'https://www.alltrails.com/explore/recording/bumblebee--9',
        conditions: 'Clouds 55&deg;-61&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21741068/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21741076/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/17/2018',
        duration: '4:02',
        miles: 11.8,
        trail: 'Irvine Park',
        url: 'https://www.alltrails.com/explore/recording/irvine-park--28',
        conditions: 'High clouds 54&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21714241/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21714238/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/11/2018',
        duration: '1:17',
        miles: 3.1,
        trail: 'Blue Sky',
        url: 'https://www.alltrails.com/explore/recording/blue-sky--54',
        conditions: 'Windy 57&deg;-70&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21692951/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21692955/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/3/2018',
        duration: '3:02',
        miles: 8.9,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/willows--14',
        conditions: 'Sunny 64&deg;-75&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21651342/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21651341/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/27/2018',
        duration: '2:57',
        miles: 9.1,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--14',
        conditions: 'Sunny 61&deg;-75&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21623900/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21618275/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/20/2018',
        duration: '4:19',
        miles: 12.5,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe-loop--39',
        conditions: 'Sunny 70&deg;-86&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21579874/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21579886/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/4/2018',
        duration: '2:36',
        miles: 5.5,
        trail: 'Dead Horse',
        url: 'https://www.alltrails.com/explore/recording/dead-horse--29',
        morePhotos: 'https://chewi0.smugmug.com/Vacation/Utah-2018/i-9x5RhX8',
        conditions: 'Partly cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21491757/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21491774/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/4/2018',
        duration: '1:37',
        miles: 3.4,
        trail: 'Delicate Arch',
        url: 'https://www.alltrails.com/explore/recording/delicate-arch--353',
        morePhotos: 'https://chewi0.smugmug.com/Vacation/Utah-2018/i-LPJMJsh',
        conditions: 'Partly cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21491596/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21491602/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/3/2018',
        duration: '1:58',
        miles: 3.6,
        trail: 'Cassidy Arch',
        url: 'https://www.alltrails.com/explore/recording/cassidy-arch--45',
        morePhotos: 'https://chewi0.smugmug.com/Vacation/Utah-2018/i-nmScNfG',
        conditions: 'Partly cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21491430/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21491416/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/3/2018',
        duration: '3:19',
        miles: 6.7,
        trail: 'Lower Calf',
        url: 'https://www.alltrails.com/explore/recording/lower-calf-falls--4',
        morePhotos: 'https://chewi0.smugmug.com/Vacation/Utah-2018/i-5M4ZNxk',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21490700/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21490701/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/1/2018',
        duration: '3:34',
        miles: 6.8,
        trail: 'Panorama',
        url: 'https://www.alltrails.com/explore/recording/panorama--64',
        morePhotos: 'https://chewi0.smugmug.com/Vacation/Utah-2018/i-t6mJKnw',
        conditions: 'Partly Cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21490428/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21490462/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/30/2018',
        duration: '3:48',
        miles: 6.8,
        trail: 'East Rim',
        url: 'https://www.alltrails.com/explore/recording/east-rim--17',
        morePhotos: 'https://chewi0.smugmug.com/Vacation/Utah-2018/i-5kzXcT6',
        conditions: 'Partly Cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21490014/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21490020/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/30/2018',
        duration: '2:47',
        miles: 5.2,
        trail: 'Angels Landing',
        url: 'https://www.alltrails.com/explore/recording/angels-landing--472',
        morePhotos: 'https://chewi0.smugmug.com/Vacation/Utah-2018/i-NMxq2kZ',
        conditions: 'Partly Cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21489826/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21489813/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/29/2018',
        duration: '0:10',
        miles: 0.3,
        trail: 'Elephant Rock',
        url: 'https://www.alltrails.com/explore/recording/elephant-rock--81',
        conditions: 'Sunny 96&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21489742/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21489744/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/29/2018',
        duration: '0:21',
        miles: 0.6,
        trail: 'Rainbow Vista',
        url: 'https://www.alltrails.com/explore/recording/rainbow-vista--19',
        conditions: 'Sunny 96&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21489710/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21489711/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/29/2018',
        duration: '0:38',
        miles: 1.2,
        trail: 'White Domes',
        url: 'https://www.alltrails.com/explore/recording/white-domes--24',
        conditions: 'Sunny 96&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21489617/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21489622/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/29/2018',
        duration: '0:17',
        miles: 0.4,
        trail: 'Bowl of Fire',
        url: 'https://www.alltrails.com/explore/recording/bowl-of-fire--24',
        conditions: 'Sunny 96&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21489432/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21489435/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/22/2018',
        duration: '2:31',
        miles: 7.5,
        trail: 'Mountain Goat',
        url: 'https://www.alltrails.com/explore/recording/mountain-goat--2',
        conditions: 'Sunny 63&deg;-77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21397625/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21397629/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/15/2018',
        duration: '3:08',
        miles: 9.1,
        trail: 'Egret Trail',
        url: 'https://www.alltrails.com/explore/recording/egret--4',
        conditions: 'Sunny 64&deg;-77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21352334/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21352337/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/9/2018',
        duration: '3:20',
        miles: 8.9,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--13',
        conditions: 'Sunny 64&deg;-88&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21321572/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21321684/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/1/2018',
        duration: '4:17',
        miles: 12.4,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe-loop--34',
        conditions: 'Cloudy 64&deg;-77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21249406/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21249398/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/26/2018',
        duration: '1:22',
        miles: 3.5,
        trail: 'Irvine Park',
        url: 'https://www.alltrails.com/explore/recording/irvine-park--27',
        conditions: 'Cloudy 70&deg;-75&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21209026/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21209062/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/18/2018',
        duration: '2:55',
        miles: 8.8,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/willows--12',
        conditions: 'Cloudy 70&deg;-77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21147687/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21147689/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/11/2018',
        duration: '4:17',
        miles: 11.7,
        trail: 'Blue Sky',
        url: 'https://www.alltrails.com/explore/recording/blue-sky--50',
        conditions: 'Sunny 73&deg;-90&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21096059/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21096062/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/4/2018',
        duration: '2:40',
        miles: 7.4,
        trail: 'Cactus Canyon',
        url: 'https://www.alltrails.com/explore/recording/cactus--12',
        conditions: 'Sunny 68&deg;-79&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/21040997/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/21040992/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/28/2018',
        duration: '3:10',
        miles: 9.2,
        trail: 'Egret Trail',
        url: 'https://www.alltrails.com/explore/recording/egret--3',
        conditions: 'Cloudy/Sunny 70&deg;-81&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20985771/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20985772/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/21/2018',
        duration: '3:40',
        miles: 10.4,
        trail: 'Wilderness Trail',
        url: 'https://www.alltrails.com/explore/recording/wilderness--36',
        conditions: 'Sunny 68&deg;-79&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20932430/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20932429/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/14/2018',
        duration: '4:14',
        miles: 12.1,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe-loop--33',
        conditions: 'Sunny 68&deg;-84&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20877329/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20877335/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/8/2018',
        duration: '3:16',
        miles: 8.8,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/willows--11',
        conditions: 'Sunny 84&deg;-95&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20833717/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20833719/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/1/2018',
        duration: '1:20',
        miles: 2.9,
        trail: 'Deer',
        url: 'https://www.alltrails.com/explore/recording/deer--112',
        conditions: 'Cloudy 63&deg;-66&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20769153/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20769160/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/23/2018',
        duration: '3:18',
        miles: 9.1,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--12',
        conditions: 'Cloudy  64&deg;-75&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20713532/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20713531/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/9/2018',
        duration: '1:10',
        miles: 2.2,
        trail: 'Yehliu',
        url: 'https://www.alltrails.com/explore/recording/yehliu',
        conditions: 'Cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20769549/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20769504/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/7/2018',
        duration: '2:49',
        miles: 4.5,
        trail: 'Zhuilu',
        url: 'https://www.alltrails.com/explore/recording/zhuilu',
        conditions: 'Partly cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20685657/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20685665/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/5/2018',
        duration: '1:33',
        miles: 2.0,
        trail: 'Xiaoyoukeng',
        url: 'https://www.alltrails.com/explore/recording/xiaoyoukeng',
        conditions: 'Partly cloudy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20685593/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20685588/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/28/2018',
        duration: '2:15',
        miles: 6.5,
        trail: 'Bumblebee',
        url: 'https://www.alltrails.com/explore/recording/bumblebee--7',
        conditions: 'Cloudy 57&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20540315/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20540316/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/21/2018',
        duration: '4:20',
        miles: 11.9,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe-loop--24',
        conditions: 'Misty cloudy 57&deg;-63&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20494795/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20494804/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/14/2018',
        duration: '3:04',
        miles: 8.9,
        mph: 2.9,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/willows--8',
        conditions: 'Sunny 57&deg;-68&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20458443/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20458446/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/7/2018',
        duration: '1:21',
        miles: 2.9,
        mph: 2.1,
        trail: 'Weir Canyon',
        url: 'https://www.alltrails.com/explore/recording/weir-canyon--23',
        conditions: 'Sunny 57&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20421559/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20421561/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/30/2018',
        duration: '1:18',
        miles: 2.9,
        mph: 2.3,
        trail: 'Deer',
        url: 'https://www.alltrails.com/explore/recording/deer--105',
        conditions: 'Cloudy 57&deg;-59&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20385323/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20385328/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/23/2018',
        duration: '3:19',
        miles: 9.3,
        mph: 2.8,
        trail: 'Coachwhip',
        url: 'https://www.alltrails.com/explore/recording/coachwhip--4',
        conditions: 'Sunny 54&deg;-70&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20353423/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20353425/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/16/2018',
        duration: '4:06',
        miles: 11.5,
        mph: 2.8,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/willows--7',
        conditions: 'Clouds 55&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20325256/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20325258/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/9/2018',
        duration: '4:08',
        miles: 11.6,
        mph: 2.8,
        trail: 'Puma Ridge',
        url: 'https://www.alltrails.com/explore/recording/puma-ridge--3',
        conditions: 'Sunny 64&deg;-91&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20301550/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20301553/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/2/2018',
        duration: '2:59',
        miles: 8.9,
        mph: 3.0,
        trail: 'Egret',
        url: 'https://www.alltrails.com/explore/recording/egret--2',
        conditions: 'Cloudy 55&deg;-61&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20276474/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20276473/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/26/2018',
        duration: '4:46',
        miles: 13.3,
        mph: 2.8,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe-loop--18',
        conditions: 'Sunny 50&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20249005/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20249002/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/9/2018',
        duration: '3:48',
        miles: 12.2,
        mph: 3.2,
        trail: 'Limestone Canyon',
        url: 'https://www.alltrails.com/explore/recording/limestone--9',
        conditions: 'Sunny 55&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20194616/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20194620/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/24/2018',
        duration: '2:58',
        miles: 8.9,
        mph: 3.0,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--11',
        conditions: 'Sunny 48&deg;-57&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20159387/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20159386/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/17/2018',
        duration: '2:27',
        miles: 7.1,
        mph: 2.9,
        trail: 'Grasshopper',
        url: 'https://www.alltrails.com/explore/recording/grasshopper--4',
        conditions: 'Sunny 54&deg;-68&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20136884/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20136885/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/10/2018',
        duration: '2:04',
        miles: 6.1,
        mph: 3.0,
        trail: 'Bumblebee',
        url: 'https://www.alltrails.com/explore/recording/bumblebee--6',
        conditions: 'Cloudy 55&deg;-59&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20119199/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20119198/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/2/2018',
        duration: '4:39',
        miles: 13.8,
        mph: 3.0,
        trail: 'Fremont Canyon',
        url: 'https://www.alltrails.com/explore/recording/fremont--35',
        conditions: 'Sunny 60&deg;-82&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20100414/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20100421/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/27/2018',
        duration: '2:18',
        miles: 6.8,
        mph: 3.0,
        trail: 'Peralta Hills',
        url: 'https://www.alltrails.com/explore/recording/peralta-hills--2',
        conditions: 'Sunny 63&deg;-68&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20084444/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20084443/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/20/2018',
        duration: '2:21',
        miles: 6.8,
        mph: 2.9,
        trail: 'Hawk',
        url: 'https://www.alltrails.com/explore/recording/hawk--20',
        conditions: 'Sunny 48&deg;-55&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20065167/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20065164/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/13/2018',
        duration: '3:18',
        miles: 9.5,
        mph: 2.9,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--10',
        conditions: 'Sunny 77&deg;-82&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20047440/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20047441/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/6/2018',
        duration: '3:04',
        miles: 8.5,
        mph: 2.8,
        trail: 'Roadrunner',
        url: 'https://www.alltrails.com/explore/recording/roadrunner--5',
        conditions: 'Cloudy 59&deg;-70&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20031578/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20031582/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/29/2017',
        duration: '4:15',
        miles: 11.6,
        mph: 2.7,
        trail: 'Blue Sky',
        url: 'https://www.alltrails.com/explore/recording/blue-sky--39',
        conditions: 'Sunny 57&deg;-81&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/20011216/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/20011221/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/22/2017',
        duration: '4:16',
        miles: 10.0,
        mph: 2.3,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--9',
        conditions: 'Sunny 50&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19996667/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19996672/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/16/2017',
        duration: '2:47',
        miles: 7.7,
        mph: 2.8,
        trail: 'Eagle Rock',
        url: 'https://www.alltrails.com/explore/recording/eagle-rock--228',
        conditions: 'Cloudy 46&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19988182/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19988193/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/9/2017',
        duration: '4:11',
        miles: 7.5,
        mph: 1.8,
        trail: 'Islip',
        url: 'https://www.alltrails.com/explore/recording/islip--18',
        conditions: 'Sunny 57&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19977284/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19977279/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '12/4/2017',
        duration: '4:09',
        miles: 12.0,
        mph: 2.9,
        trail: 'Skyline',
        url: 'https://www.alltrails.com/explore/recording/skyline--316',
        conditions: 'Windy 57&deg;-64&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19970478/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19970469/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/25/2017',
        duration: '7:23',
        miles: 15.0,
        mph: 2.0,
        trail: 'Mount Wilson',
        url: 'https://www.alltrails.com/explore/recording/mount-wilson--51',
        conditions: 'Sunny 63&deg;-78&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19947069/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19947068/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/20/2017',
        duration: '4:23',
        miles: 12.4,
        mph: 2.8,
        trail: 'Chino Hills',
        url: 'https://www.alltrails.com/explore/recording/chino-hills--29',
        conditions: 'Sunny 57&deg;-75&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19932228/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19932229/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/11/2017',
        duration: '3:48',
        miles: 9.3,
        mph: 2.4,
        trail: 'Mystic Canyon',
        url: 'https://www.alltrails.com/explore/recording/mystic-canyon--3',
        conditions: 'Sunny 52&deg;-73&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19907320/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19907317/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '11/4/2017',
        duration: '4:23',
        miles: 13.7,
        mph: 3.1,
        trail: 'Chino Hills',
        url: 'https://www.alltrails.com/explore/recording/chino-hills--28',
        conditions: 'Sunny 52&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19888067/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19888068/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/30/2017',
        duration: '5:13',
        miles: 16.5,
        mph: 3.2,
        trail: 'Beeks Place',
        url: 'https://www.alltrails.com/explore/recording/beeks-place--2',
        conditions: 'Cloudy 59&deg;-68&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19876838/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19876843/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/21/2017',
        duration: '3:30',
        miles: 11.0,
        mph: 3.2,
        trail: 'Black Star',
        url: 'https://www.alltrails.com/explore/recording/black-star--39',
        morePhotos: 'https://chewi0.smugmug.com/Black-Star-2017/',
        conditions: 'Sunny 46&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19845356/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19845357/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/16/2017',
        duration: '1:52',
        miles: 5.5,
        mph: 3.0,
        trail: 'Carbon Canyon',
        url: 'https://www.alltrails.com/explore/recording/carbon-canyon--36',
        conditions: 'Sunny 61&deg;-82&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19830880/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19830878/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '10/9/2017',
        duration: '4:08',
        miles: 12.1,
        mph: 2.9,
        trail: 'Horseshoe Loop',
        url: 'https://www.alltrails.com/explore/recording/horseshoe--73',
        conditions: 'Wind/Smoke 68&deg;-81&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19805286/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19805287/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/30/2017',
        duration: '3:18',
        miles: 9.5,
        mph: 2.9,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago-oaks',
        conditions: 'Sunny 61&deg;-73&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19768093/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19768094/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/23/2017',
        duration: '2:30',
        miles: 7.6,
        mph: 3.0,
        trail: 'Bumble Bee',
        url: 'https://www.alltrails.com/explore/recording/bumble-bee--5',
        conditions: 'Sunny 55&deg;-66&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19739711/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19739712/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/17/2017',
        duration: '3:09',
        miles: 9.1,
        mph: 2.9,
        trail: 'Willows',
        url: 'https://www.alltrails.com/explore/recording/willows--5',
        conditions: 'Clouds 70&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19718835/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19718836/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/10/2017',
        duration: '1:57',
        miles: 4.2,
        mph: 2.1,
        trail: 'Coachwhip',
        url: 'https://www.alltrails.com/explore/recording/coachwhip--2',
        conditions: 'Sunny 68&deg;-79&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19690301/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19690300/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/4/2017',
        duration: '2:56',
        miles: 6.1,
        mph: 2.1,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/mon-04-sep-2017-18-22',
        conditions: 'Clouds 72&deg;-79&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-kNhFszx/0/266c015f/X2/IMG_3934-X2.jpg','https://photos.smugmug.com/Santiago-Oaks-2017/i-g2GTBVK/0/3d469f9c/X2/IMG_3936-X2.jpg']
    },
    {
        date: '8/26/2017',
        duration: '3:06',
        miles: 8.0,
        mph: 2.6,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--116',
        conditions: 'Sunny 64&deg;-81&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19618494/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19618497/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/18/2017',
        duration: '0:33',
        miles: 1.5,
        mph: 2.7,
        trail: 'Jefferson Barracks',
        url: 'https://www.alltrails.com/explore/recording/jefferson--22',
        morePhotos: 'https://chewi0.smugmug.com/St-Louis-2017/',
        videos: ['https://photos.smugmug.com/St-Louis-2017/i-HpdXRH6/0/e60ef611/960/eclipse-960.mp4'],
        conditions: 'Clouds',
        photos: ['https://photos.smugmug.com/St-Louis-2017/i-HWtLCBP/0/aa658dc8/X3/IMG_3805-X3.jpg','https://www.alltrails.com/api/alltrails/photos/19611717/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/12/2017',
        duration: '3:18',
        miles: 9.2,
        mph: 2.8,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--8',
        conditions: 'Sunny 64&deg;-77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19553985/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19553986/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/5/2017',
        duration: '2:41',
        miles: 7.4,
        mph: 2.8,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--115',
        conditions: 'Sunny 68&deg;-79&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19520353/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19520354/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/31/2017',
        duration: '3:10',
        miles: 8.5,
        mph: 2.7,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--114',
        conditions: 'Clouds/Sunny 68&deg;-78&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19501769/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19501771/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/22/2017',
        duration: '3:35',
        miles: 9.2,
        mph: 2.6,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--7',
        conditions: 'Clouds/Sunny 61&deg;-81&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19454681/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19454680/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/3/2017',
        duration: '2:56',
        miles: 7.1,
        mph: 2.4,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--113',
        conditions: 'Clouds/Sunny 61&deg;-77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19361573/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19361571/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/26/2017',
        duration: '3:27',
        miles: 9.1,
        mph: 2.6,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--112',
        conditions: 'Sunny 72&deg;-91&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19330309/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19330311/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/18/2017',
        duration: '3:33',
        miles: 9.1,
        mph: 2.6,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--5',
        conditions: 'Sunny 68&deg;-86&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19297318/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19297319/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/12/2017',
        duration: '3:13',
        miles: 8.9,
        mph: 2.8,
        trail: 'Pipeline',
        url: 'https://www.alltrails.com/explore/recording/pipeline--65',
        morePhotos: 'https://chewi0.smugmug.com/Pipeline-2017/',
        conditions: 'Mostly sunny 59&deg;-75&deg;',
        photos: ['https://photos.smugmug.com/Pipeline-2017/i-K9sWpqJ/0/c6d9d65d/X2/IMG_3658-X2.jpg','https://photos.smugmug.com/Pipeline-2017/i-RgWkpmV/0/a0e3225d/X2/IMG_3639-X2.jpg']
    },
    {
        date: '6/3/2017',
        duration: '2:27',
        miles: 7.3,
        mph: 3.0,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--108',
        conditions: 'Partly cloudy 68&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19241263/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19241261/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/29/2017',
        duration: '3:21',
        miles: 8.9,
        mph: 2.6,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--107',
        conditions: 'Cloudy 60&deg;-68&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19223331/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19223330/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/20/2017',
        duration: '3:22',
        miles: 9.0,
        mph: 2.7,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/wier-santiago',
        conditions: 'Sunny 72&deg;-90&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19186885/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19186886/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/06/2017',
        duration: '2:32',
        miles: 7.5,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--106',
        conditions: 'Cloudy 65&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19145615/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19145617/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/29/2017',
        duration: '3:33',
        miles: 10.6,
        mph: 3.0,
        trail: 'Carbon Canyon',
        url: 'https://www.alltrails.com/explore/recording/carbon-canyon--32',
        conditions: 'Sunny, windy, 75&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19126227/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19126218/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/21/2017',
        duration: '3:26',
        miles: 9.4,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2141671064',
        conditions: 'Sunny 65&deg;-85&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-pW7Nm8s/0/c4fd0a79/X2/IMG_3527-X2.jpg']
    },
    {
        date: '4/15/2017',
        duration: '3:36',
        miles: 10.0,
        mph: 2.9,
        trail: 'Weir Santiago',
        url: 'http://www.mapmyhike.com/workout/2128475384',
        conditions: 'Sunny',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-pKGNnwh/0/080d0888/X2/IMG_3504-X2.jpg']
    },
    {
        date: '4/9/2017',
        duration: '1:49',
        miles: 4.0,
        mph: 2.2,
        trail: 'Charleston, SC',
        morePhotos: 'https://chewi0.smugmug.com/Charleston-2017/',
        url: 'http://www.mapmyhike.com/workout/2114944868',
        conditions: 'Sunny',
        photos: ['https://photos.smugmug.com/Charleston-2017/i-PZPv3Gz/0/be4cc1e1/X2/IMG_3485-X2.jpg','https://photos.smugmug.com/Charleston-2017/i-fWwRncm/0/e8a14dc9/X2/IMG_3479-X2.jpg']
    },
    {
        date: '4/1/2017',
        duration: '3:19',
        miles: 9.7,
        mph: 3.0,
        trail: 'Weir Santiago',
        url: 'http://www.mapmyhike.com/workout/2097822530',
        conditions: 'Sunny 65&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-Z2PTnh3/0/2e4ab7bf/X2/IMG_3287-X2.jpg']
    },
    {
        date: '3/26/2017',
        duration: '3:16',
        miles: 8.9,
        mph: 2.7,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--4',
        conditions: 'Partly cloudy 62&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19029413/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19029412/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/20/2017',
        duration: '3:54',
        miles: 10.7,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2073413747',
        conditions: 'Cloudy 60&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-HKvmmVn/0/6ac1fc44/X2/IMG_3240-X2.jpg','https://photos.smugmug.com/Santiago-Oaks-2017/i-8MCBsnk/0/fe88de43/X2/IMG_3255-X2.jpg']
    },
    {
        date: '3/18/2017',
        duration: '2:54',
        miles: 8.3,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2069622365',
        conditions: 'Mostly sunny 70&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-vWVS49G/0/72f9cdda/X2/IMG_3207-X2.jpg','https://photos.smugmug.com/Santiago-Oaks-2017/i-ntrRJ5j/0/8d320a8b/X2/IMG_3203-X2.jpg']
    },
    {
        date: '3/12/2017',
        duration: '2:59',
        miles: 8.5,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2058980468/',
        conditions: 'Sunny 70&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-fsLJp2p/0/edb35366/X2/IMG_3191-X2.jpg']
    },
    {
        date: '3/6/2017',
        duration: '2:49',
        miles: 7.9,
        mph: 2.8,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2047464806',
        conditions: 'Sunny 60&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-QVCLn4K/0/6a3521c7/X2/IMG_3181-X2.jpg','https://photos.smugmug.com/Santiago-Oaks-2017/i-7JpCLBv/0/70a26eb0/X2/IMG_3172-X2.jpg']
    },
    {
        date: '3/4/2017',
        duration: '3:13',
        miles: 10.0,
        mph: 3.1,
        trail: 'Weir Santiago',
        url: 'http://www.mapmyhike.com/workout/2043857987',
        conditions: 'Overcast 63&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-fg4L3BC/0/efbf0a66/X2/IMG_3156-X2.jpg']
    },
    {
        date: '2/25/2017',
        duration: '3:14',
        miles: 9.0,
        mph: 2.8,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--3',
        conditions: 'Sunny 48&deg;-60&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/18218531/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/18218525/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/12/2017',
        duration: '2:39',
        miles: 5.8,
        mph: 2.2,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--98',
        conditions: 'Sunny 68&deg;, muddy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/18012764/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/18012750/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/5/2017',
        duration: '3:18',
        miles: 8.9,
        mph: 2.7,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--2',
        conditions: 'Cloudy misty 57&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/17821656/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/17821655/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/29/2017',
        duration: '2:54',
        miles: 7.4,
        mph: 2.6,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--96',
        conditions: 'Sunny 77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/17729885/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/17729886/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/15/2017',
        duration: '2:53',
        miles: 7.5,
        mph: 2.6,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--89',
        conditions: 'Mostly cloudy 58&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/17188161/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/17188154/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/8/2017',
        duration: '2:40',
        miles: 7.2,
        mph: 2.7,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--86',
        conditions: 'Mostly sunny 72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/16799731/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/16799727/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/10/2016',
        duration: '2:52',
        miles: 7.2,
        mph: 2.5,
        trail: 'Jones',
        url: 'https://www.alltrails.com/explore/recording/jones--10',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/13360607/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/13360612/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/18/2016',
        duration: '6:27',
        miles: 13.9,
        mph: 2.1,
        trail: 'Mt. Whitney',
        url: 'https://www.alltrails.com/explore/recording/whitney-4--2',
        morePhotos: 'https://chewi0.smugmug.com/Whitney-2016/',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/12134576/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/12134571/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/14/2016',
        duration: '2:16',
        miles: 5.3,
        mph: 2.3,
        trail: 'Onion Valley',
        url: 'https://www.alltrails.com/explore/recording/onion-valley--10',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/12135505/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/12135500/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/2/2016',
        duration: '3:58',
        miles: 9.7,
        mph: 2.4,
        trail: 'Mt. Baldy',
        url: 'https://www.alltrails.com/explore/recording/baldy--66',
        morePhotos: 'https://chewi0.smugmug.com/Baldy-2016/',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/11680953/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/11680952/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/19/2016',
        duration: '1:15',
        miles: 3.3,
        mph: 2.7,
        trail: 'Castlewood',
        url: 'https://www.alltrails.com/explore/recording/castlewood--33',
        conditions: 'Sunny',
        morePhotos: 'https://chewi0.smugmug.com/St-Louis-2016/',
        photos: ['https://www.alltrails.com/api/alltrails/photos/11602608/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/11602607/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },

];
