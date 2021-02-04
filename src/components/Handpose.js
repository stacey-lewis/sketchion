import React, { useEffect, useState} from "react";
import * as p5 from "p5";
import * as ml5 from "ml5";
import "./Handpose.css";
import {ChromePicker} from 'react-color';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './Sketch';


const Handpose = (props) => {

  //default set to line drawing
  const [brushSelected, setBrushSelected] = useState(1);
  const [loadingMessage, setLoadingMessage] = useState('loading ... ');
  const [outlineWidthSelected, setOutlineWidthSelected] = useState(1);
  const [fillColorSelected, setFillColorSelected] = useState({
    r: 0,
    g: 0,
    b: 0,
    a: 1
  });
  const [outlineColorSelected, setOutlineColorSelected] = useState({
    r: 0,
    g: 0,
    b: 0,
    a: 1
  });
  const [displayBackGroundColorPicker, setDisplayBackgroundColorPicker] = useState(false);
  const [displayBorderColorPicker, setDisplayBorderColorPicker] = useState(false);
  // const [windowSize, setWindowSize] = useState({
  //     width: window.innerWidth,
  //     height: window.innerHeight
  //   }); //canvasSize state

    // useEffect( () => {
    //   if (windowSize.width != window.innerWidth || windowSize.height != window.innerHeight) {
    //     console.log('updating windowsize!');
    //     setWindowSize({width: window.innerWidth, height: window.innerHeight});
    //   } //if
    // },[]); //useEffect

  //onClick update brush selector
  const brushSelectorFunction = (i) => {
    setBrushSelected(i);
  }; //brushSelectorFunction

  //onChange update colour selector
  const colourSelectorFunction = (color, fill) => {
    // console.log('fill', fillColorSelected);
    if(fill) {
      setFillColorSelected(color.rgb);
      // console.log('fill - after set', fillColorSelected);
    } else {
      // console.log('outline', outlineColorSelected);
      setOutlineColorSelected(color.rgb);
      // console.log('outline - after set', outlineColorSelected);
    }
  }; //colorSelectorFunction


  //onClick open background color selector
  const openColorButton = (button) => {
    if (button === 'background') {
      setDisplayBackgroundColorPicker(!displayBackGroundColorPicker);
    }; //if
    if (button === 'border') {
      setDisplayBorderColorPicker(!displayBorderColorPicker);
    }; //if
  }; //openColorBackgroundButton

  //onClick open background color selector
  const closeColorButton = (button) => {
    if (button === 'background') {
      setDisplayBackgroundColorPicker(false);
    }; //
    if (button === 'border') {
      setDisplayBorderColorPicker(false);
    }; //

  }; //openColorBackgroundButton

  return(
     <>
     <div id="handpose-component">
       <header className="header">
         <h1 className="logo">sketchion.</h1>
         <div id="handpose-controls">
           <p id="info"><span className="logo">sketchion</span> tracks your hand movement - enabling you to create expressive digital artworks.</p>
           <hr />
           <div className="detailed-instructions">
           <p>Simply enable webcam, hold down <code>ENTER</code> and start creating.</p>
             <p>Hit <code>DOWN ARROW</code> to reset the canvas, & <code>s</code> to download canvas.</p> <br/>
             {/* <p>Select a brush (<code>1</code> - <code>5</code>):</p> */}
             <div className = "grid-swatches">
               <img onClick={() => brushSelectorFunction(1)} src="dots.png" alt="" style={{border: brushSelected === 1 ? "2pt solid rgb(185, 185, 185)": "2pt solid rgb(185, 185, 185, 0.15)"}}/>
               <img onClick={() => brushSelectorFunction(2)} src="line.png" alt="" style={{border: brushSelected === 2 ? "2pt solid rgb(185, 185, 185)": "2pt solid rgb(185, 185, 185, 0.15)"}}/>
               <img onClick={() => brushSelectorFunction(3)} src="Hash.png" alt="" style={{border: brushSelected === 3 ? "2pt solid rgb(185, 185, 185)": "2pt solid rgb(185, 185, 185, 0.15)"}}/>
               <img onClick={() => brushSelectorFunction(4)} src="Hash-fill.png" alt="" style={{border: brushSelected === 4 ? "2pt solid rgb(185, 185, 185)": "2pt solid rgb(185, 185, 185, 0.15)"}}/>
               <img onClick={() => brushSelectorFunction(5)} src="hand.png" alt="" style={{border: brushSelected === 5 ? "2pt solid rgb(185, 185, 185)": "2pt solid rgb(185, 185, 185, 0.15)"}}/>
            </div>
            <div className="button1">
              <button className="colourButton" onClick={() => openColorButton('background')}>fill colour
                <div className='previewBackgroundColor' style={{backgroundColor: ` rgba(${fillColorSelected.r},${fillColorSelected.g},${fillColorSelected.b},${fillColorSelected.a})`, border: `2pt solid  rgba(${fillColorSelected.r},${fillColorSelected.g},${fillColorSelected.b},${fillColorSelected.a})`}}>

                </div>
              </button>
              { displayBackGroundColorPicker ?
                <div className='popover'>
                  <div className='cover' onClick={() => closeColorButton('background')} ></div>
                 <ChromePicker
                    color={fillColorSelected} onChangeComplete={(color, fill) => colourSelectorFunction(color, fill=true) } />
              </div> : null }
            </div>

            <div className="button2">
              <div>
                <button className="colourButton" onClick={() => openColorButton('border')}>
                  border colour
                  <div className='previewBorderColor' style={{border: `2pt solid rgba(${outlineColorSelected.r},${outlineColorSelected.g},${outlineColorSelected.b},${outlineColorSelected.a})`}}>
                  </div>
                </button>
              </div>
              { displayBorderColorPicker ?
                <div className='popover'>
                  <div className='cover' onClick={() => closeColorButton('border')} ></div>
                  <ChromePicker
                  color={outlineColorSelected} onChangeComplete={(color, fill) => colourSelectorFunction(color, fill=false) } />

              </div> : null }
            </div>
            <div>

            </div>
          </div>
          <p id='footer'>&copy; <span className="logo">sketchion</span> -- stacey lewis 2021</p>
        </div>
       </header>
      <div id="handpose-canvas">
        <div className="loadingmessage">{loadingMessage} </div>
        <P5Wrapper sketch={sketch} brushselected={brushSelected} outlinecolourselected={outlineColorSelected} fillcolourselected={fillColorSelected}
        setloadingmessage={setLoadingMessage}
        // windowsize={windowSize}
      />
      </div>
      <div id="handpose-video-component">
        {/* WEBCAM HERE LATER ??? */}
      </div>
    </div>
    </>
   ); //return

}; //Canvas

export default Handpose;
