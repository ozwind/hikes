const HIGHLIGHT = "highlight";
const POINTER = "pointer";
const BORDER = "imgBorder";
const LEFT = "#left";
const RIGHT =  "#right";
const HEADERS = ["Date", "Miles", "MPH", "Time", "Conditions", "Trail"];
const HIKE_STORE = "hikeStore";
let sort = {name:"Date", ascending:false};
let $myStats;

function init() {
    titleDefault();
    initTable();
    initStats();
    initHandlers();
    selectHike();
}

function titleDefault() {
    document.title = "CH hikes (" + hikes.length + ")";
}

function selectHike() {
    let hikeStore = localStorage.getItem(HIKE_STORE);

    if (hikeStore) {
        hikeStore = JSON.parse(hikeStore);
        const index = hikes.findIndex(hike => hike.date === hikeStore.date && hike.trail === hikeStore.trail);
        if (index >= 0) {
            highlightHike(index, true);  // true = center highlight
        }
    }

}

function saveHike() {
    let hikeStore = {};
    const $highlight = $(LEFT + " ." + HIGHLIGHT);

    if ($highlight[0]) {
        const hike = hikes[$highlight[0].rowIndex - 1];
        hikeStore.date = hike.date;
        hikeStore.trail = hike.trail;
    }
    localStorage.setItem(HIKE_STORE, JSON.stringify(hikeStore));
}

function initHandlers() {
    const $doc = $(document);

    $doc.click(event => {
        click(event);
    });

    $doc.keydown(event => {
        keydown(event);
    });

    document.addEventListener('fullscreenchange', exitFullScreenHandler);
    checkScrollbar();
    $(window).on("resize", checkScrollbar);
}

function checkScrollbar() {
    const $right = $(RIGHT);

    if ($right[0].scrollHeight > $right.innerHeight()) {
        $right.addClass("has-scrollbar").removeClass("no-scrollbar");
    }
    else {
        $right.addClass("no-scrollbar").removeClass("has-scrollbar");
    }
}

function click(event) {
    const $target = $(event.target);
    const $tr = $target.closest(LEFT + " tr");

    if ($tr.hasClass(HIGHLIGHT)) {
        openUrl($tr[0].rowIndex - 1);
    }
    else if ($target.is("img")) {
        $target.removeClass(BORDER);
        $target[0].requestFullscreen();
    }
    else if ($tr.length > 0 && $tr[0].rowIndex > 0) {
        hover($tr);
    }
    else if ($target.is(LEFT + " th")) {
        const name = toName($target);
        const $headers = $(LEFT + " th");
        for (let i = 0; i < $headers.length; i++) {
            const $th = $($headers[i]);
            if (name === toName($th)) {
                const ascending = sort.name === name ? !sort.ascending : "Trail" === name;
                sort = {name, ascending};
                break;
            }
        }
        applySort();
    }
}

function keydown(event) {
    const $highlight = $(LEFT + " ." + HIGHLIGHT);
    let index = $highlight.length > 0 ? $highlight[0].rowIndex - 1 : -1;

    if ("Enter" === event.key && index >= 0) {
        openUrl(index);
    }
    else if ("ArrowDown" === event.key) {
        index++;
        if (index >= hikes.length) {
            index = 0;
        }
        highlightHike(index);
    }
    else if ("ArrowUp" === event.key) {
        index--;
        if (index < 0) {
            index = hikes.length - 1;
        }
        highlightHike(index);
    }
    else if ("Home" === event.key) {
        $(LEFT).scrollTop(0);
    }
    else if ("End" === event.key) {
        const $left = $(LEFT);
        $(LEFT).scrollTop($left[0].scrollHeight);
    }
    else if ("PageDown" === event.key) {
        page(true);
    }
    else if ("PageUp" === event.key) {
        page(false);
    }
    else if ("Escape" === event.key) {
        clearHover();
    }
}

function page(down) {
    const $left = $(LEFT);
    const rowHeight = $(LEFT + ' table tr').outerHeight();
    const rowsPerPage = Math.floor($left.height() / rowHeight);

    if (down) {
        $left.scrollTop($left.scrollTop() + rowHeight * rowsPerPage);
    }
    else {
        $left.scrollTop($left.scrollTop() - rowHeight * rowsPerPage);
    }
}

