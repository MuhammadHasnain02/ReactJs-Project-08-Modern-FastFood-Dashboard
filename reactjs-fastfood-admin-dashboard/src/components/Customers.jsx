import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { mockCustomerData } from '../data/dashboardData'

const CustomerDetailModal = ({ customer, onCancel }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    
    const modalBg = darkMode ? "bg-gray-800" : "bg-white";
    const textPrimary = darkMode ? "text-white" : "text-gray-900";
    const textSecondary = darkMode ? "text-gray-400" : "text-gray-600";
    const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

    const favoriteItems = customer.history.flatMap(order => order.items).reduce((acc, item) => {
        const name = item.split(' (x')[0];
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    const sortedFavorites = Object.entries(favoriteItems).sort(([, countA], [, countB]) => countB - countA);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className={`p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${modalBg} transition-all duration-500 transform scale-100`}>
                
                {/* Header and Close */}
                <div className={`flex justify-between items-center pb-3 mb-4 border-b ${borderClass}`}>
                    <h2 className={`text-2xl font-bold ${textPrimary}`}>
                        <i className="fa-solid fa-user-circle mr-2 text-indigo-500"></i> {customer.name}
                    </h2>
                    <button onClick={onCancel} className={`text-xl ${textSecondary} hover:text-red-500 transition-colors`}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Contact and Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className={`p-3 rounded-lg border ${borderClass} ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-sm font-medium ${textSecondary}`}>Email</p>
                        <p className={`font-semibold ${textPrimary}`}>{customer.email}</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${borderClass} ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-sm font-medium ${textSecondary}`}>Total Orders</p>
                        <p className={`font-semibold text-2xl text-red-500`}>{customer.totalOrders}</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${borderClass} ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-sm font-medium ${textSecondary}`}>Loyalty Points</p>
                        <p className={`font-semibold text-2xl text-amber-500`}>{customer.loyaltyPoints}</p>
                    </div>
                </div>

                {/* Favorite Items */}
                <div className="mb-6">
                    <h3 className={`text-xl font-bold mb-3 ${textPrimary} flex items-center`}>
                        <i className="fa-solid fa-heart mr-2 text-pink-500"></i> Favorite Items
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {sortedFavorites.length > 0 ? sortedFavorites.map(([item, count]) => (
                            <span key={item} className={`px-4 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                {item} ({count})
                            </span>
                        )) : (
                            <p className={textSecondary}>No order history to determine favorites.</p>
                        )}
                    </div>
                </div>

                {/* Order History */}
                <div>
                    <h3 className={`text-xl font-bold mb-3 ${textPrimary} flex items-center`}>
                        <i className="fa-solid fa-history mr-2 text-red-500"></i> Order History ({customer.history.length})
                    </h3>
                    <div className={`overflow-x-auto rounded-lg border ${borderClass}`}>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className={darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"}>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
                                {customer.history.map(order => (
                                    <tr key={order.orderId} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{order.orderId}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{order.date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">${order.total.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <ul className="list-disc list-inside space-y-0.5">
                                                {order.items.map((item, index) => (
                                                    <li key={index} className={textSecondary}>{item}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {customer.history.length === 0 && <p className={`mt-3 text-sm ${textSecondary}`}>This customer has no recorded orders.</p>}
                </div>

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={onCancel} 
                        className={`px-4 py-2 rounded-lg font-semibold ${darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

function Customers() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Dynamic classes
    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-800";
    const inputClass = darkMode 
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";
    const tableHeaderClass = darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500";
    const tableRowClass = darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50";

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: 'totalOrders', direction: 'descending' });

    // 1. useEffect for initial data load
    useEffect(() => {
        console.log("Fetching customer data...");
        const timer = setTimeout(() => {
            setCustomers(mockCustomerData);
            setIsLoading(false);
            console.log("Customer data loaded.");
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // --- Calculation of sorted and filtered data (No React.useMemo) ---
    // Function to handle sorting and filtering
    let sortableItems = [...customers];

    // 1. Sorting logic
    if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    // 2. Filtering logic
    const sortedCustomers = sortableItems.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // --- End of calculation ---


    // Request sort change
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <i className="fa-solid fa-sort ml-1 text-gray-400"></i>;
        }
        return sortConfig.direction === 'ascending' 
            ? <i className="fa-solid fa-sort-up ml-1 text-indigo-500"></i> 
            : <i className="fa-solid fa-sort-down ml-1 text-indigo-500"></i>;
    };
    
    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
    };

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-500 ${bgClass}`}>
            
            {/* Header and Dark Mode Toggle */}
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <i className="fa-solid fa-users w-7 h-7 mr-3 text-blue-500"></i> Customer Loyalty Base
                </h1>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#0EA5E9"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <div>

                    {/* Search Bar */}
                    <div className={`p-4 mb-6 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="relative">
                            <i className={`fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`}></i>
                            <input
                                type="text"
                                placeholder="Search by Customer Name or Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`text-[15px] w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-red-500 focus:border-red-500 ${inputClass}`}
                            />
                        </div>
                    </div>

                    {/* Customer Table */}
                    <div className={`overflow-x-auto rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className={tableHeaderClass}>
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('name')}
                                    >
                                        Name {getSortIcon('name')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('totalOrders')}
                                    >
                                        Total Orders {getSortIcon('totalOrders')}
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('loyaltyPoints')}
                                    >
                                        Points {getSortIcon('loyaltyPoints')}
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                {sortedCustomers.length > 0 ? sortedCustomers.map((customer) => (
                                    <tr key={customer.id} className={tableRowClass}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{customer.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <p className="font-semibold">{customer.email}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{customer.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-500">{customer.totalOrders}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-500">{customer.loyaltyPoints}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button 
                                                onClick={() => handleViewDetails(customer)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                                title="View Details"
                                            >
                                                <i className="fa-solid fa-id-card mr-1"></i> View Profile
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-lg text-gray-500 dark:text-gray-400">
                                            <i className="fa-solid fa-person-circle-question text-4xl mb-3"></i>
                                            <p>No customers found matching the search criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Customer Detail Modal */}
                    {selectedCustomer && (
                        <CustomerDetailModal 
                            customer={selectedCustomer}
                            onCancel={() => setSelectedCustomer(null)}
                            darkMode={darkMode}
                        />
                    )}


                </div>
            )}

        </div>
    );
}

function App() {
    
    return (
        <div className="flex-1 sm:ml-20 md:ml-62">
            <Customers />
        </div>
    );
}

export default App;