import React from "react";
import * as p5 from "p5";
import * as ml5 from "ml5";
import "./Handpose.css";
// import {ChromePicker} from 'react-color';
import P5Wrapper from 'react-p5-wrapper';


  const sketch = (p5) => {

    //updated from state variables
    let drawSettings = {
      fillColor: {},
      borderColor: {},
      brushSelected: 1,
      loadingMessageSetter: null,
    }; //drawSettings

      //variables for setting positions
    let drawVar = {
      predictions: [],
      prevXPos: 0,
      prevYPos: 0,
      prevXPosThumb: 0,
      prevYPosThumb: 0,
      xIndex: 0,
      yIndex: 0,
      xThumb: 0,
      yThumb: 0,
      verticesX: [],
      verticesY: [],
    }; //drawVar

     let cvs;
     let video;

     //set default width for canvas
     let setWidth = (p5.windowWidth - 340);
     let setHeight = (p5.windowHeight);

     let canvasSize = {};
     // //capture hand keyPoints
     // let drawVar.predictions = [];
     // // let root = document.documentElement;
     // //initialise shape-related draws
     // let drawVar.prevXPos = 0;
     // let drawVar.prevYPos = 0;
     // let drawVar.prevXPosThumb = 0;
     // let drawVar.prevYPosThumb = 0;
     // let xIndex = 0;
     // let drawVar.yIndex = 0;
     // let drawVar.xThumb = 0;
     // let drawVar.yThumb = 0;
     // let drawVar.verticesX = [];
     // let drawVar.verticesY = [];

    p5.setup = () => {

      p5.colorMode(p5.RGBA, 255);
      //set options for initialising handpose
       const options = {
         flipHorizontal: true,
         maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad drawVar.predictions.
         detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
         scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
         iouThreshold: 0.3
       }; //options

       //create p5.canvas
       cvs = p5.createCanvas(setWidth, setHeight);

       //create video component, save into 'video'
       // let constraints = {
       //   video: {
       //     mandatory: {
       //       minWidth: setWidth,
       //       minHeight: setHeight
       //     },
       //   //   optional: [{ maxFrameRate: 10 }]
       // }, //video
       //   // audio: true
       // };

       video = p5.createCapture(p5.VIDEO);

        // call modelReady() when it is loaded
      const handpose = ml5.handpose(video, options, ml5.modelReady);

       // This sets up an event that fills the global variable "drawVar.predictions"
       // with an array every time new hand poses are detected
       handpose.on("predict", results => {
         drawVar.predictions = results;
       });

       //set canvas parent as 'handpose-canvas'
       cvs.parent('handpose-canvas');

       //set video parent as 'handpose-video-component'
       video.parent('handpose-video-component');
       // Hide the video element, and just show the canvas
       video.hide();

       //set background colour to white of canvas
       p5.background(255);
    }; //setup

    //-----------------------WRAPPER ---------------------------
    //This is called when props change - it notices the state variable that changes from Handpose.js and
    p5.myCustomRedrawAccordingToNewPropsHandler = (props) => {
      console.log('Custom Redraw!!!');
      //if notice change to brush - update in local variable
      if(props.brushselected) {
        drawSettings.brushSelected = props.brushselected;
      } //if

      if(typeof props.setloadingmessage === "function") {

        console.log('setloading message!', props.setloadingmessage);
        drawSettings.loadingMessageSetter = props.setloadingmessage;
      } //if

      //if notice change to fill colour - update in local variable

      if(props.fillcolourselected) {
        let rgbaFill = `rgba(${props.fillcolourselected.r},${props.fillcolourselected.g},${props.fillcolourselected.b},${props.fillcolourselected.a})`;
        drawSettings.fillColor = rgbaFill;

      } // if
      //if notice change to border colour - update in local variable
      if(props.outlinecolourselected) {
        let rgbaBorder = `rgba(${props.outlinecolourselected.r},${props.outlinecolourselected.g},${props.outlinecolourselected.b},${props.outlinecolourselected.a})`;
        drawSettings.borderColor = rgbaBorder;

      } // if
    };
    //-----------------------WRAPPER ---------------------------


    ml5.modelReady = () => {
      console.log("Model ready!");
      drawSettings.loadingMessageSetter("");
    }; //modelReady

    p5.draw = () => {
      //turn on webcam behind canvas
      // p5.image(video, 0, 0, setWidth, setHeight);

      //draw only if shift is held down
      if (p5.keyIsDown(13)) {
        drawKeyPoints();
      } //if keyIsDown

      //clear screen if down arrow pressed
      if (p5.keyIsDown(40)){
          p5.clear();
          p5.background(255);
          drawVar.prevXPos = 0;
          drawVar.prevYPos = 0;
          drawVar.prevXPosThumb = 0;
          drawVar.prevYPosThumb = 0;
          drawVar.xIndex = 0;
          drawVar.yIndex = 0;
          drawVar.xThumb = 0;
          drawVar.yThumb = 0;
          drawVar.verticesX = [];
          drawVar.verticesY = [];
      }; //if down arrow pushed clear screen and reset shapes

      if(!p5.keyIsDown(13)) {
        drawVar.prevXPos = 0;
        drawVar.prevYPos = 0;
        drawVar.prevXPosThumb = 0;
        drawVar.prevYPosThumb = 0;
        drawVar.xIndex = 0;
        drawVar.yIndex = 0;
        drawVar.xThumb = 0;
        drawVar.yThumb = 0;
        drawVar.verticesX = [];
        drawVar.verticesY = [];
        // p5.
      }; //if SHIFT is not down

      if (p5.keyIsPressed == true && p5.key === 's') {
        saveImage();
      } //save 's' shortcut


        // p5.windowResized = () => {
        //   console.log('windowresized');
        //   // p5.resizeCanvas(setWidth, setHeight);
        // }; //windowResized


    }; //draw

    const drawKeyPoints = () => {

      //setUniversalFillColor
      p5.fill(drawSettings.fillColor);
      p5.strokeWeight(1); //set default line to 1.
      p5.stroke(drawSettings.borderColor);

      //check which brushSelector is selected.
      if (drawSettings.brushSelected === 1){
        p5.noStroke(); //turn off border
        drawIndexDots();
      }
      else if (drawSettings.brushSelected === 2) {
        p5.strokeWeight(1); //set default line to 1.
        drawIndexLine();
      }
      else if (drawSettings.brushSelected === 3) {
        p5.noFill(); //set default line to 1.
        p5.strokeWeight(1); //set default line to 1.
        drawIndexThumb();
      }
      else if (drawSettings.brushSelected === 4) {
        p5.noStroke(); //turn off border
        shadeIndexThumb(); //draw function
      }
      else if (drawSettings.brushSelected === 5) {

        drawFromAllHandPoints();
      }
      else if (drawSettings.brushSelected === 6){
        drawFromAllHandPoints();
      } //end if drawSettings.brushSelected

    }; //drawKeypoints

    //---------------------DRAW FUNCTIONS --------------------

    const drawFromAllHandPoints = () => {
      // console.log('drawVar.predictions', drawVar.predictions);
      for (let i = 0; i < drawVar.predictions.length; i += 1) {
        const prediction = drawVar.predictions[i];
        //loops through drawVar.predictions and maps each element in the array
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
          //loops through each prediction landmark and then creates a cirle based on each one
          const keypoint = prediction.landmarks[j];
        p5.ellipse(keypoint[0], keypoint[1], 10, 10); //shape of draw.
        } //for
      } //for
    }; //drawFromAllHandPoints

    //Only draws from one point on the index finger
    const drawIndexLine = () => {

      for (let i = 0; i < drawVar.predictions.length; i += 1) {
        const prediction = drawVar.predictions[i];
        const indexFinger = prediction.landmarks[8];

        drawVar.xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        drawVar.yIndex = p5.map(indexFinger[1],0,480,0,setHeight);

        if(drawVar.prevXPos != 0 && drawVar.prevYPos != 0) {

          let size = 0;
          if ( ((drawVar.xIndex - drawVar.prevXPos) + (drawVar.yIndex - drawVar.prevYPos) / 2 ) < 10 ) {
            size = Math.abs(((drawVar.xIndex - drawVar.prevXPos) + (drawVar.yIndex - drawVar.prevYPos)) / 2);
          } //if
          else {
            size = 2;
          } //if else
          p5.strokeWeight(size);
          p5.line(drawVar.xIndex, drawVar.yIndex, drawVar.prevXPos, drawVar.prevYPos); //joins lines at top/bottom.
        } //if - removes line from top left to starting position
      } //for
      drawVar.prevXPos = drawVar.xIndex;
      drawVar.prevYPos = drawVar.yIndex;
    }; //drawFromIndexFingerSharpLine

    //circle drawing from indexFinger. Circle size increases with distance between x-
    const drawIndexDots = () => {
      for (let i = 0; i < drawVar.predictions.length; i += 1) {
        const prediction = drawVar.predictions[i];
        const indexFinger = prediction.landmarks[8];
        drawVar.xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        drawVar.yIndex = p5.map(indexFinger[1],0,480,0,setHeight);

        if (drawVar.xIndex != 0 && drawVar.yIndex != 0) {
          let size = 0;
          if ( ((drawVar.xIndex - drawVar.prevXPos) + (drawVar.yIndex - drawVar.prevYPos) / 2 ) < 20 ) {
            size = Math.abs(((drawVar.xIndex - drawVar.prevXPos) + (drawVar.yIndex - drawVar.prevYPos)) / 2);
          } //if
          else {
            size = 20;
          } //if else
          p5.ellipse(drawVar.xIndex , drawVar.yIndex, size, size); //shape of draw.
        } //if - remove line from top of screen
        drawVar.prevXPos = drawVar.xIndex;
        drawVar.prevYPos = drawVar.yIndex;

      } //for
    }; //drawFromIndexFingerDots

    //line drawing from thumb to index finger.
    const drawIndexThumb = () => {

      for (let i = 0; i < drawVar.predictions.length; i += 1) {
        const prediction = drawVar.predictions[i];

        //GET INDEX POSITION - map to set to canvas size
        const indexFinger = prediction.landmarks[8];
        drawVar.xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        drawVar.yIndex = p5.map(indexFinger[1],0,480,0,setHeight);

        //GET THUMB POSITION - map to set to canvas size
        const keypoint = prediction.landmarks[4];
        drawVar.xThumb = p5.map(keypoint[0],0,640,0,setWidth);
        drawVar.yThumb = p5.map(keypoint[1],0,480,0,setHeight);

        //Draw lines - exclude if shift wasn't previously held down (to prevent auto-joining of drawn elements)
        if(drawVar.prevXPos != 0 && drawVar.prevYPos != 0 && drawVar.prevXPosThumb != 0 && drawVar.prevYPosThumb != 0 && drawVar.xThumb != 0 && drawVar.yThumb != 0 && drawVar.xIndex != 0 && drawVar.yIndex != 0) {
          p5.line(drawVar.xIndex, drawVar.yIndex, drawVar.prevXPos, drawVar.prevYPos);
          p5.line(drawVar.xThumb, drawVar.yThumb, drawVar.prevXPos, drawVar.prevYPos);
          p5.line(drawVar.xThumb, drawVar.yThumb, drawVar.prevXPosThumb, drawVar.prevYPosThumb); //joins lines at top/bottom of link
        }  //if

        //once mapped and drawn current position, set them as the previous positions
        drawVar.prevXPosThumb = drawVar.xThumb;
        drawVar.prevYPosThumb = drawVar.yThumb;
        drawVar.prevXPos = drawVar.xIndex;
        drawVar.prevYPos = drawVar.yIndex;
      } //for
    }; //drawIndexThumb

    //shading from thumb to index finger.
    const shadeIndexThumb = () => {

      for (let i = 0; i < drawVar.predictions.length; i += 1) {
        const prediction = drawVar.predictions[i];

        //GET INDEX POSITION - map to set to canvas size
        const indexFinger = prediction.landmarks[8];
        drawVar.xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        drawVar.yIndex = p5.map(indexFinger[1],0,480,0,setHeight);

        //GET THUMB POSITION - map to set to canvas size
        const keypoint = prediction.landmarks[4];
        drawVar.xThumb = p5.map(keypoint[0],0,640,0,setWidth);
        drawVar.yThumb = p5.map(keypoint[1],0,480,0,setHeight);

        //set starting points for shape
        if(drawVar.verticesX.length < 2 ) {
          drawVar.verticesX = [drawVar.xIndex , drawVar.xThumb , drawVar.xIndex];
          drawVar.verticesY = [drawVar.yIndex , drawVar.yThumb , drawVar.yIndex];
        } else {
          //determines the point to insert the new Index and Thumb x indices
          const insertVerticesPoint = Math.floor(drawVar.verticesX.length / 2);
          drawVar.verticesX.splice(insertVerticesPoint, 0, drawVar.xIndex);
          drawVar.verticesX.splice(insertVerticesPoint, 0, drawVar.xThumb);
          drawVar.verticesY.splice(insertVerticesPoint, 0, drawVar.yIndex);
          drawVar.verticesY.splice(insertVerticesPoint, 0, drawVar.yThumb);

          //create a new shape based on the points stored in the vertices array.
          p5.beginShape();
            for (let i = 0; i < drawVar.verticesX.length; i++) {
              p5.vertex(drawVar.verticesX[i], drawVar.verticesY[i]);
            }; //for
            p5.endShape();
          // p5.rect(drawVar.xIndex, drawVar.yIndex, rectWidth,44 rectHeight);
        }  //if

        //once drawn current, set that to the previous for the next draw.
        drawVar.prevXPosThumb = drawVar.xThumb;
        drawVar.prevYPosThumb = drawVar.yThumb;
        drawVar.prevXPos = drawVar.xIndex;
        drawVar.prevYPos = drawVar.yIndex;
      } //for
    }; //shadeIndexThumb


    const saveImage = () =>
       {p5.saveCanvas('sketchion-creation', 'png');
     } //save option


      //----------------------- TODO: Auto resize -----------------------------

    // p5.windowResized = () => {
    //   p5.resizeCanvas(setWidth, setHeight);
    // }; //windowResized
  // };


  }; //sketch

  export default sketch;
