//This is what we need. What did the micro image get resized to;
// [w,h]
var bgImgHt;
var bgImgWt;

//Original Image Dimensions
var origWt = 272;
var origHt = 92;


// #micro_container dimensions
var containerWt = $("#micro_container").width();
var containerHt = $("#micro_container").height();

console.log("containerWt1 + " + containerWt);
console.log("containerHt1 + " + containerHt);


// origWt = 272;
// origHt = 92;

// containerWt = 1280
// containerHt = 496
function getBgImageDims() {
    var ratioHt = origHt / containerHt; //.2
    bgImgHt = origHt / ratioHt; //460 
    bgImgWt = origWt /ratioHt; //1360
    

    var newRatioWt = bgImgWt / containerWt; // 1.1
    if (newRatioWt >= 1) {
        bgImgWt = containerWt; //1280
        bgImgHt = bgImgHt / newRatioWt; // 469 / 1.1
    }
}
//1080p is vertical 
getBgImageDims();





console.log("origWt", origWt);
console.log("origHt", origHt);

console.log("containerWt", containerWt);
console.log("containerHt", containerHt);

console.log("bgImgWt", bgImgWt);
console.log("bgImgHt", bgImgHt);


//Image is 1000x1000

//I need the size of the image and point on the image that the mouse is.
    //Know the original size, it's contained in #micro_container
        //Both dimensions must be less than #micro_contaiers.


//Then i need 

function showRed() {
    $("#block").css("background-color", "#ff0000");
    console.log("hi");
}
function showBlack() {
    $("#block").css("background-color", "#000000");
    console.log("hi");
}

$("#sidebar").hover(showRed, showBlack);
