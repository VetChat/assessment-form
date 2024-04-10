import React from "react";
import NavigationBar from "./NavigationBar/NavigationBar";
import ProgressBar from "./Footer/ProgressBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen relative">
      <div className="h-full w-full">
        <NavigationBar />
        {children}
        <footer>{/* <ProgressBar active={0}></ProgressBar> */}</footer>
      </div>
    </div>
  );
};

export default Layout;
