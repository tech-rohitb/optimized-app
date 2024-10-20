function Header({ searchTerm, handleSearch }) {
  return (
    <header className="header">
      <h1 className="app-title">User Directory</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for users..."
        className="search-bar"
      />
    </header>
  );
}

export default Header;
