import { useEffect, useState } from "react";
import "@/App.css";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";

function App() {
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
  }, [dark]);

  return (
    <div className="App">
      {activeDashboard ? (
        <Dashboard
          dashboardId={activeDashboard}
          onBack={() => setActiveDashboard(null)}
          dark={dark}
          setDark={setDark}
        />
      ) : (
        <Landing
          onOpen={(id) => setActiveDashboard(id)}
          dark={dark}
          setDark={setDark}
        />
      )}
    </div>
  );
}

export default App;
