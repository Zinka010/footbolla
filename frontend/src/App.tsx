import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PlayerList from "./pages/PlayerList";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/players" element={<PlayerList />}></Route>
      <Route path="/player/:playerId"></Route>
    </Routes>
  );
};

export default App;
