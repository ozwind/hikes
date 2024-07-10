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
                    var klass = 'thumb';
                    if (j === (data[i].photos.length - 1)) {
                        klass += ' lastThumb';
                    }
                    photos += "<img class='" + klass + "' onmouseover='mouseover(this)' onmouseout='mouseout(this)' onclick='imgClick(this)' loading='lazy' src='" + data[i].photos[j] + "' idxsrc='" + i + "' idxphoto='" + j + "'>";
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
                "<td class='trail'><a href='" + data[i].url + "' target='_blank'>" + data[i].trail + "</a></td>" +
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
        $("#trailHead").attr("title", data.length + " hikes since 2016");
        setSize();
        setTimeout(()=>{
            $('html, body').scrollTop(0);            
        },0);

        document.addEventListener('fullscreenchange', exitFullScreenHandler);
    }
}

function exitFullScreenHandler() {
    if (!document.fullscreenElement) {
        document.clicked.$img.css('border-radius', document.clicked.radius);
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

const animate = (tooltip, date) => {
    $("#" + tooltip).on('click', () => {
        var elem = $("td:contains('" + date + "')");
        $('html, body').animate({scrollTop: elem.offset().top - 2}, 1000);
    });    
}

function imgClick(img) {
    const $img = $(img);
    const radius = $img.css('border-radius');
    document.clicked = {$img, radius};
    $img.css('border-radius', 'unset');
    img.requestFullscreen();
}

function mouseover(img) {
    var windowpos = $(window).scrollTop();
    $("#rollImg").attr("src", img.src);
    $("#rollImg").css("display", "flex");
    $(".image").css("top", windowpos);
    let idxSrc = Number($(img).attr('idxsrc'));
    let idxPhoto = Number($(img).attr('idxphoto'));
    var caption = "";
    if (data[idxSrc].captions && idxPhoto < data[idxSrc].captions.length) {
        caption = data[idxSrc].captions[idxPhoto];
    }
    $("#rollCaption").text(caption);
}

function mouseout(img) {
    $("#rollImg").css("display", "none");
    $("#rollCaption").text("");
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

function setSize(toggle) {
    const halfHeightName = 'halfHeight';
    var halfHeightStore = localStorage.getItem(halfHeightName);
    var halfHeight = false;

    if (halfHeightStore != null) {
        halfHeight = JSON.parse(halfHeightStore);
    }

    if (toggle) {
        halfHeight = !halfHeight;
        localStorage.setItem(halfHeightName, halfHeight);
    }

    if (halfHeight) {
        $('.thumb').addClass('imgHalfHeight');
    }
    else {
        $('.thumb').removeClass('imgHalfHeight');
    }
}

function toggleSize() {
    setSize(true);

    $('html, body').scrollTop(1);
    $('html, body').scrollTop(0);
}

function toHours(str) {
    var dur = str.split(":");
    return parseInt(dur[0]) + parseInt(dur[1]) / 60.0;
}