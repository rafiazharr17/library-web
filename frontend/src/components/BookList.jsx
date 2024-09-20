import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import AdminSideNavbar from "./AdminSideNavbar";
import UserSideNavbar from "./UserSideNavbar";

const BookList = ({ role, onLogout }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:5000/api/books", {
        headers: { "X-User-Id": userId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SideNavbar = role === "admin" ? AdminSideNavbar : UserSideNavbar;
  const bgGradient =
    role === "admin"
      ? "linear-gradient(135deg, #FFF5F7 0%, #FFF0F5 100%)"
      : "linear-gradient(135deg, #E6FFFA 0%, #E6FFFF 100%)";
  const primaryColor = role === "admin" ? "purple.600" : "teal.600";
  const secondaryColor = role === "admin" ? "pink" : "teal";

  return (
    <Box display="flex" bg={bgGradient} minH="100vh">
      <SideNavbar onLogout={onLogout} />
      <Box flex={1} ml="250px" p={8}>
        <Container maxW="container.xl">
          <Heading
            mb={8}
            color={primaryColor}
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            Magical Book Collection
          </Heading>
          <InputGroup mb={8} maxWidth="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color={`${secondaryColor}.400`} />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for enchanted books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              borderColor={`${secondaryColor}.200`}
              _hover={{ borderColor: `${secondaryColor}.300` }}
              _focus={{
                borderColor: `${secondaryColor}.400`,
                boxShadow: `0 0 0 1px ${secondaryColor}.400`,
              }}
            />
          </InputGroup>
          <Table
            variant="simple"
            bg="white"
            rounded="xl"
            shadow="md"
            borderWidth={2}
            borderColor={`${secondaryColor}.200`}
          >
            <Thead bg={`${secondaryColor}.50`}>
              <Tr>
                <Th color={primaryColor}>No.</Th>
                <Th color={primaryColor}>Title</Th>
                <Th color={primaryColor}>Author</Th>
                <Th color={primaryColor}>Genre</Th>
                <Th color={primaryColor}>Published Year</Th>
                <Th color={primaryColor}>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBooks.map((book, index) => (
                <Tr
                  key={book._id}
                  borderBottomWidth={1}
                  borderColor={`${secondaryColor}.100`}
                >
                  <Td color="gray.700">{index + 1}</Td>
                  <Td color="gray.700">{book.title}</Td>
                  <Td color="gray.700">{book.author}</Td>
                  <Td color="gray.700">{book.genre}</Td>
                  <Td color="gray.700">{book.publishedYear}</Td>
                  <Td>
                    <Badge colorScheme={book.available ? "green" : "red"}>
                      {book.available ? "Available" : "On Adventure"}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {filteredBooks.length === 0 && (
            <Text
              mt={4}
              color={primaryColor}
              fontFamily="'Comic Sans MS', cursive, sans-serif"
            >
              No magical books found. They must be hiding in the Forbidden
              Forest!
            </Text>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default BookList;
