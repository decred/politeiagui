import { h } from "preact";
import { Link } from "preact-router/match";
import style from "./style";
import Login from "../Login";

const Header = () => (
  <header class={style.header}>
    <h1>
      <Link href='/'>
        <img {...{
          alt: "decred",
          src: "https://www.decred.org/content/images/logo.svg",
          height: 32
        }} />
      </Link>
    </h1>
    <nav>
      <Link activeClassName={style.active} href='/'>Home</Link>
      <Link activeClassName={style.active} href='/proposals/vetted'>Proposals</Link>
      <Link activeClassName={style.active} href='/proposals/new'>Submit</Link>
    </nav>
    <Login />
  </header>
);

export default Header;
