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
    sizeX: "",
    sizeY: "",
    // Position of current image
    posX: "",
    posY: "",

    setInitSize: function (containerSizeX, containerSizeY) {
        var ratioY = this.origSizeY / containerSizeY;
        this.sizeY = this.origSizeY / ratioY; //460 
        this.sizeX = this.origSizeX / ratioY; //1360

        var newRatioX = this.sizeX / containerSizeX; // 1.1
        if (newRatioX >= 1) {
            this.sizeX = containerSizeX; //1280
            this.sizeY = this.sizeY / newRatioX; // 469 / 1.1
        }
    },
    //sets initial position relative to its container
    setInitPos: function (containerSizeX, containerSizeY) {
        mg.posX = ((containerSizeX - this.sizeX) / 2) + $("#overlay-middle-left").width() ;
        mg.posY = ((containerSizeY - this.sizeY) / 2) + $("#overlay-top").height();
        console.log("caca" + $('#overlay-middle-left').width());
    },

    // Image Position (top left corner relative to #micro-container )


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
    isSidebarOpen: true,
};

var mv = {
    sizeX: null,
    sizeY: null,
    posX: null,
    posY: null,
    setMiniSize: function () {
        var ratioX = $("#overlay-center").width() / mg.sizeX;
        console.log('ratioX____', ratioX);
        var ratioY = $("#overlay-center").height() / mg.sizeY;
        // minisize 
        this.sizeX = ratioX * $("#mini-view-container").width();
        this.sizeY = ratioY * $("#mini-view-container").height();
        console.log('this.sizeY', this.sizeY);

    },
    setMiniPos: function () {
        var ratioX = (-mg.posX + $("#overlay-center").position().left) / mg.sizeX;
        console.log('posX', mg.posY);
        var ratioY = (-mg.posY + $("#overlay-middle-row").position().top) / mg.sizeY;

        this.posX = ratioX * $("#mini-view-container").width();
        this.posY = ratioY * $("#mini-view-container").height();

        console.log("asdfadfsafd " + $("#overlay-middle-row").position().top);
    }
}

var ui = {
    getContainerSizeX: function () {
        return $("#micro-container").width();
    },
    getContainerSizeY: function () {
        return $("#micro-container").height();
    },
    getCenterSizeX: function () {
        return $("#overlay-center").width();
    },
    getCenterSizeY: function () {
        return $("#overlay-center").height();
    },
    setImageSize: function (sizeX, sizeY) {
        $("#micro-container").css("background-size", Math.floor(sizeX) + "px " + Math.floor(sizeY) + "px");
        if (scaleBar.isSet) {
            updateUiScaleBar();
        }
    },
    setImagePos: function (posX, posY) {
        $("#micro-container").css("background-position", Math.floor(posX) + "px " + Math.floor(posY) + "px");
        this.setMiniSize();
        this.setMiniPos();
    },
    setMiniSize: function () {
        $("#mini-border").width(mv.sizeX);
        $("#mini-border").height(mv.sizeY);

    },
    setMiniPos: function () {
        $("#mini-border").css("left", mv.posX + "px");
        $("#mini-border").css("top", mv.posY + "px");
    }

}

mg.setInitSize(ui.getCenterSizeX(), ui.getCenterSizeY());
mg.setInitPos(ui.getCenterSizeX(), ui.getCenterSizeY());

ui.setImageSize(mg.sizeX, mg.sizeY); // updates image size in UI
ui.setImagePos(mg.posX, mg.posY);

mv.setMiniSize();
ui.setMiniSize();

mv.setMiniPos();
ui.setMiniPos();





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
        if (sidebar.isSidebarOpen) {
            document.getElementById("mySidenav").style.width = "0%";
            document.getElementById("micro-container").style.width = "100%";
            sidebar.isSidebarOpen = false;
            // TODO: readjust position of img...maybe
        } else {
            document.getElementById("mySidenav").style.width = "20%";
            document.getElementById("micro-container").style.width = "80%";
            sidebar.isSidebarOpen = true;
            //ui.setImageSize(mg.sizeX,mg.sizeY);

            // TODO: readjust position of img...maybe

        }
    });

}

function ministuff() {


}

