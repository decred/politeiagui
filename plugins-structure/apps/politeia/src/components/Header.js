import React from "react";

function Header() {
  return (
    <nav>
      <a href="/" data-link>Records</a>
      <a href="/statistics" data-link>Statistics</a>
      <a href="/my-app-shell" data-link>My App Shell</a>
      <a href="/ticketvote" data-link>Ticketvote</a>
    </nav>
  )
}

export default Header;