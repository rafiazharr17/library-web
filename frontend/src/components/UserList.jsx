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
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Badge,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import AdminSideNavbar from "./AdminSideNavbar";

const UserList = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          "X-User-Id": userId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Magical User List
          </Heading>
          <InputGroup mb={8} size="md" maxWidth="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="purple.400" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for wizards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              borderColor="pink.200"
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
            <Table variant="simple">
              <Thead bg="pink.50">
                <Tr>
                  <Th color="purple.600">No.</Th>
                  <Th color="purple.600">Username</Th>
                  <Th color="purple.600">Role</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user, index) => (
                  <Tr
                    key={user._id}
                    borderBottomWidth={1}
                    borderColor="pink.100"
                  >
                    <Td color="gray.700">{index + 1}</Td>
                    <Td color="gray.700" fontWeight="medium">
                      {user.username}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={user.role === "admin" ? "purple" : "teal"}
                        borderRadius="full"
                        px={2}
                      >
                        {user.role}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          {filteredUsers.length === 0 && (
            <Text
              mt={4}
              color="purple.600"
              fontFamily="'Comic Sans MS', cursive, sans-serif"
            >
              No magical users found. They must be invisible!
            </Text>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default UserList;
