import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const EnableTests = () => {
  const token = customStateMethods.selectStateKey('appState', 'token');
  const [tests, setTests] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Search and suggestions states
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch tests with pagination
  useEffect(() => {
    fetchTests();
  }, [token, currentPage, recordsPerPage]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/fetch-disable-tests', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          recordsPerPage: recordsPerPage,
        },
      });
      const data = response.data.data;
      setTests(data);
      setTotalRecords(response.data.total || 0); // Set total records for pagination
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enable a test
  const enableTest = async (id) => {
    try {
      await axios.post(`/api/admin/enable-test/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTests(); // Refresh the list after enabling
    } catch (error) {
      console.error('Error enabling test:', error);
    }
  };

  // Handle search input
  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/search-disable-tests', {
          headers: { Authorization: `Bearer ${token}` },
          params: { query: searchValue },
        });
        setSuggestions(response.data.data || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSelectItem = (selected) => {
    setSelectedItem(selected);
    setQuery('');
    setSuggestions([]);
  };

  // Pagination functions
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleRow = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setRecordsPerPage(value);
      setCurrentPage(1); // Reset to the first page when changing rows per page
    }
  };

  const getPageCount = () => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Disabled Tests</h2>

      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search tests..."
        value={query}
        onChange={handleSearch}
      />

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="list-group">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="list-group-item list-group-item-action"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelectItem(suggestion)}
            >
              <span className="fw-bold">{suggestion.name}</span>
              <br />
              <span>Category: {suggestion.category}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tests List */}
      <ul className="list-group">
        {selectedItem ? (
          <li
            key={selectedItem.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span className="fw-bold">{selectedItem.name}</span>
            <button
              className="btn btn-success btn-sm"
              onClick={() => enableTest(selectedItem.id)}
            >
              Enable
            </button>
          </li>
        ) : (
          Array.isArray(tests) &&
          tests.map((test) => (
            <li
              key={test.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span className="fw-bold">{test.name}</span>
              <button
                className="btn btn-success btn-sm"
                onClick={() => enableTest(test.id)}
              >
                Enable
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Pagination UI */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <select
            className="form-select"
            onChange={handleRow}
            value={recordsPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageClick(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {getPageCount().map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === Math.ceil(totalRecords / recordsPerPage)
                  ? 'disabled'
                  : ''
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageClick(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};