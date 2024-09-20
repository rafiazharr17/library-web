import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Container,
  Text,
  Flex,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from "@chakra-ui/react";
import AdminSideNavbar from "./AdminSideNavbar";
import {
  FaBook,
  FaCheckCircle,
  FaTimesCircle,
  FaHandHolding,
} from "react-icons/fa";

const AdminDashboard = ({ onLogout }) => {
  const [bookStats, setBookStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    borrowed: 0,
  });

  useEffect(() => {
    fetchBookStats();
  }, []);

  const fetchBookStats = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:5000/api/books", {
      headers: { "X-User-Id": userId },
    });
    const books = await response.json();
    const loanResponse = await fetch("http://localhost:5000/api/loans/all", {
      headers: { "X-User-Id": userId },
    });
    const loans = await loanResponse.json();
    const stats = {
      total: books.length,
      available: books.filter((book) => book.available).length,
      unavailable: books.filter((book) => !book.available).length,
      borrowed: loans.length,
    };
    setBookStats(stats);
  };

  const StatCard = ({ label, value, icon, helpText, accentColor }) => {
    return (
      <Stat
        px={{ base: 4, md: 6 }}
        py="5"
        shadow="xl"
        border="1px solid"
        borderColor="gray.200"
        rounded="lg"
        bg="white"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <StatLabel fontWeight="medium" isTruncated color="gray.600">
              {label}
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="medium" color={accentColor}>
              {value}
            </StatNumber>
          </Box>
          <Box my="auto" color={accentColor} alignContent="center">
            <Icon as={icon} w={6} h={6} />
          </Box>
        </Flex>
        <StatHelpText color="gray.600">{helpText}</StatHelpText>
      </Stat>
    );
  };

  return (
    <Box
      display="flex"
      bg="linear-gradient(135deg, #FFF5F7 0%, #FFF0F5 100%)"
      minH="100vh"
    >
      <AdminSideNavbar onLogout={onLogout} />
      <Box flex={1} ml="250px" p={8}>
        <Container maxW="container.xl">
          <Heading
            mb={8}
            color="purple.600"
            fontSize="3xl"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            Library Command Center
          </Heading>
          <Text fontSize="lg" mb={8} color="purple.500">
            Welcome to your magical dashboard. Here's an overview of your
            enchanted library:
          </Text>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            <StatCard
              label="Total Books"
              value={bookStats.total}
              icon={FaBook}
              helpText="In the library"
              accentColor="blue.500"
            />
            <StatCard
              label="Available Books"
              value={bookStats.available}
              icon={FaCheckCircle}
              helpText="Ready for borrowing"
              accentColor="green.500"
            />
            <StatCard
              label="Unavailable Books"
              value={bookStats.unavailable}
              icon={FaTimesCircle}
              helpText="Not available"
              accentColor="red.500"
            />
            <StatCard
              label="Borrowed Books"
              value={bookStats.borrowed}
              icon={FaHandHolding}
              helpText="Currently borrowed"
              accentColor="purple.500"
            />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
