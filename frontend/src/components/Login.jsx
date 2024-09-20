import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Flex,
  Container,
  Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = ({ setToken, setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { username, password });
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log("Login response:", data);
      if (response.ok) {
        setToken(data.userId);
        setRole(data.role);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userRole", data.role);
        toast({
          title: "Login successful",
          description: "Welcome back!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(135deg, #E6FFFA 0%, #FFF0F5 100%)"
    >
      <Container maxW="lg" py={12} px={6}>
        <Box
          bg="white"
          py={8}
          px={10}
          shadow="xl"
          rounded="xl"
          borderWidth={1}
          borderColor="teal.100"
        >
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Image
                src="/library-logo.jpg"
                alt="Library Logo"
                mx="auto"
                mb={4}
                boxSize="80px"
                borderRadius="full"
                objectFit="cover"
                border="3px solid"
                borderColor="teal.300"
              />
              <Heading
                size="xl"
                fontWeight="extrabold"
                color="teal.600"
                fontFamily="'Comic Sans MS', cursive, sans-serif"
              >
                Welcome to Book Buddies!
              </Heading>
              <Text fontSize="lg" color="gray.600" mt={2}>
                Log in to start your reading adventure
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold" color="teal.700">
                    Username
                  </FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    size="lg"
                    bg="teal.50"
                    border="2px"
                    borderColor="teal.200"
                    _hover={{
                      borderColor: "teal.300",
                    }}
                    _focus={{
                      borderColor: "teal.400",
                      boxShadow: "0 0 0 1px teal.400",
                    }}
                    color="teal.800"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold" color="teal.700">
                    Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      bg="teal.50"
                      border="2px"
                      borderColor="teal.200"
                      _hover={{
                        borderColor: "teal.300",
                      }}
                      _focus={{
                        borderColor: "teal.400",
                        boxShadow: "0 0 0 1px teal.400",
                      }}
                      color="teal.800"
                    />
                    <InputRightElement>
                      <IconButton
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        color="teal.600"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  bg="teal.400"
                  color="white"
                  size="lg"
                  fontSize="md"
                  width="full"
                  mt={4}
                  _hover={{
                    bg: "teal.500",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  fontFamily="'Comic Sans MS', cursive, sans-serif"
                >
                  Let's Read!
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
};

export default Login;
