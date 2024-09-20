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
  Badge,
  IconButton,
  HStack,
  Container,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useColorModeValue,
  VStack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Flex,
  Text,
  TableContainer,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, SearchIcon, CloseIcon } from "@chakra-ui/icons";
import AdminSideNavbar from "./AdminSideNavbar";

const ManageBooks = ({ onLogout }) => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:5000/api/books", {
        headers: {
          "X-User-Id": userId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast({
        title: "Error fetching books",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "DELETE",
        headers: {
          "X-User-Id": userId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete book");
      }
      fetchBooks();
      toast({
        title: "Book deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:5000/api/books/${editingBook._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
          },
          body: JSON.stringify(editingBook),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update book");
      }
      fetchBooks();
      setIsModalOpen(false);
      toast({
        title: "Book updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating book:", error);
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBook({ ...editingBook, [name]: value });
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bgColor = "gray.100";
  const headerBgColor = "gray.50";
  const borderColor = "gray.200";

  return (
    <Flex
      bg="linear-gradient(135deg, #FFF5F7 0%, #FFF0F5 100%)"
      minH="100vh"
      flexDirection={{ base: "column", md: "row" }}
    >
      <AdminSideNavbar onLogout={onLogout} />
      <Box
        flex={1}
        p={4}
        ml={{ base: 0, md: "250px" }}
        mt={{ base: "60px", md: 0 }}
      >
        <Container maxW="full">
          <Heading
            mb={8}
            color="purple.600"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            Manage Magical Books
          </Heading>
          <InputGroup mb={8} size="md" maxWidth="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="purple.400" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for spellbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              borderColor="pink.200"
              color="black"
              _hover={{ borderColor: "pink.300" }}
              _focus={{
                borderColor: "pink.400",
                boxShadow: "0 0 0 1px pink.400",
              }}
            />
            {searchTerm && (
              <InputRightElement>
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  variant="ghost"
                  colorScheme="pink"
                />
              </InputRightElement>
            )}
          </InputGroup>
          <Box
            bg="white"
            rounded="xl"
            shadow="md"
            overflow="hidden"
            borderWidth={2}
            borderColor="pink.200"
          >
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead bg="pink.50">
                  <Tr>
                    <Th color="purple.600">No.</Th>
                    <Th color="purple.600">Title</Th>
                    <Th
                      color="purple.600"
                      display={{ base: "none", md: "table-cell" }}
                    >
                      Author
                    </Th>
                    <Th
                      color="purple.600"
                      display={{ base: "none", lg: "table-cell" }}
                    >
                      Year
                    </Th>
                    <Th
                      color="purple.600"
                      display={{ base: "none", lg: "table-cell" }}
                    >
                      Genre
                    </Th>
                    <Th color="purple.600">Status</Th>
                    <Th color="purple.600">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredBooks.map((book, index) => (
                    <Tr
                      key={book._id}
                      borderBottomWidth={1}
                      borderColor="pink.100"
                    >
                      <Td color="gray.700">{index + 1}</Td>
                      <Td color="gray.700" fontWeight="medium">
                        {book.title}
                      </Td>
                      <Td
                        color="gray.700"
                        display={{ base: "none", md: "table-cell" }}
                      >
                        {book.author}
                      </Td>
                      <Td
                        color="gray.700"
                        display={{ base: "none", lg: "table-cell" }}
                      >
                        {book.publishedYear}
                      </Td>
                      <Td display={{ base: "none", lg: "table-cell" }}>
                        <Badge colorScheme="purple" borderRadius="full" px={2}>
                          {book.genre}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={book.available ? "green" : "red"}
                          borderRadius="full"
                          px={2}
                        >
                          {book.available ? "Available" : "Not Available"}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<EditIcon />}
                            onClick={() => handleEdit(book)}
                            aria-label="Edit book"
                            size="sm"
                            colorScheme="purple"
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            onClick={() => handleDelete(book._id)}
                            aria-label="Delete book"
                            size="sm"
                            colorScheme="red"
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          {filteredBooks.length === 0 && (
            <Text mt={4} color="purple.600">
              No magical books found. Time to write some new spells!
            </Text>
          )}
        </Container>
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent
          bg="white"
          borderRadius="xl"
          borderWidth={2}
          borderColor="pink.200"
        >
          <ModalHeader
            color="purple.600"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            Edit Magical Book
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleEditSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel color="purple.600">Title</FormLabel>
                  <Input
                    name="title"
                    value={editingBook?.title || ""}
                    onChange={handleInputChange}
                    bg="pink.50"
                    borderColor="pink.200"
                    color="black"
                    _hover={{ borderColor: "pink.300" }}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px pink.400",
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="purple.600">Author</FormLabel>
                  <Input
                    name="author"
                    value={editingBook?.author || ""}
                    onChange={handleInputChange}
                    bg="pink.50"
                    borderColor="pink.200"
                    color="black"
                    _hover={{ borderColor: "pink.300" }}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px pink.400",
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="purple.600">Published Year</FormLabel>
                  <Input
                    name="publishedYear"
                    value={editingBook?.publishedYear || ""}
                    onChange={handleInputChange}
                    bg="pink.50"
                    borderColor="pink.200"
                    color="black"
                    _hover={{ borderColor: "pink.300" }}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px pink.400",
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="purple.600">Genre</FormLabel>
                  <Input
                    name="genre"
                    value={editingBook?.genre || ""}
                    onChange={handleInputChange}
                    bg="pink.50"
                    borderColor="pink.200"
                    color="black"
                    _hover={{ borderColor: "pink.300" }}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px pink.400",
                    }}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" color="purple.600">
                    Available
                  </FormLabel>
                  <Switch
                    name="available"
                    isChecked={editingBook?.available}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        available: e.target.checked,
                      })
                    }
                    colorScheme="purple"
                  />
                </FormControl>
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              mr={3}
              onClick={handleEditSubmit}
              fontFamily="'Comic Sans MS', cursive, sans-serif"
              size="lg"
              fontWeight="bold"
              px={8}
              py={6}
              fontSize="xl"
              borderRadius="full"
              boxShadow="0 4px 8px rgba(160, 32, 240, 0.5)"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 6px 12px rgba(160, 32, 240, 0.6)",
              }}
              _active={{
                transform: "translateY(0)",
                boxShadow: "0 2px 4px rgba(160, 32, 240, 0.4)",
              }}
            >
              ✨ Save Magical Changes ✨
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              fontFamily="'Comic Sans MS', cursive, sans-serif"
            >
              Cancel Spell
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ManageBooks;
