import React, { useEffect, useState } from "react";
import * as p5 from "p5";
import * as ml5 from "ml5";
import * as dat from 'dat.gui';
import "./Handpose.css";

// console.log(ml5);
// console.log(p5);

const Handpose = () => {

  const Sketch = (p5) => {
     let cvs;
     let video;
     let predictions = [];
     // let root = document.documentElement;
     let prevXPos = "";
     let prevYPos = "";
     let prevXPosThumb = "";
     let prevYPosThumb = "";
     let xIndex = "";
     let yIndex = "";
     let xThumb = "";
     let yThumb = "";
     // const controls = {
     //    clearScreen: false,
     //    // velocityScale: 1.0,
     //    // circleSizeScale: 1.0,
     //    // lineDistanceThreshold: 150,
     //    // drawCircles: true,
     // };
     const setWidth = (p5.windowWidth - 300);
     const setHeight = (p5.windowHeight);
     //toggle drawing
     // const [drawStatus, updateDrawStatus] = useState(true);

    p5.setup = () => {
        //set width, height, options for video

       const options = {
         flipHorizontal: true,
         maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
         detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
         scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
         iouThreshold: 0.3
       }; //options

       //create p5.canvas
       cvs = p5.createCanvas(setWidth, setHeight);
       //create video component, save into 'video' - 'video' is linked to webcam not to replication on canvas...
       let constraints = {
         video: {
           mandatory: {
             minWidth: setWidth,
             minHeight: setHeight
           },
         //   optional: [{ maxFrameRate: 10 }]
       }, //video
         // audio: true
       };

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

       //-------------- TODO: GUI Controls (DON'T THINK I NEED THIS )----------
      // const gui = new dat.GUI();
      // gui.add(controls, 'clearScreen');

      // ----------------------------------------------------------------------

      //----------------------- TODO: Auto resize -----------------------------

       //auto resize to fit window on resize of browser window
       // p5.windowResized = () => {
       //   resizeCanvas(windowWidth, windowHeight);
       // };

    }; //setup


    ml5.modelReady = () => {
      console.log("Model ready!");

    }; //modelReady

    p5.draw = () => {
      //turn on webcam behind canvas
      // p5.image(video, 0, 0, setWidth, setHeight);

      //draw only if shift is held down
      if (p5.keyIsDown(16)) {
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
      };

      if(!p5.keyIsDown(16)) {
        prevXPos = 0;
        prevYPos = 0;
        prevXPosThumb = 0;
        prevYPosThumb = 0;
        xIndex = 0;
        yIndex = 0;
        xThumb = 0;
        yThumb = 0;
      };


    }; //draw

    //set window to expand to fullscreen
    // p5.keyPressed = (ev) => {
    //   if(ev.key === 'f') {
    //     p5.fullscreen(true);
    //     console.log(ev.key);
    //   }
    // } //keyPressed

    //----------- Determines tyoe of draw function to be run ... TODO: pressing a key type will change the draw type.

    const drawKeyPoints = () => {
      window.predictions = predictions; //cheat to see what is this variable in console.
      //TODO: Create way to click button on and off for type of drawing i.e. if x selected than run y draw function ...
      // drawFromAllHandPoints();
      // drawFromIndexFingerSharpLine();
      // drawFromIndexFingerCurveLine();
      drawWithIndexAndThumb();
      // drawFromIndexFingerDots();
    }; //drawKeypoints


    //---------------------DRAW FUNCTIONS ----------------------
    const drawFromAllHandPoints = () => {
      // console.log('predictions', predictions);
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];

        //loops through predictions and maps each element in the array
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
          //loops through each prediction landmark and then creates a cirle based on each one

          const keypoint = prediction.landmarks[j];

          p5.fill(
            //TODO: UPDATE WITH SINGLE COLOUR THAT IS GENERATED FROM dat.GUI
            (Math.floor(Math.random() * 256)),
            (Math.floor(Math.random() * 256)),
            (Math.floor(Math.random() * 256)),
          ); //draw colour across all fingerspoints
          p5.noStroke(); //no border
        p5.ellipse(keypoint[0], keypoint[1], 10, 10); //shape of draw.
        } //for
      } //for
    }; //drawFromAllHandPoints

    //Only draws from one point on the index finger
    const drawFromIndexFingerSharpLine = () => {
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        const keypoint = prediction.landmarks[8];
          //TODO: UPDATE WITH SINGLE COLOUR THAT IS GENERATED FROM dat.GUI
        // p5.point(keypoint[0], keypoint[1]); //no border
        p5.stroke(0);
        p5.line(keypoint[0], keypoint[1], prevXPos, prevYPos);
        prevXPos = keypoint[0];
        prevYPos = keypoint[1];
        // lerp = (current, new value, 0.5); - TODO: see if this works. https://www.youtube.com/watch?v=EA3-k9mnLHs - Code Train smoothing.
      } //for
    }; //drawFromIndexFingerSharpLine

    const drawFromIndexFingerDots = () => {
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        const keypoint = prediction.landmarks[8];
          //TODO: UPDATE WITH SINGLE COLOUR THAT IS GENERATED FROM dat.GUI
          if(keypoint[0] !== 0 && keypoint[2] !== 0) {
            p5.point(keypoint[0], keypoint[1]); //no border
            p5.fill(0);
          } //if - remove line from top of screen
      } //for
    }; //drawFromIndexFingerDots

    ///THIS DIDN"T WORK.
    const drawFromIndexFingerCurveLine = () => {
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        const keypoint = prediction.landmarks[8];
        p5.stroke(0);
        p5.line(keypoint[0], keypoint[1], prevXPos, prevYPos);
        prevXPos = keypoint[0];
        prevYPos = keypoint[1];
      } //for
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        const keypoint = prediction.landmarks[8];
        p5.stroke(0);
        p5.line(keypoint[0], keypoint[1], prevXPos, prevYPos);
        prevXPos = keypoint[0];
        prevYPos = keypoint[1];
      } //for
    }; //drawFromIndexFingerCurveLine

    const drawWithIndexAndThumb = () => {
      // for (let i = 0; i < predictions.length; i += 1) {
      //   const prediction = predictions[i];
      //   const keypoint = prediction.landmarks[8];
      //   if(prevXPos != 0 && prevYPos != 0) {
      //     p5.stroke(0);
      //     p5.line(keypoint[0], keypoint[1], prevXPos, prevYPos); //joins lines at top/bottom.
      //   } //if - removes line from top left to starting position
      //   prevXPos = keypoint[0];
      //   prevYPos = keypoint[1];
      // } //for
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];

        const indexFinger = prediction.landmarks[8];
        xIndex = p5.map(indexFinger[0],0,640,0,setWidth);
        yIndex = p5.map(indexFinger[1],0,480,0,setHeight);
        if(prevXPos != 0 && prevYPos != 0) {
          p5.stroke(0);
          p5.line(xIndex, yIndex, prevXPos, prevYPos); //joins lines at top/bottom.
        } //if - removes line from top left to starting position
        prevXPos = xIndex;
        prevYPos = yIndex;



        const keypoint = prediction.landmarks[4];
        xThumb = p5.map(keypoint[0],0,640,0,setWidth);
        yThumb = p5.map(keypoint[1],0,480,0,setHeight);

        if(prevXPos != 0 && prevYPos != 0 && prevXPosThumb != 0 && prevYPosThumb != 0 && xThumb != 0 && yThumb != 0) {
          p5.stroke(0);
          //TODO: CONSIDER ADDING FILL HERE

          p5.line(xThumb, yThumb, prevXPos, prevYPos);
          p5.line(xThumb, yThumb, prevXPosThumb, prevYPosThumb); //joins lines at top/bottom of link
        }  //if - removes line from top left to starting position
        prevXPosThumb = xThumb;
        prevYPosThumb = yThumb;
      } //for
    }; //drawWithIndexAndThumb

    //-----------------------------------------------------------

  }; //Sketch

  //re-render function
  useEffect(() => {
    //useEffect is used here as componentDidUpdate.
    new p5(Sketch);

         // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //use Effect




  return(
     <>
     <div id="handpose-component">

       <header className="header">
         <h1 className="logo">sketchion.</h1>
         <div id="handpose-controls">
           <p id="info"><span className="logo">sketchion</span> tracks your hand movement to translate your movement into a visual representation onscreen.</p>
           <hr />
           <div className="detailed-instructions">
           <p>Simply enable access to your webcam, hold down <code>SHIFT</code> and start creating</p>
             <p>Hit <code>DOWN ARROW</code> to reset the canvas</p>
             <p>Select from the following paint styles:</p>
             <div className = "grid-swatches">
               <p><img src="http://placekitten.com/100/100" /></p>
               <p><img src="http://placekitten.com/100/100" /></p>
               <p><img src="http://placekitten.com/100/100" /></p>
               <p><img src="http://placekitten.com/100/100" /></p>
               <p><img src="http://placekitten.com/100/100" /></p>
               <p><img src="http://placekitten.com/100/100" /></p>
               <p><img src="http://placekitten.com/100/100" /></p>
               <p><img src="http://placekitten.com/100/100" /></p>
               <p><img src="http://placekitten.com/100/100" /></p>
             </div>
          </div>



           {/* <button onClick= {() => p5.fullscreen()} >full screen</button> */}
           <p id='footer'>&copy; <span className="logo">sketchion</span> -- stacey lewis 2021</p>
         </div>
       </header>

      <div id="handpose-canvas">
            {/* CANVAS HERE */}
      </div>

      <div id="handpose-video-component">
          {/* WEBCAM HERE
            - TODO: button show-hide
            */}
      </div>
     </div>
     </>
   ); //return

}; //Canvas

export default Handpose;
