import React from 'react';
import { BrowserRouter  , Routes, Route, Link } from 'react-router-dom';
// import './i18n';
import './App.css';
import { Home, Navbar } from './components';

const App = () => (
  <BrowserRouter>
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about-us" element={<AboutUs />} />
        <Route path="/special-menu" element={<SpecialMenu />} />
        <Route path="/chef" element={<Chef />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/laurels" element={<Laurels />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/find-us" element={<FindUs />} /> */}
      </Routes>
      {/* <Footer /> */}
    </div>
  </BrowserRouter>
);

export default App;
