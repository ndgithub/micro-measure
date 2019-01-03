//This is what we need. What did the micro image get resized to;
// [w,h]
var bgImgY;
var bgImgX;
var bgPosX;
var bgPosY;

//Original Image Dimensions
var origX = 5184;
var origY = 3456;

// 5184 × 3456


// #micro_container dimensions
var containerX = $("#micro_container").width();
var containerY = $("#micro_container").height();


// origX = 272;
// origY = 92;

function setInitBgImageSize() {
    var ratioY = origY / containerY; //.2
    bgImgY = origY / ratioY; //460 
    bgImgX = origX / ratioY; //1360

    var newRatioX = bgImgX / containerX; // 1.1
    if (newRatioX >= 1) {
        bgImgX = containerX; //1280
        bgImgY = bgImgY / newRatioX; // 469 / 1.1
    }
}

function setInitBgPos() {
    bgPosX = (containerX - bgImgX) / 2;
    bgPosY = (containerY - bgImgY) / 2;
}

function updateBgSize() {
    $("#micro_container").css("background-size", Math.floor(bgImgX) + "px " + Math.floor(bgImgY) + "px");
}

function updateBgPos() {
    $("#micro_container").css("background-position", Math.floor(bgPosX) + "px " + Math.floor(bgPosY) + "px");
}

function setClickListeners() {
    $("#micro_container").hover(
        
        function () {
            $(this).css("border","8px solid #ff0000");
            $("body").on("keypress", function (event) {
                console.log("event.which " + event.keyCode);
                //press i, zoom in
                switch (event.keyCode) {
                    case 105:
                        bgImgX = bgImgX * 1.01;
                        bgImgY = bgImgY * 1.01;
                        break;
                    case 107:
                        bgImgX = bgImgX * 0.99;
                        bgImgY = bgImgY * 0.99;
                        break;
                    case 100: // d
                        bgPosX+=5;
                        break;
                    case 97: //
                        bgPosX-=5;
                        break;
                    case 119: // w
                        bgPosY-=5;
                        break;
                    case 115: //s
                        bgPosY+=5;
                        break;
                    default:
                    // code block
                }

                updateBgSize();
                updateBgPos();
            })
        },
        function (event) {
            $(this).css("border","8px solid #000000");
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

console.log("bgImgX", bgImgX);
console.log("bgImgY", bgImgY);

console.log("bgPosX: " + bgPosX);
console.log(bgPosX + "px " + Math.floor(bgPosY) + "px");





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
