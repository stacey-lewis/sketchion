import React, { useEffect } from "react";
import * as p5 from "p5";
import * as ml5 from "ml5";
console.log(ml5);

const Canvas = () => {

  const Sketch = (p5) => {
     let radius;
     let video;
     let poseNet;
     let pose;
     let skeleton;
     console.log('p5', p5);
     console.log('ml5', ml5);

    p5.setup = () => {
       p5.createCanvas(p5.windowWidth, p5.windowHeight);
       video = p5.createCapture(p5.VIDEO);
       video.hide();
       const poseNet = ml5.poseNet(video, ml5.modelLoaded);
       //ERROR -
       poseNet.on('pose', ml5.gotPoses );
    }; //setup

    ml5.gotPoses = (poses) => {
      // console.log(poses);
      if (poses.length > 0) {
         //if it finds a pose store it into pose ... could also use confidence to determine this.
         pose = poses[0].pose;
         skeleton = poses[0].skeleton;
         window.skeleton = skeleton;
      } //if
    }//gotPoses

    ml5.modelLoaded = () => {
      console.log('poseNet ready');
    } //modelLoaded

    p5.draw = () => {
     	p5.ellipse(p5.width/2,p5.height/2,radius,radius);
        radius++;
    }; //draw
  }; //Sketch

  useEffect(() => {
    new p5(Sketch);

         // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //use Effect

  return(
     <></>
   ); //return

}; //Canvas

export default Canvas;