function highlightHike(index, center) {
    const $rows = $(LEFT + " tbody tr");
    const $row = $($rows[index]);

    hover($row, center);
}

function openUrl(index) {
    if (!isMobile()) {
        const hike = hikes[index];
        window.open(hike.url, "_blank");
    }
}

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function exitFullScreenHandler() {
    if (!document.fullscreenElement) {
        $("img").addClass(BORDER);
    }
}

function applySort() {
    const $headers = $(LEFT + " th");

    for (let i = 0; i < $headers.length; i++) {
        const $th = $($headers[i]);
        let symbol = "";

        if (sort.name === toName($th)) {
            symbol = sort.ascending ? " &#x25B2;" : " &#x25BC;";
        }

        $th.html(HEADERS[i] + symbol);
    }

    if ("Date" === sort.name) {
        hikes.sort(function(a, b) {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);
            return sort.ascending ? dateA - dateB : dateB - dateA;
        });
    }
    else if ("Miles" === sort.name) {
        hikes.sort(function(a, b) {
            return sort.ascending ? a.miles - b.miles : b.miles - a.miles;
        });
    }
    else if ("MPH" === sort.name) {
        hikes.sort(function(a, b) {
            aMph = toMph(a);
            bMph = toMph(b);
            return sort.ascending ? aMph - bMph : bMph - aMph;
        });
    }
    else if ("Time" === sort.name) {
        hikes.sort(function(a, b) {
            aTime = toMinutes(a.duration);
            bTime = toMinutes(b.duration);
            return sort.ascending ? aTime - bTime : bTime - aTime;
        });
    }
    else if ("Conditions" === sort.name) {
        hikes.sort((a, b) => {
            let tempA = extractTemperature(a.conditions);
            let tempB = extractTemperature(b.conditions);

            if (tempA === null && tempB === null) return 0; // Both missing, keep order
            if (tempA === null) return 1;  // Move A to the bottom
            if (tempB === null) return -1; // Move B to the bottom

            return sort.ascending ? tempA - tempB : tempB - tempA;
        });
    }
    else if ("Trail" === sort.name) {
        hikes.sort(function(a, b) {
            let trailA = a.trail.toLowerCase();
            let trailB = b.trail.toLowerCase();
            return sort.ascending ? trailA.localeCompare(trailB) : trailB.localeCompare(trailA);
        });
    }

    initTable();
}

function updateHeaders() {
    const $headers = $(LEFT + " th");

    for (let i = 0; i < $headers.length; i++) {
        const $th = $($headers[i]);
        let symbol = "";

        if (sort.name === toName($th)) {
            symbol = sort.ascending ? " &#x25B2;" : " &#x25BC;";
        }

        $th.html(HEADERS[i] + symbol);
    }
}

function toName($target) {  // strip out any space and ascending/desceding label
    return $target.text().split(" ")[0];
}

function toMinutes(timeStr) {
    let parts = timeStr.split(":");
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
}

function extractTemperature(conditions) {
    let match = conditions.match(/(-?\d+)°\/(-?\d+)°|(-?\d+)°/);
    if (match) {
        let low = match[1] !== undefined ? parseInt(match[1], 10) : null;
        let high = match[2] !== undefined ? parseInt(match[2], 10) : null;
        let singleTemp = match[3] !== undefined ? parseInt(match[3], 10) : null;

        return sort.ascending ? (low ?? singleTemp) : (high ?? singleTemp);
    }
    return null; // If no temperature found
}

function initTable() {
    const $left = $(LEFT);
    const $table = $("<table>");
    const $thead = $("<thead>");
    const $tbody = $("<tbody>");
    const $headerRow = $("<tr>");

    HEADERS.forEach(header => {
        $headerRow.append($("<th>").html(header));
    });

    $thead.append($headerRow);
    $table.append($thead);

    hikes.forEach(hike => {
        const $row = $("<tr>");
        const mph = hike.mph ? hike.mph : toMph(hike);
        const cols = [formatDate(hike.date), hike.miles.toFixed(1), mph.toFixed(1), hike.duration, hike.conditions, hike.trail];

        cols.forEach(col => {
            $row.append($("<td>").text(col));
        });

        $row.addClass(POINTER);
        $row.attr("title", "Click for details");
        $tbody.append($row);

        if (hike.unique) {
            $row.addClass('unique');
        }
    });

    $table.append($tbody);
    $left.empty();
    $left.append($table);
    updateHeaders();

    $(LEFT + ' tbody tr').hover(
        function() {
            hover($(this));
        }
    );

    $(LEFT + " thead tr").hover(
        function() {
            clearHover();
        }
    );
}

