import { h } from "preact";
import style from "./style";

const ErrorPage = (error) => (
  <div class={style.errorPage}>
    <h3>Error</h3>
    <pre>{JSON.stringify(error, null, 2)}</pre>
  </div>
);

export default ErrorPage;
