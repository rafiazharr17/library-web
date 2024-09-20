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
} from "@chakra-ui/react";
import UserSideNavbar from "./UserSideNavbar";

const MyBorrowedBooks = ({ onLogout }) => {
  const [loans, setLoans] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:5000/api/loans", {
      headers: { "X-User-Id": userId },
    });
    const data = await response.json();
    setLoans(data);
  };

  const handleReturn = async (loanId) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:5000/api/loans/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify({ loanId }),
      });
      if (response.ok) {
        toast({
          title: "Book returned successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchLoans();
      } else {
        throw new Error("Failed to return book");
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
            My Magical Book Collection
          </Heading>
          <Table
            variant="simple"
            bg="white"
            rounded="xl"
            shadow="md"
            borderWidth={2}
            borderColor="teal.200"
          >
            <Thead bg="teal.50">
              <Tr>
                <Th color="teal.600">No.</Th>
                <Th color="teal.600">Book Title</Th>
                <Th color="teal.600">Borrow Date</Th>
                <Th color="teal.600">Return Date</Th>
                <Th color="teal.600">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loans.map((loan, index) => (
                <Tr key={loan._id} borderBottomWidth={1} borderColor="teal.100">
                  <Td color="gray.700">{index + 1}</Td>
                  <Td color="gray.700">{loan.book.title}</Td>
                  <Td color="gray.700">
                    {new Date(loan.loanDate).toLocaleDateString()}
                  </Td>
                  <Td color="gray.700">
                    {loan.returnDate
                      ? new Date(loan.returnDate).toLocaleDateString()
                      : "Not returned"}
                  </Td>
                  <Td>
                    {!loan.returnDate && (
                      <Button
                        colorScheme="teal"
                        onClick={() => handleReturn(loan._id)}
                        fontFamily="'Comic Sans MS', cursive, sans-serif"
                      >
                        Return the Magic
                      </Button>
                    )}
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

export default MyBorrowedBooks;
