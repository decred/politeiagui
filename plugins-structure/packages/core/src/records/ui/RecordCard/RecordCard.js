import React from "react";
import { Card, H2 } from "pi-ui";
import style from "./style.module.css";

export function RecordCard({ token }) {
  return (
  <Card className={style.card}>
    <div className={style.firstRow}>
      <div className={style.header}>
        <a href={`/records/${token}`} data-link className={style.title}>
          <H2>I am {token}!</H2>
        </a>
        <p className={style.subtitle}>subsubsub</p>
      </div>
      <div>
        placeholder
      </div>
    </div>
    <div className={style.secondRow}>
      placeholder
    </div>
    <div className={style.thirdRow}>
      <div>
        placeholder
      </div>
      <div>
        placeholder
      </div>
    </div>
  </Card>
  );
}
