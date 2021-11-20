import React, { useEffect, useState } from "react";
import App from "./App";
//import Dashboard from "./Dashboard";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";

function Root() {
  const isApp = (): boolean => {
    return window.location.host.includes("app");
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokenPrices().then(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const app = () => (
    <HashRouter>
      <App />
    </HashRouter>
  );

  return isApp() ? (
    app()
  ) : (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

export default Root;
