import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catchup from "./pages/Catchup";
import "./App.css";
import CatchUpMediaFeed from "./components/CatchupMediaFeed";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Catchup />} />
          <Route path="/feed" element={<CatchUpMediaFeed />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
