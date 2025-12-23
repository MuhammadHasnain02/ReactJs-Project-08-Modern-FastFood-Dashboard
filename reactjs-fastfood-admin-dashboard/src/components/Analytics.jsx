import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ========= Data =========
import { mockCategoryData } from '../data/dashboardData'

// 2. Hourly Sales Data (Mocking a full week)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 12 }, (_, i) => `${i + 1}${i < 8 ? 'PM' : 'AM'}`); // 12 PM to 11 AM, simplifying for heatmap structure
const mockHourlySales = days.flatMap(day => 
    hours.map(hour => ({
        day: day,
        hour: hour,
        orders: Math.floor(Math.random() * (day === 'Fri' || day === 'Sat' ? 120 : 60)), // Higher orders on weekends
        revenue: Math.floor(Math.random() * (day === 'Fri' || day === 'Sat' ? 2500 : 1000)),
    }))
);

// --- Sub-Components ---

const CustomTooltip = ({ active, payload, label }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className={`p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border border-amber-500`}>
                <p className="font-semibold text-amber-500">{`${data.day} at ${data.hour}`}</p>
                <p className="text-sm">Orders: <span className="font-bold">{data.orders}</span></p>
                <p className="text-sm">Revenue: <span className="font-bold">${data.revenue.toLocaleString()}</span></p>
            </div>
        );
    }
    return null;
};

//  1. Revenue by Category Chart

