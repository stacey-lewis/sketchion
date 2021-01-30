import React, { useEffect } from "react";
import * as p5 from "p5";
import * as ml5 from "ml5";
console.log(ml5);

const Handpose = () => {

  const Sketch = (p5) => {
     let radius;
     let video;
     let handpose;
     let predictions = [];
     let img;

     console.log('p5', p5);
     console.log('ml5', ml5);

    p5.setup = () => {
       // p5.createCanvas(p5.windowWidth, p5.windowHeight);
       //STRETCH CANVAS IN CSS
       p5.createCanvas(640, 480);
       video = p5.createCapture(p5.VIDEO);
       video.size = (640, 480);

        // call modelReady() when it is loaded
       const handpose = ml5.handpose(video, ml5.modelReady);

       // This sets up an event that fills the global variable "predictions"
       // with an array every time new hand poses are detected
       handpose.on("predict", results => {
         predictions = results;
       });
       // Hide the video element, and just show the canvas
       // video.hide();
    }; //setup

    ml5.modelReady= () => {
      console.log("Model ready!");
      };

    p5.draw = () => {
      p5.background(255);
      //THIS WILL
      // p5.image(video, 0, 0, 640, 480);

      // We can call both functions to draw all keypoints and the skeletons
      drawKeypoints();
    }; //draw

    // A function to draw ellipses over the detected keypoints
    const drawKeypoints = () => {
      window.predictions = predictions; //cheat to see what is this variable in console.
      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
          const keypoint = prediction.landmarks[j];
          p5.fill(0, 255, 0);
          p5.noStroke();
        p5.ellipse(keypoint[0], keypoint[1], 10, 10);
        } //for
      } //for
    } //drawKeypoints


  }; //Sketch

  useEffect(() => {
    new p5(Sketch);

         // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //use Effect

  return(
     <></>
   ); //return

}; //Canvas

export default Handpose;
