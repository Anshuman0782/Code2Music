import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md rounded-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold text-primary flex items-center gap-2">
          <img
            src="/logo_code.png"
            alt="Code2Music Logo"
            className="w-12 h-12 object-contain"
          />
          Code2Music
        </Link>
      </div>

      <div className="hidden md:flex flex-1 justify-center">
        <label className="input input-bordered flex items-center gap-2 w-72">
          <input type="text" className="grow" placeholder="Search music..." />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
            />
          </svg>
        </label>
      </div>

      <div className="flex-none gap-3">
        <ul className="menu menu-horizontal px-1 hidden md:flex">
          <li>
            <Link to="/" className="font-medium hover:text-primary">Home</Link>
          </li>
          <li>
            <Link to="/main" className="font-medium hover:text-primary">Explore</Link>
          </li>
           <li>
             <Link to="/Codegenerator" className="font-medium hover:text-primary">Generate  Code</Link>

          </li>
          <li>
             <Link to="/musictocode" className="font-medium hover:text-primary">Music to Code</Link>

          </li>
        </ul>

        <ThemeToggle />

        <div className="dropdown dropdown-end md:hidden">
          <label tabIndex="0" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/" className="hover:text-primary">Home</Link>
            </li>
            <li>
              <Link to="/main" className="hover:text-primary">Explore</Link>
            </li>
            <li>
              <Link to="/Codegenerator" className="font-medium hover:text-primary">Generate  Code</Link>
            </li>
            <li>
              <Link to="/musictocode" className="font-medium hover:text-primary">Music to Code</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
