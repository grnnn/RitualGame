var canvas, ctx, stage;
var drawingCanvas;
var oldPt;
var oldMidPt;
var stroke;
var drawColor;
var index;
var x, y, w, h;
var img;
var imgData;
var svgWidth;
var svgHeight;
var svgs;
var $ = $ || jQuery;
var pxCounter;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    //ctx.globalCompositeOperation = 'source-over';
    ctx.globalCompositeOperation = 'multiply';
    x = 0;
    y = 0;
    w = canvas.width;
    h = canvas.height;
    index = 0;
    stroke = 18;
    drawColor = "rgba(0,255,0,1)";
    svgWidth = 200;
    svgHeight = 200;
    pxCounter = {
        black: 0,
        blackGreen: 0,
        green: 0
    };

    // check to see if we are running in a browser with touch support
    stage = new createjs.Stage(canvas);
    stage.autoClear = false;
    stage.enableDOMEvents(true);

    createjs.Touch.enable(stage);
    createjs.Ticker.setFPS(24);

    drawingCanvas = new createjs.Shape();

    stage.addEventListener("stagemousedown", handleMouseDown);
    stage.addEventListener("stagemouseup", handleMouseUp);
    stage.addEventListener("stagemousemove", handleMouseMove);

    svgs = document.getElementsByClassName("svg");
    var svg = svgs[Math.floor(Math.random() * svgs.length)];
    var xml = new XMLSerializer().serializeToString(svg);
    var svg64 = btoa(xml);
    var b64Start = 'data:image/svg+xml;base64,';
    var image64 = b64Start + svg64;
    img = new Image();
    img.onload = function() {
        ctx.drawImage(img, (w / 2 - svgWidth / 2), (h / 2 - svgHeight / 2), svgWidth, svgHeight);
        getInitPxCount();
    };
    img.src = image64;

    stage.addChild(drawingCanvas);
    stage.update();
}

function handleMouseDown(event) {
    if (!event.primary) { return; }
    oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
    oldMidPt = oldPt.clone();
    stage.addEventListener("stagemousemove", handleMouseDownMove);
}

function handleMouseDownMove(event) {
    if (!event.primary) { return; }
    var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

    drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(drawColor).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

    oldPt.x = stage.mouseX;
    oldPt.y = stage.mouseY;

    oldMidPt.x = midPt.x;
    oldMidPt.y = midPt.y;

    stage.update();
}

function handleMouseMove(event) {
    imgData = ctx.getImageData(stage.mouseX, stage.mouseY, 1, 1);
    for (var i = 0; i < imgData.data.length; i += 4) {
        console.log(imgData.data[i], imgData.data[i+1], imgData.data[i+2], imgData.data[i+3]);
    }
}

function handleMouseUp(event) {
    if (!event.primary) { return; }
    stage.removeEventListener("stagemousemove", handleMouseDownMove);
    getFinalPxCount();
    //reset();
}

function getInitPxCount() {
    imgData = ctx.getImageData((w / 2 - svgWidth / 2), (h / 2 - svgHeight / 2), svgWidth, svgHeight);
    for (var i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] == 0 && imgData.data[i + 1] == 0 && imgData.data[i + 3] > 0) {
            pxCounter.black++;
        }
    }
    $('#debug-info')
        .empty()
        .append('<p>Initial # of Black Pixels: ' + pxCounter.black + '</p>');
    console.log('init pxCounter', pxCounter);
}

function getFinalPxCount() {
    imgData = ctx.getImageData((w / 2 - svgWidth / 2), (h / 2 - svgHeight / 2), svgWidth, svgHeight);
    for (var i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] == 0 && imgData.data[i + 1] > 0 && imgData.data[i + 1] < 255) {
            pxCounter.blackGreen++;
        } else if (imgData.data[i] == 0 && imgData.data[i + 1] == 255) {
            pxCounter.green++;
        }
    }

    var insideAccuracy = Math.round(pxCounter.blackGreen / pxCounter.black * 100) / 100 * 100;
    var outsideAccuracy = Math.round(pxCounter.green / pxCounter.black * 100) / 100 * 100;
    var overallAccuracy = insideAccuracy - (outsideAccuracy / 2);

    $('#debug-info')
        .append('<p>Final # of Black-Green Pixels (inside the lines): ' + pxCounter.blackGreen + '</p>')
        .append('<p>Final # of Green Pixels (outside the lines): ' + pxCounter.green + '</p>')
        .append('<p>Accuracy inside the lines: ' + insideAccuracy + '%</p>')
        .append('<p>Accuracy outside the lines: ' + outsideAccuracy + '%</p>')
        .append('<p>Overall Accuracy (weighted): ' + overallAccuracy + '%</p>')
        .append('<p>Refresh for a new random image (auto re-init to come later)</p>');

    console.log('final pxCounter', pxCounter);
}

function reset() {
    pxCounter.black = 0;
    pxCounter.blackGreen = 0;
    pxCounter.green = 0;
    ctx.clearRect(0, 0, w, h);
}