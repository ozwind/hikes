var storm = storm || new Storm();

function Storm() {
    var currentCity = 0;
    const chartX = 165;
    const chartY = 50;
    const summer = 'yellow';
    const spring = '#00ff00';
    const winter = 'gray';
    const cityStore = 'cityStore';
    const imgX = 2;
    const imgY = 2;
    const imgWidth = 130;
    const imgHeight = 90;

    this.init = function() {
        const myCanvas = $("#myCanvas");
        this.width = myCanvas.width();
        this.height = myCanvas.height();
        var self = this;
        $("#previous").click(function() {
            self.previous();
        });
        $("#next").click(function() {
            self.next();
        });
        $(document).keydown(function(event) {
            if (document.activeElement != $('#cities')[0]) {
                if (event.which == 37) {
                    self.previous();
                }
                else if (event.which == 39) {
                    self.next();
                }
                else {
                    for (var i = 0; i < stats.length; i++) {
                        if (stats[i].name.charCodeAt(0) == event.which) {
                            currentCity = i;
                            self.show();
                            break;
                        }
                    }
                }
            }
        });
        this.initPicklist();
        this.initMouseListeners();
        var name = localStorage.getItem(cityStore);
        if (!name) {
            name = "Los Angeles";  // default
        }
        this.setCity(name);
    }

    this.initMouseListeners = function() {
        var self = this;

        myCanvas.addEventListener("mousemove", function(event) {
            if (stats[currentCity].img) {
                var ex = event.offsetX;
                var ey = event.offsetY;
                if (ex > imgX && ey > imgY && ex < (imgX + imgWidth) && ey < (imgY + imgHeight)) {
                    document.body.style.cursor = "pointer";
                    self.inLink = true;
                }
                else {
                    document.body.style.cursor = "";
                    self.inLink = false;
                }
            }
            else {
                self.inLink = false;
            }
        });

        myCanvas.addEventListener("click", function(event) {
            if (self.inLink) {
                console.log("click");
                window.location = stats[currentCity].img;
            }
        });
    }

    this.initPicklist = function() {
        var self = this;
        var cities = $('#cities');

        for (var i = 0; i < stats.length; i++) {
            var name = stats[i].name;
            var option = document.createElement('option');
            option.setAttribute('value', name);
            option.appendChild(document.createTextNode(name));
            cities.append(option);
        }

        cities.change(function(event) {
            self.setCity(event.target.value);
            self.show();
        });
    }

    this.setCity = function(name) {
        if (name) {
            for (var i = 0; i < stats.length; i++) {
                if (stats[i].name.includes(name)) {
                    currentCity = i;
                    break;
                }
            }            
        }
    }

    this.previous = function() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        currentCity--;
        if (currentCity < 0) {
            currentCity = stats.length - 1;
        }
        this.show();                    
    }

    this.next = function() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        currentCity++;
        if (currentCity >= stats.length) {
            currentCity = 0;
        }
        this.show();
    }

    this.show = function() {
        var city = stats[currentCity];
        var cities = $('#cities');
        cities.val(city.name);
        localStorage.setItem(cityStore, city.name);
        var canvas = document.getElementById("myCanvas");
        this.ctx = canvas.getContext("2d");
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.chart(city);
        this.ctx.font = "14px Verdana";
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(city.name + " (" + city.elev + "')", chartX + 5, chartY - 16);
        this.displayImage(city);
    }

    this.displayImage = function(city) {
        if (city.img) {
            var self = this;
            var img = new Image;
            img.onload = function() {
                var sx = imgWidth / img.width;
                var sy = imgHeight / img.height;
                var scale = Math.min(sx, sy);
                var width = img.width * scale;
                var height = img.height * scale;
                var x = imgX + (imgWidth - width) / 2;
                var y = imgY + (imgHeight - height) / 2;
                self.ctx.drawImage(img, x, y, width, height);
                self.loading = false;
            };
            img.onerror = function() {
                self.loading = false;
            };
            img.src = city.img;
        }
        else {
            this.loading = false;
        }
    }

    this.chart = function(city) {
        var chartWidth = 324;
        var chartHeight = 210;
        var chartLines = 7;
        var segHeight = chartHeight / chartLines;
        var monthWidth = chartWidth / city.precip.length;
        this.ctx.strokeStyle = "#c3c3c3";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(chartX, chartY, chartWidth, chartHeight);
        this.ctx.beginPath();

        for (var i = 1; i < chartLines; i++) {
            var yPos = chartY + (i * segHeight);
            this.ctx.moveTo(chartX, yPos);
            this.ctx.lineTo(chartX + chartWidth, yPos);
            this.ctx.stroke();
        }

        // Precip labels
        this.ctx.font = "12px Verdana";
        var x = chartX - 4;
        var y = chartY + 4;
        for (var inches = 14; inches >= 0; inches -= 2) {
            var width = this.ctx.measureText(inches).width;
            this.ctx.fillText(inches, x - width, y);
            y += segHeight;
        }

        // Temp labels
        x = chartX + chartWidth + 28;
        y = chartY + 4;
        for (var temp = 120; temp >= -20; temp -= 20) {
            var width = this.ctx.measureText(temp).width;
            this.ctx.fillText(temp, x - width, y);
            y += segHeight;
        }

        // Month labels
        var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        x = chartX + 4;
        y = chartY + chartHeight + 16;
        for (var i = 0; i < months.length; i++) {
            var month = months[i];
            this.ctx.fillText(month, x, y);
            x += monthWidth;
        }

        // 12 precips
        x = chartX + 4;
        y = chartY + chartHeight;
        this.ctx.fillStyle = 'blue';
        for (var i = 0; i < months.length; i++) {
            var precip = city.precip[i] * 15;
            this.ctx.fillRect(x, y - precip, 20, precip);
            x += monthWidth;
        }

        // High temperatures
        x = chartX + 12;
        this.ctx.lineWidth = 3.0;
        this.ctx.strokeStyle = 'orange';
        this.ctx.beginPath();
        for (var i = 0; i < months.length; i++) {
            var temp = (city.high[i] + 20) * 3 / 2;
            y = chartY + chartHeight - temp;
            this.ctx.lineTo(x, y);
            x += monthWidth;
        }
        this.ctx.stroke();

        // Low temperatures
        x = chartX + 12;
        this.ctx.strokeStyle = 'lightblue';
        this.ctx.beginPath();
        for (var i = 0; i < months.length; i++) {
            var temp = (city.low[i] + 20) * 3 / 2;
            y = chartY + chartHeight - temp;
            this.ctx.lineTo(x, y);
            x += monthWidth;
        }
        this.ctx.stroke();

        // Pie chart
        x = chartX + chartWidth - 30;
        y = chartY + chartHeight + 90;
        var radius = 35;

        // Pie hash marks
        this.ctx.beginPath();
        var r = radius + 3;
        for (var deg = 0; deg < 180; deg += 30) {
            var radians = Math.PI * deg / 180;
            var x1 = x + r * Math.cos(radians);
            var y1 = y + r * Math.sin(radians);
            var x2 = x - r * Math.cos(radians);
            var y2 = y - r * Math.sin(radians);
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
        }
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        // Seasons
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        if (city.summer[0] < 0 && city.winter[0] < 0) {
            this.ctx.fillStyle = 'white';
        }
        else {
            this.ctx.fillStyle = spring;
        }
        this.ctx.fill();
        this.drawSeason(x, y, radius, city.summer, summer);
        this.drawSeason(x, y, radius, city.winter, winter);

        // Pie chart outline
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        // Month labels
        this.ctx.fillText(months[0], x - 10, y - radius - 6);
        this.ctx.fillText(months[3], x + radius + 6, y + 4);
        this.ctx.fillText(months[6], x - 9, y + radius + 14);
        this.ctx.fillText(months[9], x - radius - 25, y + 4);

        // Season legend
        x = chartX + 155;
        y = chartY + chartHeight + 50;
        this.ctx.font = "11px Verdana";
        this.drawSeasonLegend("Winter", winter, x, y);
        y += 30;
        this.drawSeasonLegend("Spring/Fall", spring, x, y);
        y += 30;
        this.drawSeasonLegend("Summer", summer, x, y);

        // T-Storm Precip Snow
        this.tps(city);

        // Table
        x = 170;
        y = chartY + chartHeight + 60;
        this.ctx.font = "12px Verdana";
        this.ctx.fillStyle = 'black';
        this.drawTable("Freeze Days", city.freeze, x, y);
        y += 20;
        this.drawTable("90 Degree Days", city.hot, x, y);
        y += 20;
        this.drawTable("Cloudy", city.cloudy, x, y);
        y += 20;
        this.drawTable("Partly Cloudy", city.ptCloudy, x, y);
        y += 20;
        this.drawTable("Clear", city.clear, x, y);
    }

    this.drawSeasonLegend = function(name, color, x, y) {
        var width = 70;
        var height = 20;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.rect(x, y, width, height);
        this.ctx.stroke();
        this.ctx.fillStyle = color == winter ? 'white' : 'black';
        this.ctx.fillText(name,  x + 5, y + 14);        
    }

    this.drawTable = function(name, value, x, y) {
        this.ctx.fillText(name + ":" ,  x, y);
        if (value < 0) {
            value = "N/A";
        }
        x = x + 130 - this.ctx.measureText(value).width;
        this.ctx.fillText(value, x, y);
    }

    // T-storm Precip Snow
    this.tps = function(city) {
        this.ctx.font = "11px Verdana";

        var precip = 0;
        for (var i = 0; i < city.precip.length; i++) {
            precip += city.precip[i];
        }

        // Round precip to hundredths:
        precip = (Math.floor((precip + .005) * 100) / 100).toFixed(2);

        var base = this.height - 35;
        this.drawBar("T-Storms", "red", 20, base, city.tstorms);
        this.drawBar("Precip", "blue", 70, base, precip);
        this.drawBar("Snow", "gray", 120, base, city.snow);
    }

    this.drawBar = function(name, color, x, y, height) {
        var width = 22;
        var centerX = x + width / 2;
        var value = height >= 0 ? height : "N/A";
        height = height >= 0 ? height : 0;

        if (height > 0) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y - height, width, height);
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'black';
            this.ctx.rect(x, y - height, width, height);
            this.ctx.stroke();
        }

        var xPos = centerX - this.ctx.measureText(name).width / 2;
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(name, xPos, y + 15);
        xPos = centerX - this.ctx.measureText(value).width / 2;
        this.ctx.fillText(value,  xPos, y - height - 8);
    }

    this.drawSeason = function(x, y, radius, season, color) {
        var stAngle = this.getAngle(season[0], season[1]);
        var enAngle = this.getAngle(season[2], season[3]);
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, stAngle, enAngle, false);
        this.ctx.lineTo(x, y);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    this.getAngle = function(month, day) {
        var degrees = (month - 4) * 30 + day;
        return Math.PI * degrees / 180.0;
    }
}
