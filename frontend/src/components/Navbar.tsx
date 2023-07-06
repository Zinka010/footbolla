import { HStack, Link, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const userContext = useContext(UserContext);
  const { user, setUser } = userContext;
  const location = useLocation();

  const isHomePage = location.pathname == "/players";

  return (
    <HStack
      minWidth="100%"
      justifyContent="space-between"
      bg="gray.200"
      px={10}
      pt={4}
    >
      <Link onClick={() => history.back()}>
        <HStack>
          {!isHomePage && <ArrowBackIcon />}
          <Text fontWeight={700}>Footbolla</Text>
        </HStack>
      </Link>
      <HStack gap={36}>
        <Link
          href="/players"
          fontWeight={location.pathname == "/players" ? 700 : 400}
        >
          Players
        </Link>
        <Link
          href="/teams"
          fontWeight={location.pathname == "/teams" ? 700 : 400}
        >
          Teams
        </Link>
        <Link
          href="/myTeams"
          fontWeight={location.pathname == "/myTeams" ? 700 : 400}
        >
          My Teams
        </Link>
        <Link
          href="/leagues"
          fontWeight={location.pathname == "/leagues" ? 700 : 400}
        >
          Leagues
        </Link>
      </HStack>
      {user && (
        <HStack spacing={5}>
          <Link
            onClick={() => {
              setUser(null);
              location.pathname = "/";
            }}
          >
            Logout
          </Link>
        </HStack>
      )}
    </HStack>
  );
};

export default Navbar;
