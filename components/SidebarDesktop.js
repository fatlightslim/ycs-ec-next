import {Logo, Menu, Help} from "./Sidebar"


export default function SidebarDesktop(props) {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="w-64 flex flex-col">
        <nav className="bg-gray-50 border-r border-gray-200 pt-5 pb-4 flex flex-col flex-grow overflow-y-auto">
          <Logo />
          <Menu {...props} />
          {/* <Help /> */}
        </nav>
      </div>
    </div>
  );
}

