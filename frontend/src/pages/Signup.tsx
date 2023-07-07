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
import { useState } from "react";
import { signUp } from "../util/API";
import { useNavigate } from "react-router-dom";

interface SignupForm {
  username: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignup = async () => {
    const isEmailConfirmed = signupForm.confirmEmail === signupForm.email;
    const isPasswordConfirmed =
      signupForm.password === signupForm.confirmPassword;

    const errors = [];

    for (const [key, value] of Object.entries(signupForm)) {
      if (value.trim() == "") {
        errors.push(`${key.toUpperCase()} must not be empty.`);
      }
    }

    if (!isEmailConfirmed) errors.push("Emails don't match.");
    if (!isPasswordConfirmed) errors.push("Passwords don't match.");
    if (errors.length) {
      toast({
        colorScheme: "red",
        position: "top",
        title: "Sign Up Errors",
        description: (
          <>
            {errors.map((error) => (
              <p>{error}</p>
            ))}
          </>
        ),
      });
    } else {
      const response = await signUp(
        signupForm.username,
        signupForm.password,
        signupForm.email
      );

      toast({
        colorScheme: response.success ? "green" : "red",
        title: response.message,
        position: "top",
      });

      if (response.success) {
        return navigate("/");
      }
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
          <Heading size="lg">Sign Up</Heading>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={signupForm.username}
              onChange={(e) =>
                setSignupForm({ ...signupForm, username: e.target.value })
              }
            ></Input>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={signupForm.email}
              onChange={(e) =>
                setSignupForm({ ...signupForm, email: e.target.value })
              }
            ></Input>
            <FormLabel>Confirm Email</FormLabel>
            <Input
              type="email"
              value={signupForm.confirmEmail}
              onChange={(e) =>
                setSignupForm({ ...signupForm, confirmEmail: e.target.value })
              }
            ></Input>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={signupForm.password}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, password: e.target.value })
                }
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
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={signupForm.confirmPassword}
              onChange={(e) =>
                setSignupForm({
                  ...signupForm,
                  confirmPassword: e.target.value,
                })
              }
            ></Input>
            <HStack mt={2}>
              <Text>Already have an account?</Text>
              <Link fontWeight={600} href="/">
                Login here.
              </Link>
            </HStack>
            <Button mt="6" bg="blue.200" onClick={handleSignup}>
              Sign Up
            </Button>
          </FormControl>
        </VStack>
      </Box>
    </Center>
  );
};

export default Signup;
