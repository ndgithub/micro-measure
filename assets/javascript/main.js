//Summary 


//Image Dimensions
var bgSizeY;
var bgSizeX;

// Image Position (top left corner relative to )
var bgPosX;
var bgPosY;

// Original Image Dimensions
var origSizeX = 735;
var origSizeY = 547;

var clickPoints = [];

var isHovering;

// 272 X 92
// 5184 × 3456

// #micro-container dimensions
var containerSizeX = $("#micro-container").width();
var containerSizeY = $("#micro-container").height();

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

function setClickListeners() {
    $("#micro-container").hover(
        function () {
            isHovering = true;
            console.log('isHovering', isHovering)
            $("#micro-container").on("click", function (event) {
                if (clickPoints.length === 2) {
                    $(this).off("click");
                    return;
                }
                clickPoints.push(event.pageX);
                var div = $("<div>");
                div.append(event.pageX)
                $("#scalebar-info").append(div);
                console.log("asdf");
                if (clickPoints.length === 2) {
                    $(this).off("click");
                    var length = Math.abs(clickPoints[0] - clickPoints[1]);
                    div.append("<br> Length: " + length);
                }

            })
            $(this).css("border", "4px solid #ff0000");
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
                    case 107:
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
                        bgPosX += 20;
                        break;
                    case 97: //
                        bgPosX -= 20;
                        break;
                    case 119: // w
                        bgPosY -= 20;
                        break;
                    case 115: //s
                        bgPosY += 20;
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


            })
        },
        function (event) {
            isHovering = false;
            console.log('isHovering', isHovering);
            $(this).css("border", "4px solid #000000");
            $("body").off("keypress")
            $("#micro-container").off("click")
        }
    );
}
//-------------------
setInitBgImageSize();
setInitBgPos();
updateBgSize();
updateBgPos();
setClickListeners();




console.log("origSizeX", origSizeX);
console.log("origSizeY", origSizeY);

console.log("containerSizeX", containerSizeX);
console.log("containerSizeY", containerSizeY);

console.log("bgSizeX", bgSizeX);
console.log("bgSizeY", bgSizeY);

console.log("bgPosX: " + bgPosX);
console.log(bgPosX + "px " + Math.floor(bgPosY) + "px");
console.log(("background-position: " + $("#micro-container").css("background-position")));


//Image is 1000x1000


function showRed() {
    $("#block").css("background-color", "#ff0000");
    console.log("hi");
}
function showBlack() {
    $("#block").css("background-color", "#000000");
    console.log("hi");
}

$("#block").hover(showRed, showBlack);


//Todos------------------
// Make Escape Key reset image
// Thing that show this is original image size