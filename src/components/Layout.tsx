import React from "react";
import NavigationBar from "./NavigationBar/NavigationBar";
import ProgressBar from "./Footer/ProgressBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <header>
        <NavigationBar />
      </header>
      <main className="h-full">{children}</main>
      <footer className="fixed bottom-0 w-full">
        <ProgressBar active={0} />
      </footer>
    </React.Fragment>
  );
};

export default Layout;
