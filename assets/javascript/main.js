
// Images for testing
// beach-small.jpg 272 X 92
// beach.jpg 5184 X 3456
// grid.jpg 1000 X 1000
// steel.png 360 X 240
// leaf.jpeg 2560 X 1920

////// LAYOUT STUFF ////////////////////////////////////////////////////////
// Dimensions for #micro-container
var containerSizeX = $("#micro-container").width();
var containerSizeY = $("#micro-container").height();

////// IMAGE STUFF ////////////////////////////////////////////////////////
// Dimensions for original image
var origSizeX = 2560;
var origSizeY = 1920;

// Dimensions of current image
var bgSizeY;
var bgSizeX;

// Image Position (top left corner relative to #micro-container )
var bgPosX;
var bgPosY;

// SCALEBAR STUFF ////////////////////////////////////////////////////////
// Boolean for if the scalebar has been set (to turn off click listener)
var isScalebarSet;

// Array for scalebar points relative to #micro-container
var clickPointsContainer = [];

//Array for scalebar points relative to image
var clickPointsImagePerc = [];

// The length of the generated scalebar in screen px
var generatedScaleBarLengthPx;

//The length of the scalebar in the image (user input required)
var imageScaleBarUnits = 100;

var scaleImageRatio;

// OTHER STUFF ////////////////////////////////////////////////////////
// Boolean if hovering over #micro-container
var isHovering;

var isMouseDown;

var oldX;
var oldY;



setInitBgImageSize(); // Determine what size should be and assign to variables
setInitBgPos(); // Determine what position should be and assign to variables
updateUiBgSize(); // updates image size in UI
updateUiBgPos();  // updates image pos in UI

setHoverListener(); // sets isHovering to true if hovering o #micro-contiainer
setKeysForZoomListener(); // Set a keypress listener on the body for zoom and scroll
setClickforScalebarListener();//Set a click listener on #micro-container to set scalebar ration points. Turns itself off after two clicks.
makeDraggable();
logStuff();



//------------------------------------------------------//

function logStuff() {
    console.log(" hello" + $("#overlay-center").css("top"));
}


function getContainerSize() { // Gets the container size from the DOM and sets to variables 
    containerSizeX = $("#micro-container").width();
    containerSizeY = $("#micro-container").height();
}
function setInitBgImageSize() {
    var ratioY = origSizeY / containerSizeY; //.2
    bgSizeY = origSizeY / ratioY; //460 
    bgSizeX = origSizeX / ratioY; //1360

    var newRatioX = bgSizeX / containerSizeX; // 1.1
    if (newRatioX >= 1) {
        bgSizeX = containerSizeX; //1280
        bgSizeY = bgSizeY / newRatioX; // 469 / 1.1
    }
}

function setInitBgPos() {
    bgPosX = (containerSizeX - bgSizeX) / 2;
    bgPosY = (containerSizeY - bgSizeY) / 2;
}

function updateUiBgSize() {
    $("#micro-container").css("background-size", Math.floor(bgSizeX) + "px " + Math.floor(bgSizeY) + "px");
    updateUiScaleBar();
}

function updateUiBgPos() {
    var newPos = Math.floor(bgPosX) + "px " + Math.floor(bgPosY) + "px";
    $("#micro-container").css("background-position", Math.floor(bgPosX) + "px " + Math.floor(bgPosY) + "px");
    // infinty wen dist is 0
    getMiniDims();
}

function resetClickPoints() {
    isScalebarSet = false;
    console.log('isScalebarSet', isScalebarSet);
    clickPointsContainer = [];
    clickPointsImagePerc = [];
    $("#scalebar-info").html("");
}

function updateUiClickPoint() {
    $("#scalebar-info").html("");
    for (var i = 0; i < 2; i++) {
        $("#scalebar-info").append("clickPointsContainer[" + i + "]: ", clickPointsContainer[i], "<br>");
    };
}


function onScalebarSet() {
    var input = prompt("How long is that");
    imageScaleBarUnits = input;
    isScalebarSet = true;
    console.log('isScalebarSet', isScalebarSet);
    var length = Math.abs(clickPointsContainer[0] - clickPointsContainer[1]);
    $("#scalebar-info").append(length, "<br>");
    scaleImageRatio = Math.abs(clickPointsImagePerc[0] - clickPointsImagePerc[1])
    $("#scalebar-info").append("scaleImageRatio:", scaleImageRatio);
    updateUiScaleBar();

}

function updateUiScaleBar() {
    generatedScaleBarLengthPx = $("#scale-bar").width();
    console.log('generatedScaleBarLengthPx', generatedScaleBarLengthPx);
    var generatedScaleBarPercentofBgImage = generatedScaleBarLengthPx / bgSizeX;
    var generatedScaleBarLengthUnits = (generatedScaleBarPercentofBgImage / scaleImageRatio) * imageScaleBarUnits;
    console.log('imageScaleBarUnits', imageScaleBarUnits);
    console.log('scaleImageRatio', scaleImageRatio);
    console.log('generatedScaleBarLengthUnits', generatedScaleBarLengthUnits);
    $("#scale-bar").html(Math.round(generatedScaleBarLengthUnits));

}

function setClickforScalebarListener() {
    $("#set-scalebar-button").on("click", function () {
        resetClickPoints();
        $("#micro-container").on("click", function (event) { // 
            clickPointsContainer.push(event.pageX);
            var imageXpercent = ((event.pageX) - bgPosX) / bgSizeX;
            console.log('imageXpercent', imageXpercent);
            clickPointsImagePerc.push(imageXpercent);
            updateUiClickPoint();
            if (clickPointsContainer.length === 2) {
                onScalebarSet();
                $(this).off("click");
            }
        });
    });
}


