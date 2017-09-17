import { h } from "preact";
import { Link } from "preact-router/match";
import style from "./style";
import Login from "../Login";

const Header = () => (
  <header class={style.header}>
    <h1>Preact App</h1>
    <nav>
      <Link activeClassName={style.active} href='/'>Home</Link>
      <Link activeClassName={style.active} href='/profile'>Me</Link>
      <Link activeClassName={style.active} href='/profile/john'>John</Link>
      <Login />
    </nav>
  </header>
);

export default Header;
