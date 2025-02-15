import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userIcon from '../../../assets/img/user/userIcon.png';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const ViewPendingAccounts = () => {
    // State Management
    const token = customStateMethods.selectStateKey('appState', 'token');
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    const [disable, setDisable] = useState(0);

    // Response Data
    const [listData, setListData] = useState({
        items: [],
        total: 0,
        lastPage: 0,
    });

    // Search Module State
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selected, setSelected] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const totalPages = Math.ceil(listData.total / recordsPerPage);

    // Fetch Pending Accounts on Component Mount or State Change
    useEffect(() => {
        fetchPendingAccounts();
    }, [currentPage, recordsPerPage, disable]);

    const fetchPendingAccounts = async () => {
        try {
            setLoading(customStateMethods.spinnerDiv(true));
            await axios.get('sanctum/csrf-cookie');
            const response = await axios.post(
                `/api/admin/doctors/view-pending-accounts?page=${currentPage}&recordsPerPage=${recordsPerPage}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === 200) {
                setListData({
                    items: response.data.listData,
                    total: response.data.total,
                    lastPage: response.data.last_page,
                });
                setMessages(customStateMethods.getAlertDiv(response.data.message));
            } else if (response.data.status === 204) {
                setListData({
                    items: [],
                    total: 0,
                    lastPage: 0,
                });
            } else {
                setMessages(customStateMethods.getAlertDiv(response.data.message));
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching pending accounts:', error);
        }
    };

    // Handle Accept Account Request
    const handleAcceptAccount = async (id) => {
        try {
            setLoading(customStateMethods.spinnerDiv(true));
            await axios.post(
                '/api/admin/doctors/accept-pending-accounts',
                { id: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('Account request accepted successfully.');
            setDisable((prev) => !prev); // Refresh the list
        } catch (error) {
            console.error('Error accepting account request:', error);
            alert('Failed to accept the account request.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Delete Account Request
    const handleDeleteAccount = async (id) => {
        if (window.confirm('Are you sure you want to delete this account request?')) {
            try {
                setLoading(customStateMethods.spinnerDiv(true));
                await axios.delete(`/api/admin/doctors/delete-pending-account/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                alert('Account request deleted successfully.');
                setDisable((prev) => !prev); // Refresh the list
            } catch (error) {
                console.error('Error deleting account request:', error);
                alert('Failed to delete the account request.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle Search
    const handleSearch = async (e) => {
        const searchValue = e.target.value;
        setQuery(searchValue);

        if (searchValue.length > 1) {
            try {
                const response = await axios.get(
                    `/api/admin/doctors/search-pending-accounts?query=${searchValue}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setSuggestions(response.data.suggestions || []);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Handle Suggestion Selection
    const handleSuggestionClick = (suggestion) => {
        setSelected(suggestion); // Set the selected item
        setQuery(''); // Clear the search query
        setSuggestions([]); // Clear suggestions
    };

    // Clear Messages After 5 Seconds
    useEffect(() => {
        if (messages) {
            const timer = setTimeout(() => {
                setMessages(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [messages]);

    // Determine which data to render
    const dataToRender = selected ? [selected] : listData.items;

    // Render JSX
    return (
        <div>
            {/* Loading and Messages */}
            {loading}
            {messages}

            {/* Search Module */}
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search by phone or unique ID"
                className="mx-4 form-control col-md-7 mt-3"
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <ul className="row list-group">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            className="list-group-item col-md-6 text-dark mt-1"
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{ cursor: 'pointer' }}
                        >
                            <strong>Name:</strong> {suggestion.name} | <strong>Phone:</strong> {suggestion.phone} |{' '}
                            <strong>District:</strong> {suggestion.workDistrict}
                        </li>
                    ))}
                </ul>
            )}

            {/* Table */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Pending Accounts Information</h2>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>S.No</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Sex</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataToRender.length > 0 ? (
                                dataToRender.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                style={{ height: '40px', width: '40px' }}
                                                className="userIcon"
                                                src={userIcon}
                                                alt="User Icon"
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.workDistrict}</td>
                                        <td>{item.sex}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-info"
                                                onClick={() => handleAcceptAccount(item.id)}
                                            >
                                                Accept Request
                                            </button>
                                            <button
                                                className="btn btn-outline-danger ms-2"
                                                onClick={() => handleDeleteAccount(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};