function getMiniDims() {
    var percentXtopLeft = -bgPosX / bgSizeX;
    console.log('percentXtopLeft', percentXtopLeft);
    var percentYtopLeft = -bgPosY / bgSizeY;
    console.log('percentYtopLeft', percentYtopLeft);

    var percentXbottomRight = (-bgPosX + containerSizeX) / bgSizeX;
    console.log('percentXbottomRight', percentXbottomRight);
    var percentYbottomRight = (-bgPosY + containerSizeY) / bgSizeY;
    console.log('percentYbottomRight', percentYbottomRight);

    var pxYtopLeft = percentYtopLeft * $("#mini-view-container").height()
    $("#mini-border").css("top", pxYtopLeft + "px");

    var pxXtopLeft = percentXtopLeft * $("#mini-view-container").width()
    $("#mini-border").css("left", pxXtopLeft + "px");


}

function makeDraggable() {
    $("#overlay-center").on("mousedown", function (event) {
        isMouseDown = true;
        console.log('mouseDown', isMouseDown);
        oldX = event.pageX;
        oldY = event.pageY;
    });
    $("#overlay-center").on("mouseup", function () {
        isMouseDown = false;
        console.log('mouseDown', isMouseDown);
        // $("#overlay-center").off("mousedown");
        // $(this).off("mouseup");
        console.log($("#micro-container").css("background-position-x"));
    
    });

    $("#overlay-center").on("mousemove", function (event) {
        if (isMouseDown) {
            var differenceX = event.pageX - oldX;
            console.log('differenceX', differenceX);
            var differenceY = event.pageY - oldY;
            // $("#micro-container").css("background-position-x", "+=" + differenceX*.1 + "px");
            // //console.log("background-position-x" + $("#micro-container").css("background-position-x"));
            // $("#micro-container").css("background-position-y", "+=" + differenceY*.1 + "px");
            bgPosX = bgPosX + differenceX;
            bgPosY = bgPosY + differenceY;
            oldX = event.pageX;
            oldY = event.pageY;
            updateUiBgPos();
            console.log($("#micro-container").css("background-position-x"));
        };

    });
}

    function setKeysForZoomListener() { // Set a keypress listener on the body for zoom and scroll
        $("body").on("keypress", function (event) {
            console.log("event.which " + event.keyCode);
            //press i, zoom in
            switch (event.which) {
                case 61:
                    var old_bgSizeX = bgSizeX;
                    var old_bgSizeY = bgSizeY;
                    bgSizeX = bgSizeX * 1.05;
                    bgSizeY = bgSizeY * 1.05;

                    //Will putting this all in a div make this easier.
                    var old_containerCenterX_relToImgCorner_percent = ((containerSizeX / 2) - bgPosX) / old_bgSizeX;
                    var old_containerCenterY_relToImgCorner_percent = ((containerSizeY / 2) - bgPosY) / old_bgSizeY;

                    var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * bgSizeX;
                    var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * bgSizeX) + bgPosX;
                    var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (containerSizeX / 2);
                    bgPosX -= offsetX;

                    var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * bgSizeY;
                    var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * bgSizeY) + bgPosY;
                    var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (containerSizeY / 2);
                    bgPosY -= offsetY;

                    break;
                case 45: // Pressed k, zoomed out
                    var old_bgSizeX = bgSizeX;
                    var old_bgSizeY = bgSizeY;

                    bgSizeX = bgSizeX * 0.95;
                    bgSizeY = bgSizeY * 0.95;
                    var old_containerCenterX_relToImgCorner_percent = ((containerSizeX / 2) - bgPosX) / old_bgSizeX;
                    var old_containerCenterY_relToImgCorner_percent = ((containerSizeY / 2) - bgPosY) / old_bgSizeY;

                    var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * bgSizeX;
                    var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * bgSizeX) + bgPosX;
                    var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (containerSizeX / 2);
                    bgPosX -= offsetX;

                    var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * bgSizeY;
                    var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * bgSizeY) + bgPosY;
                    var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (containerSizeY / 2);
                    bgPosY -= offsetY;
                    break;
                case 100: // d
                    bgPosX -= 20;
                    break;
                case 97: //
                    bgPosX += 20;
                    break;
                case 119: // w
                    bgPosY += 20;
                    break;
                case 115: //s
                    bgPosY -= 20;
                    break;
                default:
                // code block
            }
            updateUiBgSize();
            updateUiBgPos();


            var containerCenterX_relToImgCorner_percent = ((containerSizeX / 2) - bgPosX) / bgSizeX;
            var containerCenterY_relToImgCorner_percent = ((containerSizeY / 2) - bgPosY) / bgSizeY;
            console.log(containerCenterX_relToImgCorner_percent);
            console.log(containerCenterY_relToImgCorner_percent);


        });
    }

    function setHoverListener() {
        $("#micro-container").hover( // On hover 
            function () {
                isHovering = true;  // set isHovering to true
                console.log('isHovering', isHovering)
                $(this).css("border", "2px solid #cccccc");
            },
            function (event) {
                isHovering = false;
                console.log('isHovering', isHovering);
                $(this).css("border", "2px solid #000000");

            }
        );
    }

//Todos------------------
// Make Escape Key reset image
// Thing that show this is original image size
// MVP - Just scalebar and load image. After MVP, save image.


// for miniview:
 // bg postion x diviv