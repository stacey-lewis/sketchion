import React from 'react';
import Handpose from './Handpose';

import './Home.css';

function Home() {
  return (
    <div className="home">
    <header className="header">
      <h1 className="logo">sketchion</h1>
    </header>
      <div>
        <Handpose />
      </div>
      {/* <Canvas /> */}
      <footer className="footer">
        <span>&copy; <span className="logo">sketchion</span> -- Stacey lewis 2021</span><span>Created utilising <a>ml5</a> and <a>p5</a> libraries </span>
      </footer>
    </div>
  );
}

export default Home;
