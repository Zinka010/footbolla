import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PlayerList from "./pages/PlayerList";
import PlayerPage from "./pages/Player";
import "./App.css";
import UserTeam from "./pages/UserTeam";
import UserTeamList from "./pages/UserTeamList";
import { useContext } from "react";
import { UserContext } from "./contexts/userContext";
import TeamList from "./pages/TeamList";
import Team from "./pages/Team";
import CompareUserTeams from "./pages/CompareUserTeams"
import Roster from "./pages/Roster";
import LeagueList from "./pages/LeagueList";

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const userContext = useContext(UserContext);
  const isAuthenticated = userContext.user !== null;

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route
        path="/players"
        element={
          <RequireAuth>
            <PlayerList />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/teams"
        element={
          <RequireAuth>
            <TeamList />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/team/:teamId"
        element={
          <RequireAuth>
            <Team />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/roster/:teamId"
        element={
          <RequireAuth>
            <Roster />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/player/:playerId"
        element={
          <RequireAuth>
            <PlayerPage />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/myTeams/:teamId"
        element={
          <RequireAuth>
            <UserTeam />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/myTeams"
        element={
          <RequireAuth>
            <UserTeamList />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/leagues"
        element={
          <RequireAuth>
            <LeagueList />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/predictWinner"
        element={
          <RequireAuth>
            <CompareUserTeams />
          </RequireAuth>
        }
      ></Route>
    </Routes>
  );
};

export default App;
