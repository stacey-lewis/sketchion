# Sketchion web Drawing App

## Motivation:
I enjoy the physical act of painting and wanted to translate this into a digital environment. It's great fun to see how movement can quickly create interesting effects with little effort and time - I find it quite therapeutic.


## Overview:

Sketchion is a web app that allows you to draw in the browser using hand movement and a selection of brush styles and colour.

The app uses your webcam to recognise hand movement via the ml5 package - handpose - and then translates this to the screen canvas utilising p5.

There are 5 types of brushes to choose from that take location data from points on your hand (mostly index and / or thumb) to draw onto the canvas. The speed with which you move your hand will alter the size of the 'filled circle' and 'line' brushes.

#### Brush types:
- filled circle - set colour via fill colour button, does not have a border colour. The speed of your movement translates to   
- line - set colour via border button, does not have a fill colour
- hash outline - set colour with border button, does not have fill colour. This brush maps the distance from thumb to index finger.
- hash fill - set colour with fill colour button, does not have a border. This brush maps the distance from thumb to index finger.
- hand - mostly to be able to see how the ml5 library works - this has a border and fill colour on each landmark of the hand.

## Technologies used:
- React (hooks)
- ml5 - handpose (hand recognition pre-trained model)
- p5 - canvas drawing tool
- React-color (for colour swatches)
- react-p5-wrapper (enable passing of props to p5)

## Instructions for use:
- enable WebCam
- wait a few seconds for the webcam to load...
- choose a brush swatch (default - filled circle) fill colour and border colour (default - black) (see notes above for which brushes have borders vs fill).
- hold the 'RETURN' key to draw and release to stop drawing.
- Slowly move your hand across your screen to see your movement come to life! Play with moving your hand in different directions at different speeds, and try to keep your hand pointed at the camera so it can be accurately mapped (although you'll get some interesting effects as the model tries to recognise your hand). Try different brushes, and colours with high transparency to get some interesting effects! Have a play!
- hit 's' (lowercase) key to download your creation!
- hit 'DOWN ARROW' to clear the canvas, or refresh the page.

NOTE: the ml5 handpose model can only recognise one hand at a time at the time of creating this app.

## Known bugs:
- canvas cannot be resized dynamically. If you resize after load you need to refresh the browser window to resize the canvas.


## Planned additions:
- implement similar drawing via face landmark and body landmark detection (also via ml5 package.)
- additional brushes with different shapes
- ability to choose background colour
- full screen drawing (hide side menu)
- fix canvase resize
