import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Table from "./pages/Table";
import Workspace from "./pages/Workspace";
import Cookies from "js-cookie";
function App() {
  const AppRoutes = () => {
    let navigate = useNavigate();

    useEffect(() => {
      const trelloToken = Cookies.get("trello_token");
      if (trelloToken === undefined) {
        navigate("/");
      }
    }, [navigate]);

    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table" element={<Table />} />
        <Route path="/workspace" element={<Workspace/>}/>
      </Routes>
    );
  };

  return (
    <div className="App">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
