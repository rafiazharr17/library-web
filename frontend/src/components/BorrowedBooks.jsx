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
  Container,
} from "@chakra-ui/react";
import AdminSideNavbar from "./AdminSideNavbar";

const BorrowedBooks = ({ onLogout }) => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:5000/api/loans/all", {
      headers: { "X-User-Id": userId },
    });
    const data = await response.json();
    setLoans(data);
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
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            Magical Books on Adventure
          </Heading>
          <Table
            variant="simple"
            bg="white"
            rounded="xl"
            shadow="md"
            borderWidth={2}
            borderColor="pink.200"
          >
            <Thead bg="pink.50">
              <Tr>
                <Th color="purple.600">No.</Th>
                <Th color="purple.600">Book Title</Th>
                <Th color="purple.600">Borrowed By</Th>
                <Th color="purple.600">Borrow Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loans.map((loan, index) => (
                <Tr key={loan._id} borderBottomWidth={1} borderColor="pink.100">
                  <Td color="gray.700">{index + 1}</Td>
                  <Td color="gray.700">{loan.book.title}</Td>
                  <Td color="gray.700">{loan.user.username}</Td>
                  <Td color="gray.700">
                    {new Date(loan.loanDate).toLocaleDateString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Box>
    </Box>
  );
};

export default BorrowedBooks;
