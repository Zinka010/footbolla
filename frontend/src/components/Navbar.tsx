import { HStack, Link, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const userContext = useContext(UserContext);
  const { user } = userContext;
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
      <Link href="/players">
        <HStack>
          {!isHomePage && <ArrowBackIcon />}
          <Text fontWeight={700}>Footbolla</Text>
        </HStack>
      </Link>
      {user && (
        <HStack spacing={5}>
          <Link href="/">Logout</Link>
        </HStack>
      )}
    </HStack>
  );
};

export default Navbar;
