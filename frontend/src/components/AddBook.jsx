import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Switch,
  useToast,
  Container,
  Text,
  Divider,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import AdminSideNavbar from "./AdminSideNavbar";

const AddBook = ({ onLogout }) => {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publishedYear: "",
    genre: "",
    available: true,
  });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Book added successfully:", data);
        toast({
          title: "Book added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setNewBook({
          title: "",
          author: "",
          publishedYear: "",
          genre: "",
          available: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      bg="linear-gradient(135deg, #FFF5F7 0%, #FFF0F5 100%)"
      minH="100vh"
    >
      <AdminSideNavbar onLogout={onLogout} />
      <Box flex={1} ml="250px" p={8}>
        <Container maxW="container.md">
          <Heading
            mb={8}
            color="purple.600"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            Add a New Adventure!
          </Heading>
          <Box
            bg="white"
            p={6}
            rounded="xl"
            shadow="md"
            borderWidth={2}
            borderColor="pink.200"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel color="purple.600">Title</FormLabel>
                  <Input
                    name="title"
                    value={newBook.title}
                    onChange={handleInputChange}
                    placeholder="Enter book title"
                    bg="pink.50"
                    borderColor="pink.200"
                    _hover={{ borderColor: "pink.300" }}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px pink.400",
                    }}
                    color="black"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="purple.600">Author</FormLabel>
                  <Input
                    name="author"
                    value={newBook.author}
                    onChange={handleInputChange}
                    placeholder="Enter author name"
                    bg="pink.50"
                    borderColor="pink.200"
                    _hover={{ borderColor: "pink.300" }}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px pink.400",
                    }}
                    color="black"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="purple.600">Published Year</FormLabel>
                  <Input
                    name="publishedYear"
                    value={newBook.publishedYear}
                    onChange={handleInputChange}
                    placeholder="Enter published year"
                    bg="pink.50"
                    borderColor="pink.200"
                    _hover={{ borderColor: "pink.300" }}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px pink.400",
                    }}
                    color="black"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="purple.600">Genre</FormLabel>
                  <Input
                    name="genre"
                    value={newBook.genre}
                    onChange={handleInputChange}
                    placeholder="Enter book genre"
                    bg="pink.50"
                    borderColor="pink.200"
                    _hover={{ borderColor: "pink.300" }}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px pink.400",
                    }}
                    color="black"
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="available" mb="0" color="purple.600">
                    Available
                  </FormLabel>
                  <Switch
                    id="available"
                    name="available"
                    isChecked={newBook.available}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: "available", value: e.target.checked },
                      })
                    }
                    colorScheme="green"
                    size="lg"
                  />
                </FormControl>
                <Button
                  type="submit"
                  bg="purple.500"
                  color="white"
                  size="lg"
                  fontSize="md"
                  leftIcon={<AddIcon />}
                  _hover={{
                    bg: "purple.600",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  fontFamily="'Comic Sans MS', cursive, sans-serif"
                >
                  Add Magic to the Library!
                </Button>
              </VStack>
            </form>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AddBook;
