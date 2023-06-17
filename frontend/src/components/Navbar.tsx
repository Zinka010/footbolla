import { HStack, Heading, Link, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface NavbarProps {
  homePage: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ homePage }) => {
  return (
    <HStack
      minWidth="100%"
      justifyContent="space-between"
      bg="gray.200"
      px={10}
      pt={4}
    >
      <Link>
        <HStack>
          {!homePage && <ArrowBackIcon />}
          <Text>Home</Text>
        </HStack>
      </Link>
      <Heading size="md">Footfiend</Heading>
    </HStack>
  );
};

export default Navbar;
