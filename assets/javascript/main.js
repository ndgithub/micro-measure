
// Images for testing
// beach-small.jpg 272 X 92
// beach.jpg 5184 X 3456
// grid.jpg 1000 X 1000

// Dimensions for #micro-container
var containerSizeX = $("#micro-container").width();
var containerSizeY = $("#micro-container").height();

// Dimensions for original image
var origSizeX = 5184;
var origSizeY = 3456;

// Dimensions of current image
var bgSizeY;
var bgSizeX;

// Image Position (top left corner relative to #micro-container )
var bgPosX;
var bgPosY;

// Boolean for if the scalebar has been set (to turn off click listener)
var isScalebarSet;
// Array for scalebar points
var clickPoints = [];

// Boolean if hovering over #micro-container
var isHovering;

setInitBgImageSize(); // Determine what size should be and assign to variables
setInitBgPos(); // Determine what position should be and assign to variables
updateBgSize(); // Update image size in UI
updateBgPos();  // Update image pos in UI

setHoverListener(); // sets isHovering to true if hovering o #micro-contiainer
setKeysForZoomListener(); // Set a keypress listener on the body for zoom and scroll
setClickforScalebarListener();//Set a click listener on #micro-container to set scalebar ration points. Turns itself off after two clicks.


//------------------------------------------------------//


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

function updateBgSize() {
    $("#micro-container").css("background-size", Math.floor(bgSizeX) + "px " + Math.floor(bgSizeY) + "px");
}

function updateBgPos() {
    $("#micro-container").css("background-position", Math.floor(bgPosX) + "px " + Math.floor(bgPosY) + "px");
}

function onScalebarSet() {
    isScalebarSet = true;
    console.log('isScalebarSet', isScalebarSet);
    var length = Math.abs(clickPoints[0] - clickPoints[1]);
    var div = $("<div>");
    div.append("<br> Length: " + length);
}

function updateClickPoint() {
    $("#scalebar-info").html("");
    for (var i =0; i < 2; i++) {
        $("#scalebar-info").append(clickPoints[i]);
        $("#scalebar-info").append("<br> ");
    };
}

function resetClickPoints() {
    isScalebarSet = false;
    console.log('isScalebarSet', isScalebarSet);
    clickPoints = [];
    $("#scalebar-info").html("");
}

function setClickforScalebarListener() {
    $("#set-scalebar-button").on("click", function () {
        resetClickPoints();
        $("#micro-container").on("click", function (event) { // 
            clickPoints.push(event.pageX);
            updateClickPoint();
            if (clickPoints.length === 2) {
                onScalebarSet();
                $(this).off("click");                
            }
        });
    });



}

function setKeysForZoomListener() { // Set a keypress listener on the body for zoom and scroll
    $("body").on("keypress", function (event) {
        console.log("event.which " + event.keyCode);
        //press i, zoom in
        switch (event.keyCode) {
            case 105:
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
            case 107: // Pressed k, zoomed out
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
        updateBgSize();
        updateBgPos();
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