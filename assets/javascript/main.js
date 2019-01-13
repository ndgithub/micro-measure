var cl = console.log;


// Images for testing
// beach-small.jpg 272 X 92
// beach.jpg 5184 X 3456
// grid.jpg 1000 X 1000
// steel.png 360 X 240
// leaf.jpeg 2560 X 1920

// Boolean if hovering over #micro-container
var isHovering;

// Boolean that tells if the user has clicked donw on #overlay-center
var isMouseDown;

// Used for getting the difference
var oldX;
var oldY;


var container = {
    //Dimensions for #micro-container
    getSizeX: function () {
        return $("#micro-container").width();
    },
    getSizeY: function () {
        return $("#micro-container").height();
    },
};
//micrograph image object
var mg = {
    // Dimensions for original image
    origSizeX: 2560,
    origSizeY: 1920,

    // Dimensions of current image
    currSizeX: "",
    currSizeY: "",
    setInitSize: function (containerSizeX, containerSizeY) {
        var ratioY = this.origSizeY / containerSizeY;
        this.currSizeY = this.origSizeY / ratioY; //460 
        this.currSizeX = this.origSizeX / ratioY; //1360

        var newRatioX = this.currSizeX / containerSizeX; // 1.1
        if (newRatioX >= 1) {
            this.currSizeX = containerSizeX; //1280
            this.currSizeY = this.currSizeY / newRatioX; // 469 / 1.1
        }
    },
    setInitPos: function (containerSizeX, containerSizeY) {
        mg.currPosX = (containerSizeX - this.currSizeX) / 2;
        mg.currPosY = (containerSizeY - this.currSizeY) / 2;
    },

    // Image Position (top left corner relative to #micro-container )
    currPosX: "",
    currPosY: "",

};

var scaleBar = {
    // Boolean for if the scalebar has been set (to turn off click listener)
    isSet: false,
    scaleImageRatio: "", //The length of the scalebar in the image (user input required)
    // Array for scalebar points relative to #micro-container
    clickPointsContainer: "",
    //Array for scalebar points relative to image
    clickPointsImagePercent: "",
    // The length of the generated scalebar in screen px
    generatedScaleBarContainerLengthPx: "",
    imageScaleBarUnits: "",
};

var sidebar = {
    isSideBarOpen: true,
};

var miniview = {

};

var uiUpdater = {
    
}

mg.setInitSize(container.getSizeX(), container.getSizeY());
mg.setInitPos(container.getSizeX(),container.getSizeY()); 

updateUiBgSize(); // updates image size in UI
updateUiBgPos();  // updates image pos in UI

setHoverListener(); // sets isHovering to true if hovering o #micro-contiainer
setKeysForZoomListener(); // Set a keypress listener on the body for zoom and scroll
setClickforScalebarListener();//Set a click listener on #micro-container to set scalebar ration points. Turns itself off after two clicks.
makeDraggable();
logStuff();
wheeling();


//------------------------------------------------------//
function logStuff() {
    cl(" hello" + $("#overlay-center").css("top"));

    $(".open-close-sidebar").on("click", function () {
        if (isSidebarOpen) {
            document.getElementById("mySidenav").style.width = "0%";
            document.getElementById("micro-container").style.width = "100%";
            isSidebarOpen = false;

            // TODO: readjust position of img
        } else {
            document.getElementById("mySidenav").style.width = "20%";
            document.getElementById("micro-container").style.width = "80%";
            isSidebarOpen = true;
            //updateUiBgSize();

            // TODO: readjust position of img

        }
    });

}

function updateUiBgSize() {
    $("#micro-container").css("background-size", Math.floor(mg.currSizeX) + "px " + Math.floor(mg.currSizeY) + "px");
    if (scaleBar.isSet) {
        updateUiScaleBar();
    }

}

function updateUiBgPos() {
    var newPos = Math.floor(mg.currPosX) + "px " + Math.floor(mg.currPosY) + "px";
    $("#micro-container").css("background-position", Math.floor(mg.currPosX) + "px " + Math.floor(mg.currPosY) + "px");
    // infinty wen dist is 0
    getMiniDims();
}


