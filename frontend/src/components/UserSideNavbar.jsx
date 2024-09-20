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
import { FaHome, FaBook, FaSignOutAlt, FaHandHolding } from "react-icons/fa";

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
      bg={isActive ? "teal.100" : "transparent"}
      color={isActive ? "teal.600" : "gray.600"}
      _hover={{ bg: "teal.50", color: "teal.500" }}
      leftIcon={<Icon as={icon} boxSize={5} mr={4} />}
      transition="all 0.2s"
    >
      <Text fontSize="md" fontWeight="bold">
        {children}
      </Text>
    </Button>
  );
};

const UserSideNavbar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <Box
      bg="linear-gradient(135deg, #E6FFFA 0%, #E6FFFF 100%)"
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
      borderColor="teal.100"
    >
      <VStack spacing={6} align="stretch" flex={1}>
        <Box p={5} bg="teal.100" borderBottomRightRadius="2xl">
          <Heading
            size="lg"
            color="teal.600"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            Book Buddies!
          </Heading>
        </Box>
        <Divider borderColor="teal.200" />
        <VStack spacing={2} align="stretch" px={3}>
          <NavItem
            icon={FaHome}
            to="/user-dashboard"
            isActive={location.pathname === "/user-dashboard"}
          >
            User Dashboard
          </NavItem>
          <NavItem
            icon={FaBook}
            to="/my-borrowed-books"
            isActive={location.pathname === "/my-borrowed-books"}
          >
            My Borrowed Books
          </NavItem>
          <NavItem
            icon={FaHandHolding}
            to="/borrow-book"
            isActive={location.pathname === "/borrow-book"}
          >
            Borrow Book
          </NavItem>
        </VStack>
      </VStack>
      <Box p={5}>
        <Button
          onClick={onLogout}
          bg="teal.500"
          color="white"
          width="full"
          leftIcon={<Icon as={FaSignOutAlt} />}
          _hover={{ bg: "teal.600" }}
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

export default UserSideNavbar;
