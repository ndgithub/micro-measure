//This is what we need. What did the micro image get resized to;
// [w,h]
var bgImgY;
var bgImgX;

//Original Image Dimensions
var origX = 1000;
var origY = 1000;


// #micro_container dimensions
var containerX = $("#micro_container").width();
var containerY = $("#micro_container").height();


// origX = 272;
// origY = 92;

function getBgImageDims() {
    var ratioY = origY / containerY; //.2
    bgImgY = origY / ratioY; //460 
    bgImgX = origX /ratioY; //1360

    var newRatioX = bgImgX / containerX; // 1.1
    if (newRatioX >= 1) {
        bgImgX = containerX; //1280
        bgImgY = bgImgY / newRatioX; // 469 / 1.1
    }
}
//1080p is vertical 
getBgImageDims();


var bgPosX  = (containerX - bgImgX) / 2;
var bgPosY = (containerY - bgImgY) / 2;

$("#micro_container").css("background-position", Math.floor(bgPosX) + "px " + Math.floor(bgPosY) + "px");
$("#micro_container").css("background-size", Math.floor(bgImgX) + "px " + Math.floor(bgImgY) + "px");



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
