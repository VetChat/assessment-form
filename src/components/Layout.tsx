import React from "react";
import NavigationBar from "./NavigationBar/NavigationBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <header>
        <NavigationBar />
      </header>
      <main>{children}</main>
      {/* <footer>
        <h1>Footer</h1>
      </footer> */}
    </React.Fragment>
  );
};

export default Layout;
