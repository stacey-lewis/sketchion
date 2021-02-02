import React, { useEffect} from "react";
import * as p5 from "p5";
import * as ml5 from "ml5";
import "./Handpose.css";

// console.log(ml5);
// console.log(p5);

const Handpose = () => {

  //default to line drawing
  // let [brushSelected, setBrushSelected] = useState(1);
  //default set to line drawing
  let brushSelector = 1;

  const Sketch = (p5) => {
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
     let verticesX = [ ];
     let verticesY = [];



     //set default width for canvas
     const setWidth = (p5.windowWidth - 340);
     const setHeight = (p5.windowHeight);

    p5.setup = () => {

      p5.colorMode(p5.HSL, 255);
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
        p5.strokeWeight(0);
        p5.fill(255);
        // p5.
      };


      // if pressed '1-6', update to brush style
      if (p5.keyIsPressed == true) {
        if (p5.key == '1') {
          brushSelector = 1; } //line
        else if (p5.key == '2'){
          brushSelector = 0; }//circle
        else if (p5.key == '3'){
          brushSelector = 2; }//area
        else if (p5.key == '4'){
          brushSelector = 3; }//circle
        else if (p5.key == '5'){
          brushSelector = 4; }//area
        else if (p5.key == '6'){
          brushSelector = 5; }//circle
      };

      console.log(brushSelector);

    }; //draw


    //   // if(ev.key === '1') {brushSelector = ev.key);
    //     console.log(ev.key);
    //   }
    // } //keyPressed


    const drawKeyPoints = () => {
      //check which brushSelector is selected.
      if (brushSelector === 0) {drawIndexDots()};
      if (brushSelector === 1) {drawIndexLine()};
      if (brushSelector === 2) {drawIndexThumb()};
      if (brushSelector === 3) {shadeIndexThumb()};
      if (brushSelector === 4) {drawIndexThumb()};
      if (brushSelector === 5) {drawIndexThumb()};

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

            p5.fill(0);
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
          p5.fill(45,50,65);

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

  }; //Sketch

  //re-render function
  useEffect(() => {
    //useEffect is used here as componentDidUpdate.
    new p5(Sketch);

         // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //use Effect

  //onClick update brush selector
  const brushSelectorFunction = (i) => {
    brushSelector = i;
  }; //brushSelectorFunction




  return(
     <>
     <div id="handpose-component">

       <header className="header">
         <h1 className="logo">sketchion.</h1>
         <div id="handpose-controls">
           <p id="info"><span className="logo">sketchion</span> tracks your hand , and translates movement into a visual representation.</p>
           <hr />
           <div className="detailed-instructions">
           <p>Simply enable access to your webcam, hold down <code>SHIFT</code> and start creating.</p>
             <p>Hit <code>DOWN ARROW</code> to reset the canvas.</p><br />
             <p>Select a brush (<code>1</code> - <code>6</code>):</p>
             <div className = "grid-swatches">
               <img onClick={() => brushSelectorFunction(1)}src="line.png" />
               <img onClick={() => brushSelectorFunction(0)}src="dots.png" />
               <img onClick={() => brushSelectorFunction(2)}src="hash.png" />
               <img onClick={() => brushSelectorFunction(1)}src="line.png" />
               <img onClick={() => brushSelectorFunction(0)}src="dots.png" />
               <img onClick={() => brushSelectorFunction(2)}src="hash.png" />
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
