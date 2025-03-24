const HIGHLIGHT = "highlight";
const POINTER = "pointer";
const BORDER = "imgBorder";
const LEFT = "#left";
const RIGHT = "#right";
const CHART = "#chart";
const HTABLE = "#htable";
const CLEAR = "filterClear";
const HEADERS = ["Date", "Miles", "MPH", "Time", "Conditions", "Trail"];
const HIKE_STORE = "hikeStore";
const milesPerYear = getMonthlyMilesByYear();
let sort = {name:"Date", ascending:false};
let $myStats;
let $filter;
let fHikes;
let myChart;

function init() {
    initFilters();
    titleDefault();
    initTable();
    initFilter();
    initStats();
    initHandlers();
    selectHike();
}

function titleDefault() {
    document.title = "CH hikes (" + fHikes.length + ")";
}

function selectHike() {
    let hikeStore = localStorage.getItem(HIKE_STORE);

    if (hikeStore) {
        hikeStore = JSON.parse(hikeStore);
        const index = fHikes.findIndex(hike => hike.date === hikeStore.date && hike.trail === hikeStore.trail);
        if (index >= 0) {
            highlightHike(index, true);  // true = center highlight
        }
    }
}

function saveHike() {
    let hikeStore = {};
    const $highlight = $(LEFT + " ." + HIGHLIGHT);

    if ($highlight[0]) {
        const hike = fHikes[$highlight[0].rowIndex - 1];
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

    $doc.keyup(event => {
        if ('f' === event.key.toLowerCase()) {
            $("#filter").focus();
        }
    });

    document.addEventListener('fullscreenchange', exitFullScreenHandler);
    resize();
    $(window).resize(resize);
}

function resize() {
    const $right = $(RIGHT);

    if ($right[0].scrollHeight > $right.innerHeight()) {
        $right.addClass("has-scrollbar").removeClass("no-scrollbar");
    }
    else {
        $right.addClass("no-scrollbar").removeClass("has-scrollbar");
    }

    myChart.update();
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
    else if ($target[0].id === CLEAR) {
        $filter.val('');
        applyFilter();
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
        if (index >= fHikes.length) {
            index = 0;
        }
        highlightHike(index);
    }
    else if ("ArrowUp" === event.key) {
        index--;
        if (index < 0) {
            index = fHikes.length - 1;
        }
        highlightHike(index);
    }
    else if ("Home" === event.key) {
        $(HTABLE).scrollTop(0);
    }
    else if ("End" === event.key) {
        const $tbl = $(HTABLE);
        $tbl.scrollTop($tbl[0].scrollHeight);
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
    else if ("filter" === event.target.id) {
        applyFilter();
    }
}

function page(down) {
    const $tbl = $(HTABLE);
    const rowHeight = $(HTABLE + ' table tr').outerHeight();
    const rowsPerPage = Math.floor($tbl.height() / rowHeight);

    if (down) {
        $tbl.scrollTop($tbl.scrollTop() + rowHeight * rowsPerPage);
    }
    else {
        $tbl.scrollTop($tbl.scrollTop() - rowHeight * rowsPerPage);
    }
}

function highlightHike(index, center) {
    const $rows = $(LEFT + " tbody tr");
    const $row = $($rows[index]);

    hover($row, center);
}

function openUrl(index) {
    if (!isMobile()) {
        const hike = fHikes[index];
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
        fHikes.sort(function(a, b) {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);
            return sort.ascending ? dateA - dateB : dateB - dateA;
        });
    }
    else if ("Miles" === sort.name) {
        fHikes.sort(function(a, b) {
            return sort.ascending ? a.miles - b.miles : b.miles - a.miles;
        });
    }
    else if ("MPH" === sort.name) {
        fHikes.sort(function(a, b) {
            aMph = toMph(a);
            bMph = toMph(b);
            return sort.ascending ? aMph - bMph : bMph - aMph;
        });
    }
    else if ("Time" === sort.name) {
        fHikes.sort(function(a, b) {
            aTime = toMinutes(a.duration);
            bTime = toMinutes(b.duration);
            return sort.ascending ? aTime - bTime : bTime - aTime;
        });
    }
    else if ("Conditions" === sort.name) {
        fHikes.sort((a, b) => {
            let tempA = extractTemperature(a.conditions);
            let tempB = extractTemperature(b.conditions);

            if (tempA === null && tempB === null) return 0; // Both missing, keep order
            if (tempA === null) return 1;  // Move A to the bottom
            if (tempB === null) return -1; // Move B to the bottom

            return sort.ascending ? tempA - tempB : tempB - tempA;
        });
    }
    else if ("Trail" === sort.name) {
        fHikes.sort(function(a, b) {
            let trailA = a.trail.toLowerCase();
            let trailB = b.trail.toLowerCase();
            return sort.ascending ? trailA.localeCompare(trailB) : trailB.localeCompare(trailA);
        });
    }

    initTable(true); // true sorted
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

function initFilters() {
    hikes.forEach(hike => {
        if (!hike.tags) {
            hike.tags = [];
        }
        hike.tags.push(hike.trail);
        hike.tags.push(hike.conditions);
        if (hike.unique) {
            hike.tags.push("unique");
        }
    });

    fHikes = hikes.slice();
}

function applyFilter() {
    setTimeout(() => {
        const val = $filter.val().trim().toLowerCase();
        const $clear = $("#" + CLEAR);

        if (val.length > 0) {
            $clear.show();
        }
        else {
            $clear.hide();
        }

        fHikes = [];
        for (let i = 0; i < hikes.length; i++) {
            const tags = hikes[i].tags;
            if (val.length < 1 || tags.some(tag => tag.toLowerCase().includes(val))) {
                fHikes.push(hikes[i]);
            }
        }

        applySort();
        titleDefault();
        setLeftWidth(val);
    }, 0);
}

function setLeftWidth(filter) {
    if (!filter || filter.length < 1) {
        const $left = $(LEFT);
        const width = $left.outerWidth() + "px";
        $left.css("min-width", width);
    }
}

function initTable(sort) {
    const $left = $(LEFT);
    const $htable = sort ? $(HTABLE) : $("<div id='htable'>");
    const $table = $("<table>");
    const $thead = $("<thead>");
    const $tbody = $("<tbody>");
    const $headerRow = $("<tr>");

    HEADERS.forEach(header => {
        $headerRow.append($("<th>").html(header));
    });

    $thead.append($headerRow);
    $table.append($thead);

    fHikes.forEach(hike => {
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
    $htable.empty();
    $htable.append($table);
    if (!sort) {
        $left.append($htable);
    }
    updateHeaders();
    setLeftWidth();

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

    fHikes.forEach(hike => {
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

    $myStats = $("<div id='stats'>");
    const $table = $("<table>");
    const $thead = $("<thead>");
    const $tbody = $("<tbody>");
    const $headerRow = $("<tr>");
    const headers = ["Year", "Hikes", "Miles", "Time"];

    if (!isMobile()) {
        $myStats.addClass("statsTable");
    }

    headers.forEach(header => {
        $headerRow.append($("<th>").html(header));
    });

    $thead.append($headerRow);
    $table.append($thead);

    list.forEach(entry => {
        const cols = [entry.year, entry.count, entry.miles.toFixed(1), minutesToTime(entry.minutes)];
        const $row = $("<tr>");

        cols.forEach(col => {
            $row.append($("<td>").html(col));
        });

        $tbody.append($row);
    });

    $table.append($tbody);
    $myStats.append($table);

    initChart();
    $(RIGHT).append($myStats);
    initYearHoverListener();
}

function initYearHoverListener() {
    $(RIGHT + ' tbody tr').hover(
        function() {
            yearHover($(this));
        }
    );

    $(RIGHT + ' thead tr').hover(
        function() {
            clearHover();
        }
    );
}

function yearHover($row) {
    if (document.hasFocus() && !$row.hasClass(HIGHLIGHT)) {
        const year = $row.find('td').first().text();

        $(RIGHT + " ." + HIGHLIGHT).removeClass(HIGHLIGHT);
        $row.addClass(HIGHLIGHT);
        myChart.data.datasets[0].data = milesPerYear[year];
        myChart.update();
        $(CHART).show();
    }
}

function getMonthlyMilesByYear() {
    // Create an object to store yearly data
    const yearlyMiles = {};
    
    // Process each hike
    $.each(hikes, function(index, hike) {
        // Split the date string into components
        const [month, day, year] = hike.date.split('/').map(Number);
        
        // If year doesn't exist in object, initialize it with array of 12 months (0-11)
        if (!yearlyMiles[year]) {
            yearlyMiles[year] = Array(12).fill(0);
        }
        
        // Add miles to the appropriate month (month-1 since arrays are 0-based)
        yearlyMiles[year][month - 1] += hike.miles;
    });

    // Round all values to nearest tenth
    $.each(yearlyMiles, function(year) {
        yearlyMiles[year] = yearlyMiles[year].map(miles => 
            Math.round(miles * 10) / 10
        );
    });

    return yearlyMiles;
}

function initChart() {
    const $chart = $("<div id='chart'>");
    const $canvas = $("<canvas id='myCanvas'>");
    const canvas = $canvas[0];

    $chart.append($canvas);
    $myStats.append($chart);
    $chart.attr("title", "Miles hiked per month");
    canvas.width = $chart.width();
    canvas.height = $chart.height();

    const ctx = canvas.getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{ label: 'Values', data: [], backgroundColor: 'darkGray' }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Disables all animations
            layout: {
                padding: {
                    top: 25 // Adds space at the top
                }
            },
            plugins: {
                legend: {
                    display: false // Hides the legend
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: 'antiquewhite',
                    font: {
                        weight: 'bold'
                    },
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] !== 0; // Hide if value is 0
                    }
                }
            }
        }
    });

    $chart.hide();
}

function initFilter() {
    const $filterBox = $("<div id='filterBox'>");
    $filter = $("<input id='filter'>");
    const $filterClear = $("<span id='" + CLEAR + "'>");
    $filter.attr("title", "Filter by Condition, Trail, or tag such as:\nLarry, Kevin, Taiwan, Utah, Unique, Snake, Deer");
    $filterBox.append($filter);
    $filterClear.html("X");
    $filterClear.attr("title", "Clear filter");
    $filterBox.append($filterClear);
    $(LEFT).append($filterBox);
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
        const hike = fHikes[index];
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
        $(CHART).hide();
        initYearHoverListener();
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
