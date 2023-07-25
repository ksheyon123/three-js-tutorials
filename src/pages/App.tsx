import React from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";

const GlobalStyling = createGlobalStyle`
  * {
    box-sizing  : content-box;
  }
  body {
    margin : 0px;
  }
`;

const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={{}}>
        <GlobalStyling />
        <div>Application</div>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
