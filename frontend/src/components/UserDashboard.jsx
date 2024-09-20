import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import UserSideNavbar from "./UserSideNavbar";
import { FaBook } from "react-icons/fa";

const UserDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [borrowedBooks, setBorrowedBooks] = useState(0);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:5000/api/loans", {
      headers: { "X-User-Id": userId },
    });
    const loans = await response.json();
    setBorrowedBooks(loans.length);
  };

  return (
    <Flex bg="linear-gradient(135deg, #E6FFFA 0%, #E6FFFF 100%)" minH="100vh">
      <UserSideNavbar onLogout={onLogout} />
      <Box flex={1} ml="250px" p={8}>
        <Heading
          mb={6}
          color="teal.600"
          fontFamily="'Comic Sans MS', cursive, sans-serif"
        >
          Your Reading Adventure
        </Heading>
        <Text mb={4} color="teal.500">
          Welcome to your magical dashboard!
        </Text>
        <SimpleGrid columns={1} spacing={10} mb={8}>
          <Stat
            px={{ base: 4, md: 8 }}
            py="5"
            shadow="xl"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            bg="white"
          >
            <StatLabel fontWeight="medium" color="gray.600">
              Borrowed Books
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="medium" color="blue.500">
              {borrowedBooks}
            </StatNumber>
            <StatHelpText color="gray.600">
              <Icon as={FaBook} mr={2} />
              Currently borrowed
            </StatHelpText>
          </Stat>
        </SimpleGrid>
        <Button
          onClick={() => navigate("/borrow-book")}
          colorScheme="teal"
          fontFamily="'Comic Sans MS', cursive, sans-serif"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
        >
          Start a New Adventure!
        </Button>
      </Box>
    </Flex>
  );
};

export default UserDashboard;
