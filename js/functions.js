var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    $loveHeart = $("#loveHeart");
    // Calculate center positions for heart animation
    var a = $loveHeart.width() / 2;
    var b = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $loveHeart.width();
    gardenCanvas.height = $loveHeart.height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);
    
    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));
    
    setInterval(function () { garden.render() }, Garden.options.growSpeed);
});

$(window).resize(function () {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angleInRadians) {
    var t = angleInRadians / Math.PI;
    var xOffset = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var yOffset = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + xOffset, offsetY + yOffset);
}

function startHeartAnimation() {
    var intervalDuration = 50; // in ms
    var angle = 10;
    var points = new Array();
    var timer = setInterval(function () {
        var point = getHeartPoint(angle);
        var canBloom = true;
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var distance = Math.sqrt(Math.pow(p[0] - point[0], 2) + Math.pow(p[1] - point[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                canBloom = false;
                break;
            }
        }
        if (canBloom) {
            points.push(point);
            garden.createRandomBloom(point[0], point[1]);
        }
        if (angle >= 30) {
            clearInterval(timer);
            showMessages();
        } else {
            angle += 0.2;
        }
    }, intervalDuration);
}

(function ($) {
    $.fn.typewriter = function () {
        this.each(function () {
            var $this = $(this),
                text = $this.html(),
                i = 0;
            $this.html("");
            var timer = setInterval(function () {
                var char = text.substr(i, 1);
                if (char == "<") {
                    i = text.indexOf(">", i) + 1;
                } else {
                    i++;
                }
                $this.html(text.substring(0, i) + (i & 1 ? "_" : ""));
                if (i >= text.length) {
                    clearInterval(timer);
                }
            }, 75);
        });
        return this;
    }
})(jQuery);

function timeElapse(startDate) {
    var currentDate = new Date();
    var secondsElapsed = (Date.parse(currentDate) - Date.parse(startDate)) / 1000;
    var days = Math.floor(secondsElapsed / (3600 * 24));
    secondsElapsed = secondsElapsed % (3600 * 24);
    var hours = Math.floor(secondsElapsed / 3600);
    if (hours < 10) { hours = "0" + hours; }
    secondsElapsed = secondsElapsed % 3600;
    var minutes = Math.floor(secondsElapsed / 60);
    if (minutes < 10) { minutes = "0" + minutes; }
    secondsElapsed = secondsElapsed % 60;
    if (secondsElapsed < 10) { secondsElapsed = "0" + secondsElapsed; }
    
    var elapsedTimeStr = '<span class="digit">' + days + '</span> days ' +
                         '<span class="digit">' + hours + '</span> hours ' +
                         '<span class="digit">' + minutes + '</span> minutes ' +
                         '<span class="digit">' + secondsElapsed + '</span> seconds';
    $("#elapseClock").html(elapsedTimeStr);
}

function showMessages() {
    $("#messages").fadeIn(5000, function () {
        showLoveU();
    });
}

function adjustWordsPosition() {
    $("#words").css("position", "absolute");
    $("#words").css("top", $("#garden").position().top + 195);
    $("#words").css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
    $("#code").css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
    $("#loveu").fadeIn(3000);
}
