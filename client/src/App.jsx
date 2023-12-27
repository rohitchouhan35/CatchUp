import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catchup from "./pages/Catchup";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/catchup" element={<Catchup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
