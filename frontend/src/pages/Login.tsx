import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { login } from "../util/API";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser } = useContext(UserContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await login(username, password);

    if (!response.success) {
      toast({
        colorScheme: "red",
        title: response.message,
        position: "top",
      });
    } else {
      toast({
        colorScheme: "green",
        title: "Login successful",
        position: "top",
        isClosable: true,
      });
      setUser(response.user);
      navigate("/players");
    }
  };
  return (
    <Center minWidth="100%" minHeight="100vh" bg="gray.200" textAlign="left">
      <Box
        w="500px"
        bgColor={"white"}
        rounded={"3xl"}
        padding={10}
        textAlign={"left"}
      >
        <VStack align={"left"} gap={4}>
          <Heading size="3xl">Footbolla</Heading>
          <Heading size="lg">Log In</Heading>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <HStack mt={2}>
              <Text>Don't have an account?</Text>
              <Link fontWeight={600} href="/signup">
                Sign up here.
              </Link>
            </HStack>
            <Button mt="6" bg="blue.200" onClick={() => handleLogin()}>
              Login
            </Button>
          </FormControl>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
