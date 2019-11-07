import React from "react";
import { useConfig } from "src/containers/Config";

const Logo = () => {
  const { logoAsset } = useConfig();
  return (
    <img
      role="presentation"
      alt="logo"
      src={require(`src/assets/${logoAsset}`)}
    />
  );
};

export default Logo;
