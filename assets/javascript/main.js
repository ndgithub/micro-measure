
//Image Dimensions
var bgSizeY;
var bgSizeX;


// image Position (top left corner relative to )
var bgPosX;
var bgPosY;

//Original Image Dimensions
var origX = 5184;
var origY = 3456;

// 272 X 92
// 5184 × 3456

// #micro_container dimensions
var containerX = $("#micro_container").width();
var containerY = $("#micro_container").height();
console.log(("background-position: " + $("#micro_container").css("background-position")));
function setInitBgImageSize() {
    var ratioY = origY / containerY; //.2
    bgSizeY = origY / ratioY; //460 
    bgSizeX = origX / ratioY; //1360

    var newRatioX = bgSizeX / containerX; // 1.1
    if (newRatioX >= 1) {
        bgSizeX = containerX; //1280
        bgSizeY = bgSizeY / newRatioX; // 469 / 1.1
    }
}

function setInitBgPos() {
    bgPosX = (containerX - bgSizeX) / 2;
    bgPosY = (containerY - bgSizeY) / 2;
}

function fixPositionAfterSizeChange() {

    var containerCenterX_relToImgCorner = containerX / 2 - bgPosX;
    var containerCenterY_relToImgCorner = containerY / 2 - bgPosY;

    var containerCenterX_relToImgCorner_percent = ((containerX / 2) - bgPosX) / bgSizeX;
    var containerCenterY_relToImgCorner_percent = ((containerY / 2) - bgPosY) / bgSizeY;



}

function updateBgSize() {
    $("#micro_container").css("background-size", Math.floor(bgSizeX) + "px " + Math.floor(bgSizeY) + "px");
}

function updateBgPos() {
    $("#micro_container").css("background-position", Math.floor(bgPosX) + "px " + Math.floor(bgPosY) + "px");
}

function setClickListeners() {
    $("#micro_container").hover(
        function () {
            $(this).css("border", "8px solid #ff0000");
            $("body").on("keypress", function (event) {
                console.log("event.which " + event.keyCode);
                //press i, zoom in
                switch (event.keyCode) {
                    case 105:
                        var old_bgSizeX = bgSizeX;
                        var old_bgSizeY = bgSizeY;
                        bgSizeX = bgSizeX * 1.05;
                        bgSizeY = bgSizeY * 1.05;

                        var old_containerCenterX_relToImgCorner_percent = ((containerX / 2) - bgPosX) / old_bgSizeX;
                        var old_containerCenterY_relToImgCorner_percent = ((containerY / 2) - bgPosY) / old_bgSizeY;

                        var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * bgSizeX;
                        var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * bgSizeX) + bgPosX;
                        var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (containerX / 2);
                        bgPosX -= offsetX;

                        var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * bgSizeY;
                        var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * bgSizeY) + bgPosY;
                        var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (containerY / 2);
                        bgPosY -= offsetY;

                        break;
                    case 107:
                        var old_bgSizeX = bgSizeX;
                        var old_bgSizeY = bgSizeY;

                        bgSizeX = bgSizeX * 0.95;
                        bgSizeY = bgSizeY * 0.95;
                        var old_containerCenterX_relToImgCorner_percent = ((containerX / 2) - bgPosX) / old_bgSizeX;
                        var old_containerCenterY_relToImgCorner_percent = ((containerY / 2) - bgPosY) / old_bgSizeY;

                        var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * bgSizeX;
                        var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * bgSizeX) + bgPosX;
                        var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (containerX / 2);
                        bgPosX -= offsetX;

                        var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * bgSizeY;
                        var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * bgSizeY) + bgPosY;
                        var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (containerY / 2);
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
                var containerCenterX_relToImgCorner_percent = ((containerX / 2) - bgPosX) / bgSizeX;
                var containerCenterY_relToImgCorner_percent = ((containerY / 2) - bgPosY) / bgSizeY;
                console.log(containerCenterX_relToImgCorner_percent);
                console.log(containerCenterY_relToImgCorner_percent);


            })
        },
        function (event) {
            $(this).css("border", "8px solid #000000");
            $("body").off("keypress")
        }
    );


}
//-------------------
setInitBgImageSize();
setInitBgPos();
updateBgSize();
updateBgPos();
setClickListeners();




console.log("origX", origX);
console.log("origY", origY);

console.log("containerX", containerX);
console.log("containerY", containerY);

console.log("bgSizeX", bgSizeX);
console.log("bgSizeY", bgSizeY);

console.log("bgPosX: " + bgPosX);
console.log(bgPosX + "px " + Math.floor(bgPosY) + "px");
console.log(("background-position: " + $("#micro_container").css("background-position")));





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
