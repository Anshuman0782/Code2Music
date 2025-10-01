import React from 'react'
import Image from "../../assets/Image.png";
import { Link } from 'react-router-dom';

function Banner() {
  return (
    <>
    
    <main className="flex-1 bg-base-100 px-6 md:px-20 py-16 relative overflow-hidden">
      <section className="text-center md:flex md:items-center md:justify-between md:text-left md:gap-10">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Turn Your Code Into Music
          </h1>
          <p className="text-lg text-base-content mb-6">
            Experience programming like never before! Write code, run it, and hear it transform into beautiful melodies. 
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link to="/main" className="btn btn-primary btn-lg">
              Start Coding
            </Link>    

            <Link to="/About" className="px-10 btn btn-outline btn-lg">
              Tutorial
            </Link>  
          </div>
        </div>
        
        <div className="md:w-1/2 mt-10 md:mt-0 relative">
          <img 
            src={Image} 
            alt="Code to Music illustration" 
            className="w-full  transform transition-transform duration-1000 hover:scale-105 hover:-translate-y-2 animate-float"
          />
        </div>
      </section>

      {/* Decorative glowing circles for creativity */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400 opacity-20 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-400 opacity-20 rounded-full animate-pulse"></div>
    </main>
    </>
  );
};

export default Banner;
