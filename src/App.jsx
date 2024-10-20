import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserCard from "./components/UserCard";
import UserDetails from "./components/UserDetails";
import Header from "./components/Header"; // Import Header component
import { useLoadTimer } from "./hooks/useLoadTimer"; // Import the useLoadTimer hook
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const usersPerPage = 8;

  // Load timer logic
  const { loadTime } = useLoadTimer(loading); // Use the load timer hook

  // Timer state to keep track of elapsed time
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Start the timer when the component mounts
    const startTime = performance.now();
    const id = setInterval(() => {
      const currentTime = performance.now();
      setElapsedTime((currentTime - startTime).toFixed(2)); // Update elapsed time
    }, 10); // Update every 10 ms

    setIntervalId(id); // Store the interval ID

    // Fetch users
    const fetchUsers = async () => {
      let allUsers = [];

      for (let page = 1; page <= 3; page++) {
        const response = await fetch(`https://dummyjson.com/users`);
        const data = await response.json();

        // Simulate slow network call by adding delay
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay

        allUsers = [...allUsers, ...data.users];
      }

      setUsers(allUsers);
      setLoading(false); // Set loading to false after fetching
      clearInterval(id); // Stop the timer once users are loaded
    };

    fetchUsers();

    // Cleanup function to clear the interval on unmount
    return () => {
      clearInterval(id);
    };
  }, []); // Run only once on mount

  // Calculate the filtered users based on the search term
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

  // Calculate pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Show current users based on the filtered list
  const currentUsers = (searchTerm ? filteredUsers : users).slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update search term based on input
    setCurrentPage(1); // Reset to the first page whenever the search changes
  };

  // Effect to reset the page when the search term changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page whenever searchTerm changes
  }, [searchTerm]);

  return (
    <Router>
      <Header searchTerm={searchTerm} handleSearch={handleSearch} />{" "}
      {/* Header with Search */}
      <div className="App">
        <h2>Elapsed Time: {elapsedTime} ms</h2> {/* Display elapsed time */}
        {/* <h2>
          Total Load Time: {loadTime ? `${loadTime} ms` : "Calculating..."}
        </h2>{" "} */}
        {/* Display total load time */}
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
                        key={index + 1} // Changed to index + 1 to ensure keys are unique
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