function wheeling() {
    $("#micro-container").on("mousewheel", function (event) {
        console.log(event.originalEvent.wheelDelta);
        console.log("****");
        var old_sizeX = mg.sizeX;
        var old_sizeY = mg.sizeY;
        if (event.originalEvent.wheelDelta > 0) {
            mg.sizeX *= 1.02;
            mg.sizeY *= 1.02;
        } else {
            mg.sizeX *= 0.98;
            mg.sizeY *= 0.98;
        }


        //Will putting this all in a div make this easier.
        var old_containerCenterX_relToImgCorner_percent = ((container.getSizeX() / 2) - mg.posX) / old_sizeX;
        var old_containerCenterY_relToImgCorner_percent = ((container.getSizeY() / 2) - mg.posY) / old_sizeY;

        var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * mg.sizeX;
        var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * mg.sizeX) + mg.posX;
        var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (container.getSizeX() / 2);
        mg.posX -= offsetX;

        var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * mg.sizeY;
        var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * mg.sizeY) + mg.posY;
        var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (container.getSizeY() / 2);
        mg.posY -= offsetY;

        ui.setImageSize(mg.sizeX, mg.sizeY);
        ui.setImagePos(mg.posX, mg.posY);

        mv.setMiniSize();
        mv.setMiniPos();

        ui.setMiniSize();
        ui.setMiniPos();

    });
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
    var scaleBarInnerPercentofBgImage = scaleBarInnerLengthPx / mg.sizeX;
    var scaleBarLengthUnits = (scaleBarInnerPercentofBgImage / scaleBar.scaleImageRatio) * scaleBar.imageScaleBarUnits;
    $("#scale-bar-text").html(Math.round(scaleBarLengthUnits));
}

function setClickforScalebarListener() {
    $("#set-scalebar-button").on("click", function () {
        resetClickPoints();
        $("#micro-container").on("click", function (event) { // 
            scaleBar.clickPointsContainer.push(event.pageX);
            var imageXpercent = ((event.pageX) - mg.posX) / mg.sizeX;
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



function makeDraggable() {
    $("#overlay-center").on("mousedown", function (event) {
        isMouseDown = true;
        ('mouseDown', isMouseDown);
        oldX = event.pageX;
        oldY = event.pageY;
    });
    $("#overlay-center").on("mouseup", function () {
        isMouseDown = false;

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
            mg.posX = mg.posX + differenceX;
            mg.posY = mg.posY + differenceY;
            oldX = event.pageX;
            oldY = event.pageY;

            ui.setImagePos(mg.posX, mg.posY);

            mv.setMiniSize();
            mv.setMiniPos();

            ui.setMiniSize();
            ui.setMiniPos();

        };

    });
}

function setKeysForZoomListener() { // Set a keypress listener on the body for zoom and scroll
    $("body").on("keypress", function (event) {
        console.log("event.which " + event.keyCode);
        //press i, zoom in
        switch (event.which) {
            case 61:
                var old_sizeX = mg.sizeX;
                var old_sizeY = mg.sizeY;
                mg.sizeX = mg.sizeX * 1.05;
                mg.sizeY = mg.sizeY * 1.05;

                //Will putting this all in a div make this easier.
                var old_containerCenterX_relToImgCorner_percent = ((container.getSizeX() / 2) - mg.posX) / old_sizeX;
                var old_containerCenterY_relToImgCorner_percent = ((container.getSizeY() / 2) - mg.posY) / old_sizeY;

                var new_pointToKeepCenteredX_ReltoImage_pixels = old_containerCenterX_relToImgCorner_percent * mg.sizeX;
                var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * mg.sizeX) + mg.posX;
                var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (container.getSizeX() / 2);
                mg.posX -= offsetX;

                var new_pointToKeepCenteredY_ReltoImage_pixels = old_containerCenterY_relToImgCorner_percent * mg.sizeY;
                var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * mg.sizeY) + mg.posY;
                var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (container.getSizeY() / 2);
                mg.posY -= offsetY;

                break;
            case 45: // Pressed k, zoomed out
                var old_sizeX = mg.sizeX;
                var old_sizeY = mg.sizeY;

                mg.sizeX = mg.sizeX * 0.95;
                mg.sizeY = mg.sizeY * 0.95;
                var old_containerCenterX_relToImgCorner_percent = ((container.getSizeX() / 2) - mg.posX) / old_sizeX;
                var old_containerCenterY_relToImgCorner_percent = ((container.getSizeY() / 2) - mg.posY) / old_sizeY;

                var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * mg.sizeX) + mg.posX;
                var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (container.getSizeX() / 2);
                mg.posX -= offsetX;

                var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * mg.sizeY) + mg.posY;
                var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (container.getSizeY() / 2);
                mg.posY -= offsetY;
                break;
            case 100: // d
                mg.posX -= 20;
                break;
            case 97: //
                mg.posX += 20;
                break;
            case 119: // w
                mg.posY += 20;
                break;
            case 115: //s
                mg.posY -= 20;
                break;
            default:
            // code block
        }
        ui.setImageSize(mg.sizeX, mg.sizeY);

        ui.setImagePos(mg.posX, mg.posY);
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


// for mv:
 // bg postion x diviv

 // If you click set scalebar, dragging the image shouldn't count as a click.