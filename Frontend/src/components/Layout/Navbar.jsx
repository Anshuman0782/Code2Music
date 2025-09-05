import React from "react";
import ThemeToggle from "./ThemeToggle";


function Navbar() {

  
  return (
    <>
      <div class="navbar bg-base-100 shadow-md rounded-lg">
      <div className="flex-1">
  <a className="btn btn-ghost normal-case text-2xl font-bold text-primary flex items-center gap-2">
    <img
      src="/logo_code.png"
      alt="Code2Music Logo"
      className="w-12 h-12 object-contain"
    />
  Code2Music
  </a>
</div>


        <div class="hidden md:flex flex-1 justify-center">
          <label class="input input-bordered flex items-center gap-2 w-72">
            <input type="text" class="grow" placeholder="Search music..." />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
              />
            </svg>
          </label>
        </div>

        <div class="flex-none gap-3">
          <ul class="menu menu-horizontal px-1 hidden md:flex">
            <li>
              <a href="/" class="font-medium hover:text-primary">Home</a>
            </li>
            <li>
              <a href="/main" className="font-medium hover:text-primary">
                Explore
              </a>
            </li>
            <li>
              <details>
                <summary class="font-medium hover:text-primary">More</summary>
                <ul class="bg-base-100 rounded-t-none p-2 shadow">
                  <li>
                    <a href="/about">About</a>
                  </li>
                  <li>
                    <a href="/Contact">Contact</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>

         <ThemeToggle />

          <div class="dropdown dropdown-end md:hidden">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a>Explore</a>
              </li>
              <li>
                <a>About</a>
              </li>
              <li>
                <a href="/Contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
