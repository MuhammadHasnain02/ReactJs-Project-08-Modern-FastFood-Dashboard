import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { initialOrders , ORDER_STATUSES } from '../data/dashboardData'

// --- Sub-Components ---

const OrderCard = ({ order, onStatusChange }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const statusConfig = ORDER_STATUSES[order.status];
    const cardBg = darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200";
    const textPrimary = darkMode ? "text-white" : "text-gray-900";
    const textSecondary = darkMode ? "text-gray-400" : "text-gray-500";

    const isPending = order.status === 'PENDING';
    

    return (
        <>
        <div className={`p-4 rounded-xl shadow-lg border mb-4 cursor-pointer transition-all duration-500 transform hover:shadow-xl ${cardBg}`}>

            <div className={`flex justify-between items-center pb-2 border-b mb-3 ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                <h3 className={`font-extrabold text-lg ${textPrimary}`}>{order.id}</h3>
                <i className={`${statusConfig.icon} ${statusConfig.color} text-xl`} title={statusConfig.label}></i>
            </div>

            <div className="space-y-2 text-sm">
                <p className={`${textSecondary} flex items-center`}>
                    <i className="fa-solid fa-user w-4 h-4 mr-2 text-indigo-400"></i>
                    <span className="font-semibold">{order.customer}</span>
                </p>
                <p className={`${textSecondary} flex items-center`}>
                    <i className="fa-solid fa-clock w-4 h-4 mr-2 text-indigo-400"></i>
                    <span className="font-medium">Placed: {order.timePlaced}</span>
                </p>
            </div>
            
            <div className="mt-3 pt-3 border-t text-xs space-y-1">
                <p className={`${textPrimary} font-bold mb-1`}>Items Ordered:</p>
                <ul className="list-disc list-inside space-y-0.5">
                    {order.items.map((item, index) => (
                        <li key={index} className={textSecondary}>{item}</li>
                    ))}
                </ul>
            </div>

            {statusConfig.next && (
                <button
                    onClick={() => onStatusChange(order.id, statusConfig.next)}
                    className={`mt-4 w-full flex items-center justify-center px-4 py-2 text-white font-semibold rounded-lg transition-all duration-500 
                    ${isPending ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                >
                    {statusConfig.nextLabel} 
                    <i className="fa-solid fa-arrow-right w-3 h-3 ml-2"></i>
                </button>
            )}
            {order.status === 'COMPLETED' && (
                <div className={`mt-4 w-full text-center px-4 py-2 font-semibold rounded-lg ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-green-100 text-green-700'}`}>
                    Order Closed
                </div>
            )}
        </div>
        </>
    );
};

function LiveOrders() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    // 1. useState for data management
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Dynamic classes
    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-800";
    const dividerClass = darkMode ? "border-gray-700" : "border-gray-300";

    // 2. useEffect for data fetching/initialization
    useEffect(() => {
        console.log("Fetching initial orders...");
        
        const timer = setTimeout(() => {
            setOrders(initialOrders);
            setIsLoading(false);
            console.log("Orders loaded.");
        }, 800);

        // Cleanup function for useEffect
        return () => clearTimeout(timer);
    }, []);

    const handleStatusChange = (id, newStatus) => {

        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === id ? { ...order, status: newStatus } : order
            )
        );
        console.log(`Order ${id} moved to: ${newStatus}`);

    };

    // Calculate ordersByStatus directly on render since useMemo was removed.
    const ordersByStatus = Object.keys(ORDER_STATUSES).reduce((acc, status) => {
        acc[status] = orders.filter(order => order.status === status);
        return acc;
    }, {});

    const renderColumn = (statusKey) => {
        const config = ORDER_STATUSES[statusKey];
        const count = ordersByStatus[statusKey].length;
        
        const columnBg = darkMode ? "bg-gray-800" : "bg-white";
        
        return (
            <div 
                key={statusKey} 
                className={`p-4 rounded-xl shadow-lg border ${columnBg} ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
                {/* Column Header */}
                <div className={`flex justify-between items-center mb-4 pb-2 border-b ${dividerClass}`}>
                    <h2 className={`text-xl font-bold ${textPrimary} flex items-center`}>
                        <i className={`${config.icon} ${config.color} mr-2`}></i>
                        {config.label}
                    </h2>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${config.color} ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {count}
                    </span>
                </div>

                {/* Orders List */}
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    {ordersByStatus[statusKey].map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                    {count === 0 && !isLoading && (
                        <div className={`text-center py-10 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
                            No orders in this stage.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-500 ${bgClass}`}>
            
            {/* Header: Note: Dark Mode Toggle removed from here as per request */}
            <div className="flex justify-between items-center border-b pb-4 border-gray-300 dark:border-gray-700">
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <i className="fa-solid fa-bell w-7 h-7 mr-3 text-red-500"></i> Live Order Tracking
                </h1>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#DC2626"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                /* Kanban Board Grid - Highly Responsive Layout */
                <div className="grid grid-cols-2 gap-6 my-6 mb-15
                    sm:grid-cols-2 
                    md:grid-cols-3
                    lg:grid-cols-3
                    ">
                    {Object.keys(ORDER_STATUSES).map(statusKey => renderColumn(statusKey))}
                </div>
            )}
            
        </div>
    );
}

function App() {

    return (
        // {/* Main Content Area: Pushed over by the mock sidebar */}
        <div className="flex-1 sm:ml-20 md:ml-62">
            <LiveOrders/>
        </div>
    );

}

export default App;