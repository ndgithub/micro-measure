
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
    mg.posX = ((containerSizeX - this.sizeX) / 2);// + $("#overlay-middle-left").width();
    mg.posY = ((containerSizeY - this.sizeY) / 2);//+ $("#overlay-top").height();
  },

  // Image Position (top left corner relative to #micro-container )


};

var scaleBar = {
  // Boolean for if the scalebar has been set (to turn off click listener)
  isSet: false,
  givenScaleImgPerc: "", //The length of the scalebar in the image (user input required)
  // Array for scalebar points relative to #micro-container
  clickPoints: "",
  //Array for scalebar points relative to image
  clickPointsImagePercent: "",
  // The length of the generated scalebar in screen px
  generatedScaleBarContainerLengthPx: "",
  imageScaleBarUnits: "",
};

var sidebar = {
  isSidebarOpen: true,
};



var ui = {
  getContainerSizeX: function () {
    return $("#micro-container").width();
  },
  getContainerSizeY: function () {
    return $("#micro-container").height();
  },

  setImageSize: function (sizeX, sizeY) {
    $("#micro-container").css("background-size", Math.floor(sizeX) + "px " + Math.floor(sizeY) + "px");
    if (scaleBar.isSet) {
      updateUiScaleBar();
    }
  },
  setImagePos: function (posX, posY) {
    $("#micro-container").css("background-position", Math.floor(posX) + "px " + Math.floor(posY) + "px");

  },

}

function wheeling() {
  $("#micro-container").on("mousewheel", function (event) {
    event.preventDefault();
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

    var new_pointToKeepCenteredX_ReltoContainer_pixels = (old_containerCenterX_relToImgCorner_percent * mg.sizeX) + mg.posX;
    var offsetX = new_pointToKeepCenteredX_ReltoContainer_pixels - (container.getSizeX() / 2);
    mg.posX -= offsetX;

    var new_pointToKeepCenteredY_ReltoContainer_pixels = (old_containerCenterY_relToImgCorner_percent * mg.sizeY) + mg.posY;
    var offsetY = new_pointToKeepCenteredY_ReltoContainer_pixels - (container.getSizeY() / 2);
    mg.posY -= offsetY;

    ui.setImageSize(mg.sizeX, mg.sizeY);
    ui.setImagePos(mg.posX, mg.posY);
  });
}

function resetClickPoints() {
  scaleBar.isSet = false;
  scaleBar.clickPoints = [];
  scaleBar.clickPointsImagePercent = [];

}

function updateUiClickPoint() {
  $("#scalebar-info").html("");
  for (var i = 0; i < 2; i++) {
    $("#scalebar-info").append("scaleBar.clickPointsContainer[" + i + "]: ", scaleBar.clickPoints[i], "<br>");
  };

}

function onScalebarSet() {
  var input = prompt("How long is that");
  scaleBar.imageScaleBarUnits = input;
  scaleBar.isSet = true;
  var length = Math.abs(scaleBar.clickPoints[0] - scaleBar.clickPoints[1]);
  $("#scalebar-info").append(length, "<br>");
  scaleBar.givenScaleImgPerc = Math.abs(scaleBar.clickPointsImagePercent[0] - scaleBar.clickPointsImagePercent[1])
  $("#scalebar-info").append("scaleBar.scaleImageRatio:", scaleBar.givenScaleImgPerc);
  updateUiScaleBar();

}

