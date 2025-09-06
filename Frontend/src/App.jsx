import React from 'react';
import Homemain from './Home/HomeMain';
import { Route, Routes } from "react-router-dom";
import Home from './components/pages/Home';
import Contact from './components/Layout/Contact';
import About from './components/Layout/About';
import MusictoCode from './components/Layout/MusictoCode';

function App() {
  return (
   <>
      <Routes>
        <Route path="/" element={<Homemain />} />
        <Route path ="/main" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/About" element={<About/>} />
        <Route path="/musictocode" element={<MusictoCode/>} />


      </Routes>
   </>
  );
};

export default App;
