var hikes = hikes || new Hikes();

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
                        "'><img class='thumb' onmouseover='mouseover(this)' onmouseout='mouseout(this)' src='" + data[i].photos[j] + "'></a>";
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
                "<td class='trail'><a href='" + data[i].url + "'>" + data[i].trail + "</a></td>" +
                "<td class='conditions'>" + data[i].conditions + morePhotos + "</td>" +
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

        var spaces = "&nbsp;&nbsp;&nbsp;";
        $("#thMiles").html(data[furthest].miles + spaces + data[furthest].date);
        $("#thMPH").html(data[fastest].mph + spaces + data[fastest].date);
        $("#thDuration").html(data[longest].duration + spaces + data[longest].date);
        $("#thCond").html(data[coldest].low + "°" + spaces + data[coldest].date + "\n"
                         + data[warmest].high + "°" + spaces + data[warmest].date);
    }
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

var data = [
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
