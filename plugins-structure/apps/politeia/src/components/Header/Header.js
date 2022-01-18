import React from "react";
import styles from "./styles.module.css";

function Header() {
  return (
    <nav className={styles.header}>
      <a href="/" data-link>Records</a>
      <a href="/statistics" data-link>Statistics</a>
      <a href="/my-app-shell" data-link>My App Shell</a>
      <a href="/ticketvote" data-link>Ticketvote</a>
    </nav>
  )
}

export default Header;