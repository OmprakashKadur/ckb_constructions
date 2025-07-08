import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 shadow-md">
      <Link href='/' className="flex items-center">Make Tiny Gains</Link>
      {/* <Link href='/' className="flex items-center">Header</Link> */}
      <div className="flex items-center gap-4">
        <div>Blog</div>
        <div>Themes</div>
        <div>Profile</div>
      </div>
    </div>
  );
};

export default NavBar;
