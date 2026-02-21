const SearchBar = ({ value, onChange, darkMode }) => {
  return (
    <input
      type="text"
      placeholder="Search customer by name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '14px 20px',
        borderRadius: '16px',
        border: darkMode ? '1px solid #4b5563' : '1px solid #ddd',
        fontSize: '15px',
        outline: 'none',
        background: darkMode ? '#374151' : 'rgba(255, 255, 255, 0.95)',
        color: darkMode ? '#f9fafb' : '#1f2937',
        boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.08)',
        transition: '0.3s',
        boxSizing: 'border-box'
      }}
    />
  );
};

export default SearchBar;
