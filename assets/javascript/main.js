function showRed() {
    $("#block").css("background-color", "#ff0000");
    console.log("hi");
}
function showBlack() {
    $("#block").css("background-color", "#000000");
    console.log("hi");
}

$("#sidebar").hover(showRed, showBlack);




//This is what we need. What did the micro image get resized to;
// [w,h]
var bgImgHt;
var bgImgWt;


//Original Image Dimensions
var origHt = 1000;
var origWt = 1000;
// #micro_container dimensions
var containerHt = $("#micro_container").height();
var containerWt = $("#micro_container").width();

function getBgImageDims() {
    var ratioHt = origHt / containerHt;
    bgImgHt = containerHt;
    bgImgWt = origWt / ratioHt;

    var newRatioWt = bgImgWt / containerWt;
    if (newRatioWt >= 1) {
        bgImgWt = containerWt;
        bgImgHt = origHt / newRatioWt;
    }
}

getBgImageDims();
console.log("origWt", origWt);
console.log("origHt", origHt);

console.log("containerWt", containerWt);
console.log("containerHt", containerHt);

console.log("bgImgWt", bgImgWt);
console.log("bgImgHt", bgImgHt);





function differenceBetween(height1, height2) {
    return Math.abs(height1 - height2);
}



//Image is 1000x1000

//I need the size of the image and point on the image that the mouse is.
    //Know the original size, it's contained in #micro_container
        //Both dimensions must be less than #micro_contaiers.


//Then i need 