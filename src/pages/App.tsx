import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/common/Header/Header";
import { Layout } from "@/components/common/Layout/Layout";

const App: React.FC = () => {
  return (
    <Layout>
      <span>App Page</span>
      {/* <Header /> */}
      <Outlet />
    </Layout>
  );
};

export default App;
