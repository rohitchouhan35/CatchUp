import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catchup from "./pages/Catchup";
import "./App.css";
import Lobby from "./components/Lobby";
import PrivateChatBox from "./components/PrivateChatBox";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/catchup" element={<Catchup />} />
          <Route path="/" element={<Lobby />} />
          <Route path="/chat" element={<PrivateChatBox />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
