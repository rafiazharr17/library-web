import React, { useState, useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import BookList from "./components/BookList";
import UserList from "./components/UserList";
import AdminDashboard from "./components/AdminDashboard";
import AddBook from "./components/AddBook";
import ManageBooks from "./components/ManageBooks";
import UserDashboard from "./components/UserDashboard";
import BorrowBook from "./components/BorrowBook";
import BorrowedBooks from "./components/BorrowedBooks";
import MyBorrowedBooks from "./components/MyBorrowedBooks";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#f0f0f0",
      100: "#d9d9d9",
      200: "#bfbfbf",
      300: "#a6a6a6",
      400: "#8c8c8c",
      500: "#737373",
      600: "#595959",
      700: "#404040",
      800: "#262626",
      900: "#0d0d0d",
    },
  },
  styles: {
    global: {
      body: {
        bg: "black",
        color: "white",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
        borderRadius: "md",
      },
      variants: {
        solid: {
          bg: "white",
          color: "black",
          _hover: {
            bg: "gray.200",
          },
        },
        outline: {
          borderColor: "white",
          color: "white",
          _hover: {
            bg: "whiteAlpha.200",
          },
        },
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderColor: "whiteAlpha.300",
          },
          td: {
            borderColor: "whiteAlpha.300",
          },
        },
      },
    },
  },
});

function AppContent() {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UserId updated:", userId);
    console.log("Role updated:", role);
  }, [userId, role]);

  const handleLogout = () => {
    setUserId(null);
    setRole(null);
    localStorage.removeItem("userId");
    navigate("/");
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    console.log("ProtectedRoute:", { userId, role, allowedRoles });
    if (!userId) {
      console.log("No userId, redirecting to login");
      return <Navigate to="/" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
      console.log("Unauthorized role, redirecting to books");
      return <Navigate to="/books" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          userId ? (
            role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/user-dashboard" replace />
            )
          ) : (
            <Login setToken={setUserId} setRole={setRole} />
          )
        }
      />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <BookList role={role} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserList role={role} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-book"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddBook onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-books"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageBooks onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/borrow-book"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <BorrowBook onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/borrowed-books"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <BorrowedBooks onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-borrowed-books"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <MyBorrowedBooks onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ChakraProvider>
  );
}

export default App;
