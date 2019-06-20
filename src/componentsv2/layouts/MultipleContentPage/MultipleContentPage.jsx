import React from "react";
import { TopBanner, Main, PageDetails, SideBanner, H1, Container } from "pi-ui";
import Header from "src/containers/Header/Header";
import Sidebar from "../../Sidebar";

const Title = props => <H1 className="margin-top-l" {...props} />;

const MultipleContentpage = ({ children }) => {
  return (
    <Container>
      <Header noBorder />
      {children({
        Sidebar,
        TopBanner,
        SideBanner,
        Main,
        PageDetails,
        Title
      })}
    </Container>
  );
};

export default MultipleContentpage;
