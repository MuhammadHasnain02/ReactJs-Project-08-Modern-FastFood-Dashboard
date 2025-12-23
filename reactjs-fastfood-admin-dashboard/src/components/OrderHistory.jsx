import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { mockHistoryData , PAYMENT_OPTIONS , STATUS_OPTIONS } from '../data/dashboardData'

const getStatusClasses = (status) => {

    switch (status) {
        case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }

};

function OrderHistory() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    // State management using useState
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState({ 
        status: 'All', 
        payment: 'All', 
        startDate: '2024-11-01', 
        endDate: new Date().toISOString().slice(0, 10) 
    });

    const [isLoading, setIsLoading] = useState(true);

    // Dynamic classes based on dark mode
    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-800";
    const inputClass = darkMode 
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";
    const tableHeaderClass = darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500";
    const tableRowClass = darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50";

    // 1. useEffect for initial data load
    useEffect(() => {
        // Simulate data fetching
        console.log("Fetching order history data...");
        const timer = setTimeout(() => {
            setOrders(mockHistoryData);
            setIsLoading(false);
            console.log("History data loaded.");
        }, 500);

        return () => clearTimeout(timer);
    }, []); // Runs once on mount

    // Memoized filtering logic (re-calculates only when dependencies change)
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // 1. Search Filter (Case-insensitive match on ID or Customer Name)
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Status Filter
        if (filters.status !== 'All') {
            filtered = filtered.filter(order => order.status === filters.status);
        }

        // 3. Payment Method Filter
        if (filters.payment !== 'All') {
            filtered = filtered.filter(order => order.payment === filters.payment);
        }

        // 4. Date Range Filter
        const start = new Date(filters.startDate).getTime();
        const end = new Date(filters.endDate).getTime();

        filtered = filtered.filter(order => {
            const orderDate = new Date(order.date.split(' ')[0]).getTime();
            return orderDate >= start && orderDate <= end;
        });

        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest first
    }, [orders, searchTerm, filters]); // Dependencies: orders, search term, filters

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleViewDetails = (id) => {
        console.log(`Viewing details/receipt for ${id}`);
        // In a real app, this would open a modal or navigate to a details page.
        alert(`Simulating View Receipt for: ${id}`);
    };

    const handleRefund = (id) => {
        console.log(`Initiating refund for ${id}`);
        // In a real app, this would require authorization and API call.
        alert(`Simulating Refund for: ${id}`);
    };

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-500 ${bgClass}`}>
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <i className="fa-solid fa-history w-7 h-7 mr-3 text-blue-600"></i> Order History
                </h1>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#2563EB"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <div>
                    {/* Filters and Search Bar */}
                    <div className={`p-4 mb-6 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex flex-wrap items-center gap-4">
                            
                            {/* Search Input */}
                            <div className="relative flex-grow">
                                <i className={`fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`}></i>
                                <input
                                    type="text"
                                    placeholder="Search by Order ID or Customer Name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className={`text-sm w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-red-500 focus:border-red-500 ${inputClass}`}
                                />
                            </div>

                            {/* Status Filter */}
                            <select 
                                name="status" 
                                value={filters.status} 
                                onChange={handleFilterChange} 
                                className={`py-2 px-4 border rounded-lg focus:ring-red-500 focus:border-red-500 ${inputClass}`}
                            >
                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>

                            {/* Payment Filter */}
                            <select 
                                name="payment" 
                                value={filters.payment} 
                                onChange={handleFilterChange} 
                                className={`py-2 px-4 border rounded-lg focus:ring-red-500 focus:border-red-500 ${inputClass}`}
                            >
                                {PAYMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>

                            {/* Date Range Filter */}
                            <div className="flex gap-2">
                                <input 
                                    type="date" 
                                    name="startDate" 
                                    value={filters.startDate} 
                                    onChange={handleFilterChange}
                                    className={`py-2 px-4 border rounded-lg ${inputClass}`}
                                />
                                <input 
                                    type="date" 
                                    name="endDate" 
                                    value={filters.endDate} 
                                    onChange={handleFilterChange}
                                    className={`py-2 px-4 border rounded-lg ${inputClass}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Table */}
                    <div className={`overflow-x-auto rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            
                            <thead className={tableHeaderClass}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date/Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                
                                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                    <tr key={order.id} className={tableRowClass}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">${order.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span 
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            <button 
                                                onClick={() => handleViewDetails(order.id)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                                title="View Receipt"
                                            >
                                                <i className="fa-solid fa-receipt mr-1"></i> View
                                            </button>
                                            {order.status === 'COMPLETED' && (
                                                <button 
                                                    onClick={() => handleRefund(order.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors ml-2"
                                                    title="Initiate Refund"
                                                >
                                                    <i className="fa-solid fa-undo"></i> Refund
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-lg text-gray-500 dark:text-gray-400">
                                            <i className="fa-solid fa-folder-open text-4xl mb-3"></i>
                                            <p>No orders match the current filters or search term.</p>
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                            
                        </table>

                    </div>

                    <p className={`mt-6 text-sm text-gray-500 dark:text-gray-400`}>
                        Showing {filteredOrders.length} of {orders.length} total historical records.
                    </p>
                </div>
            )}

        </div>
    );
}

function App() {
    return (
        <div className="flex-1 sm:ml-20 md:ml-62">
            <OrderHistory />
        </div>
    );
}

export default App;