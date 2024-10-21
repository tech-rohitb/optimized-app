// src/App.js
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserCard from "./components/UserCard";
import UserDetails from "./components/UserDetails";
import Header from "./components/Header";
import { useLoadTimer } from "./hooks/useLoadTimer";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 8;
  const { loadTime } = useLoadTimer(loading);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const startTime = performance.now();
    const id = setInterval(() => {
      const currentTime = performance.now();
      setElapsedTime((currentTime - startTime).toFixed(2));
    }, 10);

    setIntervalId(id);

    // Fetch users
    const fetchUsers = async () => {
      const cachedResponse = await caches.match("https://dummyjson.com/users");
      let allUsers = [];

      if (cachedResponse) {
        const data = await cachedResponse.json();
        allUsers = data.users; // Use cached users if available
      } else {
        const response = await fetch("https://dummyjson.com/users");
        const data = await response.json();
        allUsers = data.users;

        // Cache the response
        const cache = await caches.open("user-cache");
        cache.put(
          "https://dummyjson.com/users",
          new Response(JSON.stringify(data))
        );
      }

      setUsers(allUsers);
      setLoading(false);
      clearInterval(id);
    };

    fetchUsers();

    return () => {
      clearInterval(id);
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const combinedFields = Object.values({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      company: user.company.name,
    })
      .join(" ")
      .toLowerCase();

    return combinedFields.includes(searchTerm.toLowerCase());
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = (searchTerm ? filteredUsers : users).slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <Router>
      <Header searchTerm={searchTerm} handleSearch={handleSearch} />
      <div className="App">
        <h2>Elapsed Time: {elapsedTime} ms</h2>
        {loading ? (
          <h1>Loading users...</h1>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="user-list">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <UserCard key={user.id} user={user} loading={loading} />
                      ))
                    ) : (
                      <p>No users found for "{searchTerm}"</p>
                    )}
                  </div>
                  <div className="pagination">
                    {Array.from({
                      length: Math.ceil(
                        (searchTerm ? filteredUsers.length : users.length) /
                          usersPerPage
                      ),
                    }).map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={index + 1 === currentPage ? "active" : ""}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </>
              }
            />
            <Route
              path="/user/:id"
              element={<UserDetails users={users} loading={loading} />}
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
