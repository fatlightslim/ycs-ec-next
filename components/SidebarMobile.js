import Link from "next/link";
import { useState, useEffect } from "react"
import { Logo, Menu, Help } from "./Sidebar";

export default function SidebarMobile(props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-40 flex">
        {/* Off-canvas menu overlay, show/hide based on off-canvas menu state.
      Entering: "transition-opacity ease-linear duration-300" From: "opacity-0"
      To: "opacity-100" Leaving: "transition-opacity ease-linear duration-300"
      From: "opacity-100" To: "opacity-0" */}
        <div className={`fixed inset-0 ${open ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
        {/* Off-canvas menu, show/hide based on off-canvas menu state. Entering:
      "transition ease-in-out duration-300 transform" From: "-translate-x-full"
      To: "translate-x-0" Leaving: "transition ease-in-out duration-300
      transform" From: "translate-x-0" To: "-translate-x-full" */}
        <div className={`relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col transition ease-in-out duration-300 transform ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="absolute top-0 right-0 -mr-14 p-1">
            <button
              onClick={() => setOpen(false)}
              className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:bg-gray-600"
            >
              <Close />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>
          <nav className="bg-gray-50 border-r border-gray-200 pt-5 pb-4 flex flex-col flex-grow overflow-y-auto">
            <Logo />
            <Menu {...props} />
            {/* <Help /> */}
          </nav>
        </div>
      </div>
      <div className="flex-shrink-0 w-14" aria-hidden="true">
        {/* Dummy element to force sidebar to shrink to fit close icon */}
      </div>
    </div>
  );
}

const Close = () => (
  <svg
    className="h-6 w-6 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="{2}"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
