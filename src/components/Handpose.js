import React, { useEffect } from "react";
import * as p5 from "p5";
import * as ml5 from "ml5";
import "./Handpose.css";


console.log(ml5);
console.log(p5);

const Handpose = () => {

  const Sketch = (p5) => {
     let cvs;
     let video;
     let predictions = [];
     // let root = document.documentElement;
     let prevXPos = "";
     let prevYPos = "";


     console.log('p5', p5);
     console.log('ml5', ml5);

    p5.setup = () => {
       // p5.createCanvas(p5.windowWidth, p5.windowHeight);
       //TODO: STRETCH CANVAS IN CSS
       cvs = p5.createCanvas(p5.windowWidth * (5/8), p5.windowHeight * (6/8));
       // console.log(cvs);
       // cvs.style('display', 'inline-block');
       video = p5.createCapture(p5.VIDEO);
       video.size = (640, 480);

        // call modelReady() when it is loaded
       const handpose = ml5.handpose(video, ml5.modelReady);
       // let parent = document.getElementById('handpose-component');

       // This sets up an event that fills the global variable "predictions"
       // with an array every time new hand poses are detected
       handpose.on("predict", results => {
         predictions = results;
       });
       cvs.parent('handpose-canvas');
       video.parent('handpose-video-component');
       console.log('video', video);
       video.style(
         {"width": "100%"},
         {"height": "100%"},
         // {"display": "inline-block"}, //DOES NOT WORK ON GRID
         {"position": "absolute"}
       );

       cvs.style(
         {"width": "100%"},
         {"height": "100%"},
         {"display": "block"},
         // {"grid-column-start": "1 / span 2"},
         // {"grid-row-start": "row1-start / span 2"},
       ); //cvs.style

       // Hide the video element, and just show the canvas
       p5.background(255);
       video.hide();

       //auto resize to fit window on resize of browser window
       // p5.windowResized = () => {
       //   resizeCanvas(windowWidth, windowHeight);
       // };


    }; //setup

    ml5.modelReady= () => {
      console.log("Model ready!");
      };

    p5.draw = () => {
      //set background to white ... this removes previous draws on each update.

      // We can call both functions to draw all keypoints and the skeletons
      drawKeypoints();
    }; //draw

    // A function to draw ellipses over the detected keypoints
    const drawKeypoints = () => {
      window.predictions = predictions; //cheat to see what is this variable in console.
      //TODO: Create way to click button on and off for type of drawing i.e. if x selected than run y draw function ...
    // drawFromAllHandPoints();
    drawFromIndexFingerLine();
      //for each marker on the hand, loop through and apply fill of bright green, no border, and of a circle.
  }; //drawKeypoints


  //---------------------DRAW FUNCTIONS ----------------------
  const drawFromAllHandPoints = () => {
    // console.log('predictions', predictions);
    for (let i = 0; i < predictions.length; i += 1) {
      const prediction = predictions[i];
      console.log(prediction);
      //loops through predictions and maps each element in the array
      for (let j = 0; j < prediction.landmarks.length; j += 1) {
        //loops through each prediction landmark and then creates a cirle based on each one

        const keypoint = prediction.landmarks[j];
        console.log(keypoint);
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
  const drawFromIndexFingerLine = () => {
    for (let i = 0; i < predictions.length; i += 1) {
      const prediction = predictions[i];
      const keypoint = prediction.landmarks[8];

      // console.log(keypoint);
      // p5.fill(0,0,0); //draw colour across index finger.
        //TODO: UPDATE WITH SINGLE COLOUR THAT IS GENERATED FROM dat.GUI
      // p5.point(keypoint[0], keypoint[1]); //no border
      p5.stroke(0);
      p5.line(keypoint[0], keypoint[1], prevXPos, prevYPos);
      prevXPos = keypoint[0];
      prevYPos = keypoint[1];
      // lerp = (current, new value, 0.5); - TODO: see if this works. https://www.youtube.com/watch?v=EA3-k9mnLHs - Code Train smoothing.
      // p5.ellipse(keypoint[0], keypoint[1], 10, 10); //shape of draw.
    } //for
  }; //drawFromIndexFingerLine

  const drawWithPalm = () => {
    for (let i = 0; i < predictions.length; i += 1) {
      const prediction = predictions[i];
      for (let j = 0; j < prediction.landmarks.length; j += 1) {
        const keypoint = prediction.landmarks[j];
        p5.fill(0, 255, 0); //draw colour across all fingerspoints
        p5.noStroke(); //no border
      p5.ellipse(keypoint[0], keypoint[1], 10, 10); //shape of draw.
      } //for
    } //for
  }; //drawFromAllHandPoints




  }; //Sketch

  useEffect(() => {
    //useEffect is used here as componentDidUpdate.
    new p5(Sketch);

         // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //use Effect

  const clearCanvas = (ev) => {
    ev.preventDefault();
    p5.background(255);
  };

  return(
     <>
     <div id="handpose-component">
       <div id="handpose-controls">
         {/* CONTROLS HERE */}
         <div id="handpose-colour-palette">color palette</div>
         <div id="handpose-transparency">transparency scroller</div>
         <div id="handpose-brush-selector">brush selector</div>
         <button id="handpose-clear-canvas" >clear canvas</button>
         <button id="handpose-export-image" >download canvas</button>
         <button id="handpose-toggle-draw" >toggle drawing</button>
         <h6>clear canvas</h6>
         <label id="handpose-clear-canvas" className="switch">
           <input type="checkbox" checked ></input>
           <span className="slider round"></span>
         </label>

       </div>
       <div id="handpose-canvas-container" >
          <div id="handpose-canvas">
            {/* CANVAS HERE */}
          </div>
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
