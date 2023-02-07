import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

const GlobalStyling = createGlobalStyle`
 body {
   margin : 0px;
 }
`;

const App = () => {
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyling />
      <div>Application</div>
    </ThemeProvider>
  );
};

export default App;