const RevenueByCategoryChart = ({ data }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const barColor = '#f59e0b'; // Tailwind amber-500
    const axisColor = darkMode ? '#9ca3af' : '#4b5563'; // Tailwind gray-400 / gray-700
    const gridColor = darkMode ? '#374151' : '#e5e7eb'; // Tailwind gray-700 / gray-200

    return (
        <div className={`px-6 pt-6 pb-14 rounded-xl shadow-lg h-80 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            
            <h3 className={`text-xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue by Category (Total Sales)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis 
                        dataKey="name" 
                        stroke={axisColor} 
                        style={{ fontSize: '12px', fontWeight: 'bold' }}
                        tickLine={false}
                    />
                    <YAxis 
                        stroke={axisColor} 
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                        tickLine={false}
                    />
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ fill: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar dataKey="revenue" fill={barColor} radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

//  2. Hourly Sales Heatmap

const HourlySalesHeatmap = ({ data }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    // Determine the max number of orders for color scaling
    const maxOrders = data.reduce((max, item) => Math.max(max, item.orders), 0);
    const dayLabels = days;
    const hourLabels = hours;
    
    // Function to map order count to a Tailwind color class
    const getColorClass = useCallback((orders) => {
        const ratio = orders / maxOrders;
        if (ratio === 0) return 'bg-gray-200 dark:bg-gray-700';
        if (ratio < 0.2) return 'bg-amber-100 dark:bg-amber-900/40';
        if (ratio < 0.4) return 'bg-amber-200 dark:bg-amber-800/60';
        if (ratio < 0.6) return 'bg-amber-300 dark:bg-amber-700/80';
        if (ratio < 0.8) return 'bg-amber-400 dark:bg-amber-600';
        return 'bg-amber-500 dark:bg-amber-500';
    }, [maxOrders]);

    // Use state to track hover for displaying detailed tooltip on heatmap
    const [hoverData, setHoverData] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const handleCellHover = (item, e) => {
        setHoverData(item);
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    const handleCellLeave = () => {
        setHoverData(null);
    };

    // Find the data point for a specific day and hour
    const getCellData = (day, hour) => data.find(item => item.day === day && item.hour === hour);

    return (
        <div className={`p-5 rounded-xl shadow-lg overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Hourly Sales Activity Heatmap (Orders)
            </h3>
            
            <div className="relative">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr>
                            <th className="p-1 w-10"></th> {/* Corner space */}
                            {hourLabels.map((hour) => (
                                <th key={hour} className={`text-center p-1 text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {hour.replace('M', '').toLowerCase()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dayLabels.map((day) => (
                            <tr key={day} className="h-10">
                                <td className={`text-left p-1 text-sm font-semibold sticky left-0 z-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                                    {day}
                                </td>
                                {hourLabels.map((hour) => {
                                    const item = getCellData(day, hour);
                                    const orders = item ? item.orders : 0;
                                    const colorClass = getColorClass(orders);

                                    return (
                                        <td 
                                            key={`${day}-${hour}`} 
                                            className={`p-0.5 min-w-[30px]`}
                                        >
                                            <div 
                                                className={`w-full h-8 rounded-md cursor-pointer transition-all duration-100 ease-in-out border border-transparent ${colorClass} hover:border-gray-500 dark:hover:border-white`}
                                                onMouseEnter={(e) => handleCellHover(item, e)}
                                                onMouseLeave={handleCellLeave}
                                                title={`${day} ${hour}: ${orders} orders`}
                                            >
                                                {/* Optional: Add text for high values */}
                                                {orders > maxOrders * 0.7 && 
                                                    <span className="text-[10px] text-center block pt-2 font-bold text-gray-800 dark:text-gray-100 leading-none">
                                                        {orders}
                                                    </span>
                                                }
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Custom Tooltip display logic */}
                {hoverData && (
                    <div 
                        style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, calc(-100% - 10px))', pointerEvents: 'none' }}
                        className={`fixed p-3 rounded-lg shadow-2xl z-[60] transition-opacity duration-200 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border border-amber-500`}
                    >
                        <p className="font-semibold text-amber-500">{`${hoverData.day} at ${hoverData.hour}`}</p>
                        <p className="text-sm">Orders: <span className="font-bold">{hoverData.orders}</span></p>
                        <p className="text-sm">Revenue: <span className="font-bold">${hoverData.revenue.toLocaleString()}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};

//  3. Reports Download Section

const ReportsSection = () => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const reportOptions = [
        { name: 'Daily Sales Summary', type: 'CSV' },
        { name: 'Weekly Performance Report', type: 'PDF' },
        { name: 'Monthly Revenue Breakdown', type: 'CSV' },
    ];

    const handleDownload = (reportName, type) => {
        console.log(`Downloading ${reportName} as ${type}... (Mock Download)`);
        // In a real app, this would trigger an API call to generate the file
        alert(`Requesting download for: ${reportName} (${type}). Check your notifications!`);
    };

    const cardClass = darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
    const buttonClass = "px-3 py-1 text-xs font-semibold rounded-full shadow-sm transition-all";

    return (
        <div className={`p-5 rounded-xl shadow-lg border ${cardClass}`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fa-solid fa-file-arrow-down mr-2 text-indigo-500"></i> Downloadable Reports
            </h3>
            <div className="space-y-4">
                {reportOptions.map((report, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                        <span className="text-sm md:text-base">{report.name}</span>
                        <button
                            onClick={() => handleDownload(report.name, report.type)}
                            className={`flex items-center ${buttonClass} ${report.type === 'CSV' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                        >
                            <i className={`fa-solid ${report.type === 'CSV' ? 'fa-file-csv' : 'fa-file-pdf'} mr-2`}></i>
                            Download {report.type}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

//  Core Analytics Component

function Analytics() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); 

        return () => clearTimeout(timer);
    }, []);

    // Dynamic classes
    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-800";

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-300 ${bgClass}`}>
            
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <i className="fa-solid fa-chart-bar w-7 h-7 mr-3 text-amber-500"></i> Analytics & Reporting
                </h1>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#D97706"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue by Category Chart (Takes 2/3 width on large screens) */}
                        <div className="lg:col-span-2 h-96">
                            <RevenueByCategoryChart data={mockCategoryData} darkMode={darkMode} />
                        </div>
                        
                        {/* Reports Section (Takes 1/3 width on large screens) */}
                        <div className="lg:col-span-1">
                            <ReportsSection darkMode={darkMode} />
                        </div>
                    </div>
                    
                    {/* Hourly Sales Heatmap (Full width) */}
                    <div className="mb-15">
                        <HourlySalesHeatmap data={mockHourlySales} darkMode={darkMode} />
                    </div>

                </div>
            )}

        </div>
    );
}

// --- Main App Wrapper (for running in single file environment) ---
// This is necessary to simulate the full dashboard environment
function App() {
    
    // Custom utility to prevent window.alert in the iframe environment
    // const alert = (message) => {
    //     // Find or create a custom message box element
    //     let msgBox = document.getElementById('custom-alert-box');
    //     if (!msgBox) {
    //         msgBox = document.createElement('div');
    //         msgBox.id = 'custom-alert-box';
    //         msgBox.className = 'fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 transition-transform duration-300 transform translate-x-full';
    //         document.body.appendChild(msgBox);
    //     }
        
    //     // Update content and style
    //     msgBox.innerHTML = `<i class="fa-solid fa-circle-info mr-2"></i> ${message}`;
    //     msgBox.className = `fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 transition-transform duration-300 transform bg-amber-500 text-white translate-x-0`;
        
    //     // Hide after 3 seconds
    //     setTimeout(() => {
    //         msgBox.className = msgBox.className.replace('translate-x-0', 'translate-x-full');
    //     }, 3000);
    //     console.log("Custom Alert Triggered:", message);
    // };
    
    // Expose alert globally for child components to use without direct prop passing
    // useEffect(() => {
    //     window.alert = alert;
    // }, []);

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 sm:ml-20 md:ml-62">
                <Analytics />
            </div>
        </div>
    );
}

export default App;