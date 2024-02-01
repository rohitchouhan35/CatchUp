import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catchup from "./pages/Catchup";
import "./App.css";
import Lobby from "./components/Lobby";
import PrivateChatBox from "./components/PrivateChatBox";
import WebRTCComponent from "./components/WebRTCComponent";
import VideoChat from "./components/VideoChat";
import CatchUpMediaFeed from "./components/CatchupMediaFeed";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/catchup" element={<Catchup />} />
          <Route path="/" element={<Catchup />} />
          <Route path="/chat" element={<PrivateChatBox />} />
          <Route path="/wrtc" element={<WebRTCComponent />} />
          <Route path="/vc" element={<VideoChat />} />
          <Route path="/feed" element={<CatchUpMediaFeed />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