function initStats() {
    let list = [];
    let entry = {};
    let currentYear = 0;

    hikes.forEach(hike => {
        const year = hike.date.split("/")[2];
        if (year === currentYear) {
            entry.count++;
            entry.miles += hike.miles;
            entry.minutes += toMinutes(hike.duration);
        }
        else {
            if (currentYear != 0) {
                list.push(entry);
            }
            entry = {};
            entry.year = year;
            entry.count = 1;
            entry.miles = hike.miles;
            entry.minutes = toMinutes(hike.duration);
            currentYear = year;
        }
    });

    if (list.length > 0 && list[list.length -1].year != entry.year) {
        list.push(entry);
    }

    $myStats = $("<table>");
    const $thead = $("<thead>");
    const $tbody = $("<tbody>");
    const $headerRow = $("<tr>");
    const headers = ["Year", "Hikes", "Miles", "Time"];

    headers.forEach(header => {
        $headerRow.append($("<th>").html(header));
    });

    $thead.append($headerRow);
    $myStats.append($thead);

    list.forEach(entry => {
        const cols = [entry.year, entry.count, entry.miles.toFixed(1), minutesToTime(entry.minutes)];
        const $row = $("<tr>");

        cols.forEach(col => {
            $row.append($("<td>").html(col));
        });

        $tbody.append($row);
    });

    $myStats.append($tbody);

    $(RIGHT).append($myStats);
}

function minutesToTime(minutes) {
    let days = Math.floor(minutes / (24 * 60));
    let hours = Math.floor((minutes % (24 * 60)) / 60);
    let mins = minutes % 60;
    let dayStr = days === 1 ? "day, &nbsp;" : "days,";

    // Format HH and MM with leading zeros if needed
    let formattedTime = `${days} ${dayStr} ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

    return formattedTime;
}

function toMph(hike) {
    var dur = hike.duration.split(":");
    var time = parseInt(dur[0]) + parseInt(dur[1]) / 60.0;
    return hike.miles / time;
}

function formatDate(dateStr) {
    return dateStr.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, function(match, m, d, y) {
        return `${m.padStart(2, '0')}/${d.padStart(2, '0')}/${y}`;
    });
}

function hover($this, center) {
    if (document.hasFocus() && !$this.hasClass(HIGHLIGHT)) {
        const index = $this[0].rowIndex - 1;
        const block = center ? "center" : "nearest";
        $("." + HIGHLIGHT).removeClass(HIGHLIGHT);
        $this.addClass(HIGHLIGHT);
        const hike = hikes[index];
        showPhotos(hike);

        $("#focusHelper").focus(); // Redirect focus away from the scrollbar
        $this[0].scrollIntoView({ behavior: "smooth", block }); // scroll to make visible

        if (index === 0) {  // Make sure header shows when 1st row selected
            $(LEFT + " thead")[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }
}

function clearHover() {
    if (document.hasFocus()) {
        const $right = $(RIGHT);
        $("." + HIGHLIGHT).removeClass(HIGHLIGHT);
        $right.empty();
        $right.append($myStats);
        saveHike();
        titleDefault();
    }
}

function showPhotos(hike) {
    const $right = $(RIGHT);
    const $photos = $('<div id="photos">');

    document.title = "CH hike " + hike.date;
    for (let i = 0; i < hike.photos.length; i++) {
        const url = hike.photos[i];
        let caption = hike.captions && hike.captions[i] ? (hike.captions[i] + "\n") : "";
        caption += "Click for full screen";
        const $img = $("<img>").attr("src", url);
        $img.attr("title", caption);
        $img.addClass(BORDER);
        $photos.append($img);
    }

    setTimeout(() => {  // short timeout to remove small brief annoying display artifact
        $right.empty();
        $right.append($photos);
        saveHike();

        if (hike.morePhotos) {
            const $links = $('<div id="links">');
            const $more = $('<a target="_blank">');
            $more.text("More photos");
            $more.attr("href", hike.morePhotos);
            $links.append($more);
            $right.append($links);
        }
    }, 10);
}
