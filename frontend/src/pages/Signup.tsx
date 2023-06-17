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
} from "@chakra-ui/react";
import { useState } from "react";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
          <Heading size="3xl">Footfiend</Heading>
          <Heading size="lg">Sign Up</Heading>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input type="text"></Input>
            <FormLabel>Email</FormLabel>
            <Input type="email"></Input>
            <FormLabel>Confirm Email</FormLabel>
            <Input type="email"></Input>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? "text" : "password"}></Input>
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
            <FormLabel>Confirm Password</FormLabel>
            <Input type="password"></Input>
            <HStack mt={2}>
              <Text>Already have an account?</Text>
              <Link fontWeight={600} href="/">
                Login here.
              </Link>
            </HStack>
            <Button mt="6" bg="blue.200">
              Sign Up
            </Button>
          </FormControl>
        </VStack>
      </Box>
    </Center>
  );
};

export default Signup;
