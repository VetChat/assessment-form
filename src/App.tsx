import "./App.css";
import Layout from "./components/Layout";
import Router from "./routes/Router";

function App() {
  return (
    <div className="h-full w-full fixed p-0 m-0 top-0 left-0 bg-white">
      <Layout>
        <Router />
      </Layout>
    </div>
  );
}

export default App;
