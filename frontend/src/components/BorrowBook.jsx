import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Container,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import UserSideNavbar from "./UserSideNavbar";

const BorrowBook = ({ onLogout }) => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchAvailableBooks();
  }, []);

  const fetchAvailableBooks = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:5000/api/books", {
      headers: { "X-User-Id": userId },
    });
    const books = await response.json();
    setAvailableBooks(books.filter((book) => book.available));
  };

  const handleBorrow = async (bookId) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:5000/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify({ bookId }),
      });
      if (response.ok) {
        toast({
          title: "Book borrowed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchAvailableBooks();
      } else {
        throw new Error("Failed to borrow book");
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredBooks = availableBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      display="flex"
      bg="linear-gradient(135deg, #E6FFFA 0%, #E6FFFF 100%)"
      minH="100vh"
    >
      <UserSideNavbar onLogout={onLogout} />
      <Box flex={1} ml="250px" p={8}>
        <Container maxW="container.xl">
          <Heading
            mb={8}
            color="teal.600"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            Borrow a Book Adventure!
          </Heading>
          <InputGroup mb={8} maxWidth="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="teal.400" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for magic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              borderColor="teal.200"
              _hover={{ borderColor: "teal.300" }}
              _focus={{
                borderColor: "teal.400",
                boxShadow: "0 0 0 1px teal.400",
              }}
            />
          </InputGroup>
          <Table
            variant="simple"
            bg="white"
            rounded="xl"
            shadow="md"
            borderWidth={2}
            borderColor="teal.100"
          >
            <Thead bg="gray.50">
              <Tr>
                <Th color="black">No.</Th>
                <Th color="black">Title</Th>
                <Th color="black">Author</Th>
                <Th color="black">Genre</Th>
                <Th color="black">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBooks.map((book, index) => (
                <Tr key={book._id} borderBottomWidth={1} borderColor="gray.200">
                  <Td color="black">{index + 1}</Td>
                  <Td color="black">{book.title}</Td>
                  <Td color="black">{book.author}</Td>
                  <Td color="black">{book.genre}</Td>
                  <Td>
                    <Button
                      bg="teal.400"
                      color="white"
                      _hover={{
                        bg: "teal.500",
                        transform: "translateY(-2px)",
                        boxShadow: "md",
                      }}
                      onClick={() => handleBorrow(book._id)}
                      fontFamily="'Comic Sans MS', cursive, sans-serif"
                    >
                      Borrow Me!
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {filteredBooks.length === 0 && (
            <Text mt={4} color="black">
              No books found.
            </Text>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default BorrowBook;
