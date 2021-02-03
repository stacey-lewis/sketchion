import React, { useEffect, useState} from "react";
import * as p5 from "p5";
import * as ml5 from "ml5";
import "./Handpose.css";
import {ChromePicker} from 'react-color';
import P5Wrapper from 'react-p5-wrapper';


  const sketch = (p5) => {
      //variables for
     let cvs;
     let video;
     //capture hand keyPoints
     let predictions = [];
     // let root = document.documentElement;
     let prevXPos = 0;
     let prevYPos = 0;
     let prevXPosThumb = 0;
     let prevYPosThumb = 0;
     let xIndex = 0;
     let yIndex = 0;
     let xThumb = 0;
     let yThumb = 0;
     let verticesX = [];
     let verticesY = [];
     let colorPicker = [];

     //TEST FOR WRAPPER ---------------------------------
     let brushSelectedWrapper = 1;
     //TEST FOR WRAPPER ---------------------------------

     //set default width for canvas
     const setWidth = (p5.windowWidth - 340);
     const setHeight = (p5.windowHeight);

    p5.setup = () => {

      p5.colorMode(p5.RGBA, 255);
      //set options for initialising handpose
       const options = {
         flipHorizontal: true,
         maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
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

       const saveImage = () =>
          {p5.saveCanvas('sketchion-creation', 'png');
        } //save option

       video = p5.createCapture(p5.VIDEO);

        // call modelReady() when it is loaded
      const handpose = ml5.handpose(video, options, ml5.modelReady);

       // This sets up an event that fills the global variable "predictions"
       // with an array every time new hand poses are detected
       handpose.on("predict", results => {
         predictions = results;
       });

       //set canvas parent as 'handpose-canvas'
       cvs.parent('handpose-canvas');

       //set video parent as 'handpose-video-component'
       video.parent('handpose-video-component');
       // Hide the video element, and just show the canvas
       video.hide();

       //set background colour to white of canvas
       p5.background(255);

       // Create a button for saving the canvas TODO:
        // const saveBtn = p5.createButton("Save Canvas");
        // saveBtn.parent('handpose-controls');
        // saveBtn.position(0, 0);
        // saveBtn.mousePressed(onSaveClick);

      //----------------------- TODO: Auto resize -----------------------------

       //auto resize to fit window on resize of browser window
       // p5.windowResized = () => {
       //   resizeCanvas(windowWidth, windowHeight);
       // };


    }; //setup

    //-----------------------TEST FOR WRAPPER ---------------------------
    //This is called when props change
    p5.myCustomRedrawAccordingToNewPropsHandler = (props) => {
      console.log('Custom Redraw!!!');
      if(props.brushselected) {
        brushSelectedWrapper = props.brushselected;
        console.log(brushSelectedWrapper);
      } //if
    };
    //-----------------------TEST FOR WRAPPER ---------------------------


    ml5.modelReady = () => {
      console.log("Model ready!");

    }; //modelReady

    p5.draw = () => {
      //turn on webcam behind canvas
      // p5.image(video, 0, 0, setWidth, setHeight);

      //draw only if shift is held down
      if (p5.keyIsDown(p5.SHIFT)) {
        drawKeyPoints();
      } //if keyIsDown

      //clear screen if down arrow pressed
      if (p5.keyIsDown(40)){
          p5.clear();
          p5.background(255);
          prevXPos = 0;
          prevYPos = 0;
          prevXPosThumb = 0;
          prevYPosThumb = 0;
          xIndex = 0;
          yIndex = 0;
          xThumb = 0;
          yThumb = 0;
          verticesX = [];
          verticesY = [];
      }; //if down arrow pushed clear screen and reset shapes

      if(!p5.keyIsDown(16)) {
        prevXPos = 0;
        prevYPos = 0;
        prevXPosThumb = 0;
        prevYPosThumb = 0;
        xIndex = 0;
        yIndex = 0;
        xThumb = 0;
        yThumb = 0;
        colorPicker = [0,0,0,1];
        verticesX = [];
        verticesY = [];
        // p5.
      }; //if SHIFT is not down

    }; //draw

    const drawKeyPoints = () => {
      //check which brushSelector is selected.

      if (brushSelectedWrapper === 0){
        drawIndexDots();
      }
      else if (brushSelectedWrapper === 1) {
        drawIndexLine();
      }
      else if (brushSelectedWrapper === 2) {
        drawIndexThumb();
      }
      else if (brushSelectedWrapper === 3) {
        shadeIndexThumb();
      }
      else if (brushSelectedWrapper === 4) {
        drawFromAllHandPoints();
      }
      else if (brushSelectedWrapper === 5)
      {drawFromAllHandPoints();
      } //end if brushSelected

    }; //drawKeypoints


    //---------------------DRAW FUNCTIONS --------------------

    const drawFromAllHandPoints = () => {
      // console.log('predictions', predictions);
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];

        //loops through predictions and maps each element in the array
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
          //loops through each prediction landmark and then creates a cirle based on each one

          const keypoint = prediction.landmarks[j];

          // p5.fill(
          //   //TODO: UPDATE WITH SINGLE COLOUR THAT IS GENERATED FROM dat.GUI
          //   (Math.floor(Math.random() * 256)),
          //   (Math.floor(Math.random() * 256)),
          //   (Math.floor(Math.random() * 256)),
          // ); //draw colour across all fingerspoints
          p5.noStroke(); //no border
        p5.ellipse(keypoint[0], keypoint[1], 10, 10); //shape of draw.
        } //for
      } //for
    }; //drawFromAllHandPoints

    //Only draws from one point on the index finger
    const drawIndexLine = () => {

      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        const indexFinger = prediction.landmarks[8];

        xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        yIndex = p5.map(indexFinger[1],0,480,0,setHeight);

        if(prevXPos != 0 && prevYPos != 0) {

          let size = 0;
          if ( ((xIndex - prevXPos) + (yIndex - prevYPos) / 2 ) < 10 ) {
            size = Math.abs(((xIndex - prevXPos) + (yIndex - prevYPos)) / 2);
          } //if
          else {
            size = 2;
          } //if else
          p5.strokeWeight(size);
          p5.stroke(0);
          p5.line(xIndex, yIndex, prevXPos, prevYPos); //joins lines at top/bottom.
        } //if - removes line from top left to starting position
      } //for
      prevXPos = xIndex;
      prevYPos = yIndex;
    }; //drawFromIndexFingerSharpLine

    //circle drawing from indexFinger. Circle size increases with distance between x-
    const drawIndexDots = () => {
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        const indexFinger = prediction.landmarks[8];
        xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        yIndex = p5.map(indexFinger[1],0,480,0,setHeight);

          if (xIndex != 0 && yIndex != 0) {
            let size = 0;
            if ( ((xIndex - prevXPos) + (yIndex - prevYPos) / 2 ) < 20 ) {
              size = Math.abs(((xIndex - prevXPos) + (yIndex - prevYPos)) / 2);
            } //if
            else {
              size = 20;
            } //if else
            //Set fill
            p5.fill(colorPicker[0],colorPicker[1],colorPicker[2],colorPicker[3]);
            // p5.fill(0);
            p5.ellipse(xIndex , yIndex, size, size); //shape of draw.
          } //if - remove line from top of screen
          prevXPos = xIndex;
          prevYPos = yIndex;


      } //for
    }; //drawFromIndexFingerDots

    //line drawing from thumb to index finger.
    const drawIndexThumb = () => {
      p5.stroke(0);
      p5.strokeWeight(1);
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];

        //GET INDEX POSITION - map to set to canvas size
        const indexFinger = prediction.landmarks[8];
        xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        yIndex = p5.map(indexFinger[1],0,480,0,setHeight);

        //GET THUMB POSITION - map to set to canvas size
        const keypoint = prediction.landmarks[4];
        xThumb = p5.map(keypoint[0],0,640,0,setWidth);
        yThumb = p5.map(keypoint[1],0,480,0,setHeight);

        //Draw lines - exclude if shift wasn't previously held down (to prevent auto-joining of drawn elements)
        if(prevXPos != 0 && prevYPos != 0 && prevXPosThumb != 0 && prevYPosThumb != 0 && xThumb != 0 && yThumb != 0 && xIndex != 0 && yIndex != 0) {
          p5.line(xIndex, yIndex, prevXPos, prevYPos);
          p5.line(xThumb, yThumb, prevXPos, prevYPos);
          p5.line(xThumb, yThumb, prevXPosThumb, prevYPosThumb); //joins lines at top/bottom of link
        }  //if

        //once mapped and drawn current position, set them as the previous positions
        prevXPosThumb = xThumb;
        prevYPosThumb = yThumb;
        prevXPos = xIndex;
        prevYPos = yIndex;
      } //for
    }; //drawIndexThumb

    //shading from thumb to index finger.
    const shadeIndexThumb = () => {
      p5.stroke(0);
      p5.strokeWeight(0);
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];

        //GET INDEX POSITION - map to set to canvas size
        const indexFinger = prediction.landmarks[8];
        xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        yIndex = p5.map(indexFinger[1],0,480,0,setHeight);

        //GET THUMB POSITION - map to set to canvas size
        const keypoint = prediction.landmarks[4];
        xThumb = p5.map(keypoint[0],0,640,0,setWidth);
        yThumb = p5.map(keypoint[1],0,480,0,setHeight);
        // const rectWidth = Math.abs(prevXPos - xIndex);
        // const rectHeight = Math.abs(xThumb - xIndex);
          //Draw shaded rectangles - exclude if shift wasn't previously held down (to prevent auto-joining of drawn elements)

          //set starting points for shape
          if(verticesX.length < 2 ) {
            verticesX = [xIndex , xThumb , xIndex];
            verticesY = [yIndex , yThumb , yIndex];
          } else {

          //set fill to HSLA - Hue, saturation, Light??Luminous??, Alpha
          p5.fill(colorPicker[0],colorPicker[1],colorPicker[2],colorPicker[3]);

          //determines the point to insert the new Index and Thumb x indices
          const insertVerticesPoint = Math.floor(verticesX.length / 2);
          verticesX.splice(insertVerticesPoint, 0, xIndex);
          verticesX.splice(insertVerticesPoint, 0, xThumb);
          verticesY.splice(insertVerticesPoint, 0, yIndex);
          verticesY.splice(insertVerticesPoint, 0, yThumb);

          //create a new shape based on the points stored in the vertices array.
          p5.beginShape();
            for (let i = 0; i < verticesX.length; i++) {
              p5.vertex(verticesX[i], verticesY[i]);
            }; //for
            p5.endShape();
          // p5.rect(xIndex, yIndex, rectWidth,44 rectHeight);

        }  //if

        //once drawn current, set that to the previous for the next draw.
        prevXPosThumb = xThumb;
        prevYPosThumb = yThumb;
        prevXPos = xIndex;
        prevYPos = yIndex;
      } //for
    }; //shadeIndexThumb

    //-----------------------------------------------------------
  }; //sketch

  export default sketch;


  // //re-render function
  // useEffect(() => {
  //   //useEffect is used here as componentDidMount.
  //   new p5(Sketch);
  //
  //        // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); //use Effect

  // //onClick update brush selector
  // const brushSelectorFunction = (i) => {
  //   setBrushSelected(i);
  //   // brushSelector = i;
  // }; //brushSelectorFunction

  //----------TEST UPDATE WRAPPER ----------------

  // const brushSelectedWrapperFunction = (i) => {
  //   brushSelectedWrapper = i;

  // }; //brushSelectedWrapperFunction
  //----------TEST UPDATE WRAPPER ----------------


  // //onChange update colour selector
  // const colourSelectorFunction = (color) => {
  //   colorPicker[0] = color.rgb.r;
  //   colorPicker[1] = color.rgb.g;
  //   colorPicker[2] = color.rgb.b;
  //   colorPicker[3] = color.rgb.a;
  // }; //colorSelectorFunction

  // color = {
     //   hex: '#333',
     //   rgb: {
     //     r: 51,
     //     g: 51,
     //     b: 51,
     //     a: 1,
     //   },
     //   hsl: {
     //     h: 0,
     //     s: 0,
     //     l: .20,
     //     a: 1,
     //   },
     // }

  // return(
  //    <>
  //    <div id="handpose-component">
  //
  //      <header className="header">
  //        <h1 className="logo">sketchion.</h1>
  //        <div id="handpose-controls">
  //          <p id="info"><span className="logo">sketchion</span> tracks your hand , and translates movement into a visual representation.</p>
  //          <hr />
  //          <div className="detailed-instructions">
  //          <p>Simply enable access to your webcam, hold down <code>SHIFT</code> and start creating.</p>
  //            <p>Hit <code>DOWN ARROW</code> to reset the canvas, & <code>s</code> to download canvas.</p><br />
  //            <p>Select a brush (<code>1</code> - <code>6</code>):</p>
  //            <div className = "grid-swatches">
  //              <img onClick={() => brushSelectorFunction(0)}src="line.png" />
  //              <img onClick={() => brushSelectorFunction(1)}src="dots.png" />
  //              <img onClick={() => brushSelectorFunction(2)}src="hash.png" />
  //              <img onClick={() => brushSelectorFunction(3)}src="line.png" />
  //
  //              {/* TEST WRAPPER  */}
  //              {/* <img onClick={() => brushSelectedWrapperFunction(4)}src="dots.png" /> */}
  //            </div>
  //
  //
  //             <ChromePicker
  //               onChange={(color) => colourSelectorFunction(color) }
  //             />
  //         </div>
  //
  //
  //
  //          {/* <button onClick= {() => p5.fullscreen()} >full screen</button> */}
  //          <p id='footer'>&copy; <span className="logo">sketchion</span> -- stacey lewis 2021</p>
  //        </div>
  //      </header>
  //
  //     <div id="handpose-canvas">
  //         <p5Wrapper sketch={Sketch} brushSelected={brushSelected}/>
  //     </div>
  //
  //     <div id="handpose-video-component">
  //         {/* WEBCAM HERE
  //           - TODO: button show-hide
  //           */}
  //     </div>
  //    </div>
  //    </>
  //  ); //return


// }; //Canvas