function wheeling() {
    $("#micro-container").on("mousewheel", function (event) {
        console.log(event.originalEvent.wheelDelta);
        console.log("****");
        var old_currSizeX = mg.currSizeX;
        var old_currSizeY = mg.currSizeY;
        if (event.originalEvent.wheelDelta > 0) {
            mg.currSizeX *= 1.01;
            mg.currSizeY *= 1.01;
        } else {
            mg.currSizeX *= 0.99;
            mg.currSizeY *= 0.99;
        }


        //Will putting this all in a div make this easier.
        var old_containerCenterX_relToImgCorner_percent = ((container.getSizeX() / 2) - mg.currPosX) / old_currSizeX;
        var old_containerCenterY_relToImgCorner_percent = ((container.getSizeY() / 2) - mg.currPosY) / old_currSizeY;

        var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * mg.currSizeX;
        var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * mg.currSizeX) + mg.currPosX;
        var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (container.getSizeX() / 2);
        mg.currPosX -= offsetX;

        var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * mg.currSizeY;
        var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * mg.currSizeY) + mg.currPosY;
        var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (container.getSizeY() / 2);
        mg.currPosY -= offsetY;

        updateUiBgSize();
        updateUiBgPos();
    });
}

function getContainerSize() { // Gets the container size from the DOM and sets to variables 
    container.getSizeX() = $("#micro-container").width();
    container.getSizeY() = $("#micro-container").height();
}







function resetClickPoints() {
    scaleBar.isSet = false;
    cl('scaleBar.isSet', scaleBar.isSet);
    scaleBar.clickPointsContainer = [];
    scaleBar.clickPointsImagePercent = [];
    $("#scalebar-info").html("");
}

function updateUiClickPoint() {
    $("#scalebar-info").html("");
    for (var i = 0; i < 2; i++) {
        $("#scalebar-info").append("scaleBar.clickPointsContainer[" + i + "]: ", scaleBar.clickPointsContainer[i], "<br>");
    };

}


function onScalebarSet() {
    var input = prompt("How long is that");
    scaleBar.imageScaleBarUnits = input;
    scaleBar.isSet = true;
    console.log('scaleBar.isSet', scaleBar.isSet);
    var length = Math.abs(scaleBar.clickPointsContainer[0] - scaleBar.clickPointsContainer[1]);
    $("#scalebar-info").append(length, "<br>");
    scaleBar.scaleImageRatio = Math.abs(scaleBar.clickPointsImagePercent[0] - scaleBar.clickPointsImagePercent[1])
    $("#scalebar-info").append("scaleBar.scaleImageRatio:", scaleBar.scaleImageRatio);
    updateUiScaleBar();


}

function updateUiScaleBar() {
    var overlayCenterWidth = $("#overlay-center").width();
    $("#scale-bar").css("width", overlayCenterWidth * .3 + "px");
    var scaleBarInnerLengthPx = $("#scale-bar-inner-bar").width();
    var scaleBarInnerPercentofBgImage = scaleBarInnerLengthPx / mg.currSizeX;
    var scaleBarLengthUnits = (scaleBarInnerPercentofBgImage / scaleBar.scaleImageRatio) * scaleBar.imageScaleBarUnits;
    $("#scale-bar-text").html(Math.round(scaleBarLengthUnits));


}

function setClickforScalebarListener() {
    $("#set-scalebar-button").on("click", function () {
        resetClickPoints();
        $("#micro-container").on("click", function (event) { // 
            scaleBar.clickPointsContainer.push(event.pageX);
            var imageXpercent = ((event.pageX) - mg.currPosX) / mg.currSizeX;
            console.log('imageXpercent', imageXpercent);
            scaleBar.clickPointsImagePercent.push(imageXpercent);
            updateUiClickPoint();
            if (scaleBar.clickPointsContainer.length === 2) {
                onScalebarSet();
                $(this).off("click");
            }
        });
    });
}


function getMiniDims() {
    var percentXtopLeft = -mg.currPosX / mg.currSizeX;
    console.log('percentXtopLeft', percentXtopLeft);
    var percentYtopLeft = -mg.currPosY / mg.currSizeY;
    console.log('percentYtopLeft', percentYtopLeft);

    var percentXbottomRight = (-mg.currPosX + container.getSizeX()) / mg.currSizeX;
    console.log('percentXbottomRight', percentXbottomRight);
    var percentYbottomRight = (-mg.currPosY + container.getSizeY()) / mg.currSizeY;
    console.log('percentYbottomRight', percentYbottomRight);

    var pxYtopLeft = percentYtopLeft * $("#mini-view-container").height()
    $("#mini-border").css("top", pxYtopLeft + "px");

    var pxXtopLeft = percentXtopLeft * $("#mini-view-container").width()
    $("#mini-border").css("left", pxXtopLeft + "px");


}

