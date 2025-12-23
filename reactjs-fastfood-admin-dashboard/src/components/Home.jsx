import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { initialOrders , mockMenuItems } from '../data/dashboardData'

// Assumes props: orders (array of recent orders), menuItems (array of food items)

function Home() {

    const navigation = useNavigate()
    const { darkMode } = useContext(ThemeContext)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`ml-62 mb-10 md:mb-12 p-4 md:p-8 min-h-screen transition-all duration-500
            ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}>

            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-300">
                <h1 className={`text-3xl font-bold flex items-center`}>
                    <i className="fa-solid fa-utensils w-7 h-7 mr-3 text-green-600"></i> Restaurant Overview
                </h1>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        strokeColor={darkMode ? "#f97316" : "#ea580c"}
                        strokeWidth="5"
                        animationDuration="1"
                    />
                </div>
            ) : (
                <div>

                    {/* Grid 3 Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {/* Total Orders */}
                        <div onClick={() => navigation('/orderhistory')}
                            className={`p-8 rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1
                            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                        >

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className={`${darkMode ? "text-gray-200" : "text-gray-600"} text-3xl font-bold`}>342</h2>
                                    <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm font-medium`}>Total Orders</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <i className="fa-solid fa-bag-shopping text-orange-600 text-xl"></i>
                                </div>
                            </div>

                        </div>

                        {/* Revenue */}
                        <div onClick={() => navigation('/analytics')}
                            className={`p-8 rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1
                            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                        >

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className={`${darkMode ? "text-gray-200" : "text-gray-600"} text-3xl font-bold`}>Rs. 14,250</h2>
                                    <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm font-medium`}>Today's Revenue</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <i className="fa-solid fa-money-bill-trend-up text-green-600 text-xl"></i>
                                </div>
                            </div>

                        </div>

                        {/* Active Menu Items */}
                        <div
                            onClick={() => navigation('/foodmenu')}
                            className={`p-8 rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1
                            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className={`${darkMode ? "text-gray-200" : "text-gray-600"} text-3xl font-bold`}>24</h2>
                                    <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm font-medium`}>Active Menu Items</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <i className="fa-solid fa-list text-blue-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col lg:flex-row justify-between gap-6 mt-8">

                        {/* Recent Orders List */}
                        <div
                            className={`flex-1 px-8 py-6 rounded-xl shadow-sm border 
                            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                        >
                            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                                Recent Orders
                            </h2>

                            {initialOrders.slice(0, 4).map((order) => (
                                <div
                                    key={order.id}
                                    className={`flex items-center py-4 gap-6 border-t 
                                    ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                                >
                                    {/* Order Icon / ID */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-xs font-bold
                                            ${darkMode ? "bg-gray-700 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                                            #{order.id.split('-')[1]}
                                        </div>
                                    </div>

                                    {/* Customer & Items Info */}
                                    <div className="flex-1">
                                        <p className={`${darkMode ? "text-gray-200" : "text-gray-700"} font-semibold`}>
                                            {order.customer}
                                        </p>
                                        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm truncate max-w-[200px]`}>
                                            {order.items.join(", ")}
                                        </p>
                                    </div>

                                    {/* Status & Time */}
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                            ${order.status === 'READY' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                            'bg-orange-100 text-orange-700'}`}>
                                            {order.status}
                                        </span>
                                        <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                            {order.timePlaced}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Top Selling Items */}
                        <div
                            className={`lg:w-1/3 px-8 py-6 rounded-xl shadow-sm border 
                            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                        >
                            <h2 className={`text-xl font-semibold pb-1.5 mb-5 border-b 
                                ${darkMode ? "text-white border-gray-600" : "text-gray-800 border-gray-300"}`}
                            >
                                Popular Items
                            </h2>

                            <div className="space-y-4">

                                {mockMenuItems.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center p-3 rounded-xl border hover:border-orange-300 transition-colors cursor-pointer
                                        ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                                    >
                                        {/* Item Image */}
                                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 border border-gray-200">
                                            <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1">
                                            <h3 className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-800"}`}>
                                                {item.name}
                                            </h3>
                                            <div className="flex justify-between items-center pr-2">
                                                <p className="text-xs text-orange-500 font-bold">${item.price.toFixed(2)}</p>
                                                <p className={`text-[10px] ${item.status === 'AVAILABLE' ? 'text-green-500' : 'text-red-500'}`}>
                                                    ● {item.status.replace('_', ' ')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                                    </div>
                                ))}

                                {/* Add New Item Action */}
                                <div onClick={() => navigation('/foodmenu')}
                                    className={`flex items-center justify-center p-4 rounded-xl border-2 border-dashed cursor-pointer
                                    ${darkMode ? "border-gray-700 hover:border-orange-500 text-gray-400" : "border-gray-300 hover:border-orange-500 text-gray-500"}`}
                                >
                                    <i className="fa-solid fa-plus mr-2"></i>
                                    <span className="font-medium">Add Menu Item</span>
                                </div>
                                
                            </div>
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default Home;