function updateUiScaleBar() {
  var rawInput = scaleBar.imageScaleBarUnits;
  var percentOfImageOfInputPoints = scaleBar.givenScaleImgPerc;
  var imageContainerRatio = mg.sizeX / container.getSizeX(); // Changes on zoom
  var imageSizeUnits = rawInput / percentOfImageOfInputPoints; //Never changes
  var containerSizeXUnits = imageSizeUnits / imageContainerRatio;
  targetLength = containerSizeXUnits * 0.3;

  var setLength_Units;

  if (targetLength < 1) {
    // In case it's in scientific notation
    targetLength = targetLength.toFixed(20)
    var setLength_Units = '0.'.split('');

    var targString = targetLength.toString();
    for (let i = 2; i < targString.length; i++) {
      const digit = targString[i];
      if (digit !== '0') {
        if (targString[i] >= 5) {
          setLength_Units.push('5');
          break;
        } else if (targString[i] < 5) {
          setLength_Units.push('1');
          break;
        }
      } else {
        setLength_Units.push('0');
      }
    }
    setLength_Units = parseFloat(setLength_Units.join(""));
  } else {
    setLength_Units = '';
    targetLength = parseInt(targetLength).toString();
    if (targetLength[0] >= 5) {
      setLength_Units += '5';
    } else {
      setLength_Units += '1';
    }
    for (let i = 1; i < targetLength.length; i++) {
      setLength_Units += '0';
    }
    setLength_Units = parseInt(setLength_Units);
  }
  var setLength_Px = (setLength_Units / containerSizeXUnits) * container.getSizeX();

  $('#scale-bar-inner-bar').css('width', setLength_Px);
  $('#scale-bar-text').text(setLength_Units);

  console.log('hello', mg);


}

function roundToClosest(num) {
  var numStr = num.toString();
  var divisor = '';
  divisor += numStr[0];
  for (var i = 1; i < num.toString().length; i++) {
    divisor += '0'
  }
  var divisor = parseInt(divisor);
  var closest = Math.round(num / divisor) * divisor;
  console.log('num', num);
  console.log('closest', closest);
  return closest;
}

function setClickforScalebarListener() {
  $("#set-scalebar-button").on("click", function () {
    resetClickPoints();
    var oldPos = [mg.posX, mg.posY]//Get current micro position
    console.log('oldPos', oldPos);
    $("#micro-container").on("click", function (event) { // click us on mouse release
      console.log('hi');
      var newPos = [mg.posX, mg.posY]
      if (JSON.stringify(oldPos) == JSON.stringify(newPos)) {
        console.log('hye');
        //if it moved, don't do anything, and make to the new position 
        scaleBar.clickPoints.push(event.pageX);
        var imageXpercent = ((event.pageX) - mg.posX) / mg.sizeX;
        scaleBar.clickPointsImagePercent.push(imageXpercent);
        updateUiClickPoint();
        if (scaleBar.clickPoints.length === 2) {
          onScalebarSet();
          $(this).off("click");
        }
      } else {
        oldPos = newPos;
      }


    });
  });
}


function makeDraggable() {
  $("#micro-container").on("mousedown", function (event) {
    isMouseDown = true;
    ('mouseDown', isMouseDown);
    oldX = event.pageX;
    oldY = event.pageY;
  });
  $("#micro-container").on("mouseup", function () {
    isMouseDown = false;

  });

  $("#micro-container").on("mousemove", function (event) {

    if (isMouseDown) {
      // TODO:  use event.originalevent.movementX;
      var differenceX = event.pageX - oldX;
      var differenceY = event.pageY - oldY;

      mg.posX = mg.posX + differenceX;
      mg.posY = mg.posY + differenceY;
      oldX = event.pageX;
      oldY = event.pageY;

      ui.setImagePos(mg.posX, mg.posY);
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

function onFileUpload() {
  var file = document.querySelector('input[type=file]').files[0];
  var reader = new FileReader();

  reader.addEventListener("load", function () {
    var fileSrc = reader.result;
    $('#micro-container').css('background-image', "url( " + fileSrc + ")");
  }, false);
}

function init() {
  mg.setInitSize(ui.getContainerSizeX(), ui.getContainerSizeY());
  mg.setInitPos(ui.getContainerSizeX(), ui.getContainerSizeY());

  ui.setImageSize(mg.sizeX, mg.sizeY); // updates image size in UI
  ui.setImagePos(mg.posX, mg.posY);

  setHoverListener(); // sets isHovering to true if hovering o #micro-contiainer
  setKeysForZoomListener(); // Set a keypress listener on the body for zoom and scroll
  setClickforScalebarListener();//Set a click listener on #micro-container to set scalebar ration points. Turns itself off after two clicks.
  makeDraggable();
  wheeling();
}

init();



