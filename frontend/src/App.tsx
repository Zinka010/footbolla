import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PlayerList from "./pages/PlayerList";
import PlayerPage from "./pages/Player";
import "./App.css";
import UserTeam from "./pages/UserTeam";
import UserTeamList from "./pages/UserTeamList";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/players" element={<PlayerList />}></Route>
      <Route path="/player/:playerId" element={<PlayerPage />}></Route>
      <Route path="/myTeams/:teamId" element={<UserTeam />}></Route>
      <Route path="/myTeams" element={<UserTeamList />}></Route>
    </Routes>
  );
};

export default App;
