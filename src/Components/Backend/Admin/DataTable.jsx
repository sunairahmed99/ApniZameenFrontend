import React, { useState, useMemo } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './DataTable.css';

const DataTable = ({
    data = [],
    columns = [],
    pageSize: initialPageSize = 10,
    searchable = true,
    sortable = true,
    actions = null,
    actionsWidth = '150px',
    serverSide = false,
    showIndex = false,
    emptyMessage = 'No data found',
    ...props
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Helper to get nested value
    const getNestedValue = (obj, path) => {
        if (!path) return '';
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Sorting logic (client-side only if not serverSide)
    const sortedData = useMemo(() => {
        if (serverSide || !sortConfig.key) return data;

        const sorted = [...data].sort((a, b) => {
            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortConfig.direction === 'asc'
                ? aValue > bValue ? 1 : -1
                : bValue > aValue ? 1 : -1;
        });

        return sorted;
    }, [data, sortConfig, serverSide]);

    // Search logic (client-side only if not serverSide)
    const filteredData = useMemo(() => {
        if (serverSide) return data; // On server-side, data is already filtered
        if (!searchTerm) return sortedData;

        return sortedData.filter(row => {
            return columns.some(col => {
                const value = getNestedValue(row, col.key);
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [sortedData, searchTerm, columns, serverSide, data]);

    // Pagination logic
    // If serverSide, use props.totalPages. Else calculate.
    const calculatedTotalPages = serverSide ? (props.totalPages || 1) : Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // For client side we slice, for server side we just use data (assumed to be the page)
    const paginatedData = serverSide ? data : filteredData.slice(startIndex, endIndex);

    const handleSort = (key) => {
        if (!sortable) return;
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePageChange = (page) => {
        const newPage = Math.max(1, Math.min(page, calculatedTotalPages));
        setCurrentPage(newPage);
        if (serverSide && props.onPageChange) {
            props.onPageChange(newPage);
        }
    };

    // Effect to handle search debounce or trigger
    React.useEffect(() => {
        if (serverSide && props.onSearch) {
            const delayDebounceFn = setTimeout(() => {
                props.onSearch(searchTerm);
                setCurrentPage(1); // Reset to page 1 on search
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchTerm, serverSide]);


    const getSortIcon = (key) => {
        if (!sortable) return null;
        if (sortConfig.key !== key) return <FaSort className="ms-1 text-muted" />;
        return sortConfig.direction === 'asc'
            ? <FaSortUp className="ms-1 text-primary" />
            : <FaSortDown className="ms-1 text-primary" />;
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        // Use calculatedTotalPages
        if (calculatedTotalPages <= maxVisible) {
            for (let i = 1; i <= calculatedTotalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', calculatedTotalPages);
            } else if (currentPage >= calculatedTotalPages - 2) {
                pages.push(1, '...', calculatedTotalPages - 3, calculatedTotalPages - 2, calculatedTotalPages - 1, calculatedTotalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', calculatedTotalPages);
            }
        }
        return pages;
    };

    return (
        <div className="data-table-container">
            {/* Header Controls */}
            <div className="data-table-header">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <label className="mb-0" style={{ color: '#000' }}>Show</label>
                        <select
                            className="form-select form-select-sm"
                            style={{ width: 'auto' }}
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <label className="mb-0" style={{ color: '#000' }}>entries</label>
                    </div>

                    {searchable && (
                        <div className="position-relative" style={{ width: '300px' }}>
                            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="form-control form-control-sm ps-5"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            {showIndex && <th style={{ width: '50px' }}>S.No</th>}
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    style={{
                                        cursor: col.sortable !== false && sortable ? 'pointer' : 'default',
                                        width: col.width || 'auto'
                                    }}
                                    className={col.className || ''}
                                >
                                    {col.label}
                                    {col.sortable !== false && getSortIcon(col.key)}
                                </th>
                            ))}
                            {actions && <th style={{ width: actionsWidth }} className="text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0) + (showIndex ? 1 : 0)} className="text-center py-4 text-muted">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr key={row._id || row.id || index}>
                                    {showIndex && <td>{startIndex + index + 1}</td>}
                                    {columns.map(col => (
                                        <td key={col.key} className={col.className || ''}>
                                            {col.render ? col.render(getNestedValue(row, col.key), row) : getNestedValue(row, col.key)}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="text-end">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="data-table-footer">
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted small">
                        Showing {paginatedData.length === 0 ? 0 : startIndex + 1} to {serverSide ? Math.min(startIndex + pageSize, props.totalItems || 0) : Math.min(endIndex, filteredData.length)} of {serverSide ? (props.totalItems || 0) : filteredData.length} entries
                        {!serverSide && searchTerm && ` (filtered from ${data.length} total entries)`}
                    </div>

                    {calculatedTotalPages > 1 && (
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <FaChevronLeft size={12} />
                                    </button>
                                </li>

                                {renderPageNumbers().map((page, idx) => (
                                    <li
                                        key={idx}
                                        className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                                    >
                                        {page === '...' ? (
                                            <span className="page-link">...</span>
                                        ) : (
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        )}
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === calculatedTotalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === calculatedTotalPages}
                                    >
                                        <FaChevronRight size={12} />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataTable;