function makeDraggable() {
    $("#overlay-center").on("mousedown", function (event) {
        isMouseDown = true;
        ('mouseDown', isMouseDown);
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
            // TODO:  use event.originalevent.movementX;
            var differenceX = event.pageX - oldX;
            console.log('differenceX', differenceX);
            var differenceY = event.pageY - oldY;
            // $("#micro-container").css("background-position-x", "+=" + differenceX*.1 + "px");
            // //console.log("background-position-x" + $("#micro-container").css("background-position-x"));
            // $("#micro-container").css("background-position-y", "+=" + differenceY*.1 + "px");
            mg.currPosX = mg.currPosX + differenceX;
            mg.currPosY = mg.currPosY + differenceY;
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
                var old_currSizeX = mg.currSizeX;
                var old_currSizeY = mg.currSizeY;
                mg.currSizeX = mg.currSizeX * 1.05;
                mg.currSizeY = mg.currSizeY * 1.05;

                //Will putting this all in a div make this easier.
                var old_containerCenterX_relToImgCorner_percent = ((container.getSizeX() / 2) - mg.currPosX) / old_currSizeX;
                var old_containerCenterY_relToImgCorner_percent = ((container.getSizeY() / 2) - mg.currPosY) / old_currSizeY;

                var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * mg.currSizeX;
                var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * mg.currSizeX) + mg.currPosX;
                var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (container.getSizeX() / 2);
                mg.currPosX -= offsetX;

                var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * mg.currSizeY;
                var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * mg.currSizeY) + mg.currPosY;
                var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (container.getSizeY() / 2);
                mg.currPosY -= offsetY;

                break;
            case 45: // Pressed k, zoomed out
                var old_currSizeX = mg.currSizeX;
                var old_currSizeY = mg.currSizeY;

                mg.currSizeX = mg.currSizeX * 0.95;
                mg.currSizeY = mg.currSizeY * 0.95;
                var old_containerCenterX_relToImgCorner_percent = ((container.getSizeX() / 2) - mg.currPosX) / old_currSizeX;
                var old_containerCenterY_relToImgCorner_percent = ((container.getSizeY() / 2) - mg.currPosY) / old_currSizeY;

                var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * mg.currSizeX;
                var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * mg.currSizeX) + mg.currPosX;
                var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (container.getSizeX() / 2);
                mg.currPosX -= offsetX;

                var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * mg.currSizeY;
                var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * mg.currSizeY) + mg.currPosY;
                var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (container.getSizeY() / 2);
                mg.currPosY -= offsetY;
                break;
            case 100: // d
                mg.currPosX -= 20;
                break;
            case 97: //
                mg.currPosX += 20;
                break;
            case 119: // w
                mg.currPosY += 20;
                break;
            case 115: //s
                mg.currPosY -= 20;
                break;
            default:
            // code block
        }
        updateUiBgSize();
        updateUiBgPos();


        var containerCenterX_relToImgCorner_percent = ((container.getSizeX() / 2) - mg.currPosX) / mg.currSizeX;
        var containerCenterY_relToImgCorner_percent = ((container.getSizeY() / 2) - mg.currPosY) / mg.currSizeY;
        console.log(containerCenterX_relToImgCorner_percent);
        console.log(containerCenterY_relToImgCorner_percent);


    });
}

function setHoverListener() {
    $("#micro-container").hover( // On hover 
        function () {
            isHovering = true;  // set isHovering to true
            console.log('isHovering', isHovering)
        },
        function (event) {
            isHovering = false;
            console.log('isHovering', isHovering);

        }
    );




}

//Todos------------------
// Make Escape Key reset image
// Thing that show this is original image size
// MVP - Just scalebar and load image. After MVP, save image.
// remove draggability when not hovering .


// for miniview:
 // bg postion x diviv

 // If you click set scalebar, dragging the image shouldn't count as a click.