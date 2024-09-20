import React from "react";
import {
  Box,
  VStack,
  Button,
  Heading,
  Divider,
  Icon,
  Text,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaUserCog,
  FaPlus,
  FaUsers,
  FaSignOutAlt,
  FaHandHolding,
} from "react-icons/fa";

const NavItem = ({ icon, children, to, isActive }) => {
  return (
    <Button
      as={Link}
      to={to}
      variant="ghost"
      justifyContent="flex-start"
      alignItems="center"
      pl={6}
      py={3}
      mb={2}
      borderRadius="full"
      bg={isActive ? "pink.100" : "transparent"}
      color={isActive ? "purple.600" : "gray.600"}
      _hover={{ bg: "pink.50", color: "purple.500" }}
      leftIcon={<Icon as={icon} boxSize={5} mr={4} />}
      transition="all 0.2s"
    >
      <Text fontSize="md" fontWeight="bold">
        {children}
      </Text>
    </Button>
  );
};

const AdminSideNavbar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <Box
      bg="linear-gradient(135deg, #FFF5F7 0%, #FFF0F5 100%)"
      w="250px"
      h="100vh"
      position="fixed"
      left={0}
      top={0}
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      zIndex={100}
      display="flex"
      flexDirection="column"
      borderRightWidth="1px"
      borderColor="pink.100"
    >
      <VStack spacing={6} align="stretch" flex={1}>
        <Box p={5} bg="pink.100" borderBottomRightRadius="2xl">
          <Heading
            size="lg"
            color="purple.600"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            Library Fun!
          </Heading>
        </Box>
        <Divider borderColor="pink.200" />
        <VStack spacing={2} align="stretch" px={3}>
          <NavItem
            icon={FaHome}
            to="/admin"
            isActive={location.pathname === "/admin"}
          >
            Dashboard
          </NavItem>
          <NavItem
            icon={FaBook}
            to="/books"
            isActive={location.pathname === "/books"}
          >
            Book List
          </NavItem>
          <NavItem
            icon={FaUserCog}
            to="/manage-books"
            isActive={location.pathname === "/manage-books"}
          >
            Manage Books
          </NavItem>
          <NavItem
            icon={FaPlus}
            to="/add-book"
            isActive={location.pathname === "/add-book"}
          >
            Add Book
          </NavItem>
          <NavItem
            icon={FaUsers}
            to="/users"
            isActive={location.pathname === "/users"}
          >
            User List
          </NavItem>
          <NavItem
            icon={FaHandHolding}
            to="/borrowed-books"
            isActive={location.pathname === "/borrowed-books"}
          >
            Borrowed Books
          </NavItem>
        </VStack>
      </VStack>
      <Box p={5}>
        <Button
          onClick={onLogout}
          bg="purple.500"
          color="white"
          width="full"
          leftIcon={<Icon as={FaSignOutAlt} />}
          _hover={{ bg: "purple.600" }}
          size="md"
          fontWeight="bold"
          borderRadius="full"
          boxShadow="md"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default AdminSideNavbar;
