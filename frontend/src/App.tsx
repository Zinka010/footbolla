import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/players"></Route>
      <Route path="/player/:playerId"></Route>
    </Routes>
  );
};

export default App;
