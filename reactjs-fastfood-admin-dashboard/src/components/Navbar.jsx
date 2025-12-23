import { useContext, useEffect, useRef, useState } from "react"
import { ThemeContext } from "./ThemeContext"

function Navbar() {

    const { darkMode, setDarkMode } = useContext(ThemeContext)
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();
    
    const [notiOpen, setNotiOpen] = useState(false);
    const notiRef = useRef(); // Add a second ref for the notification area

    // Mock user for demonstration - replace with your Auth context if available
    const currentUser = { email: "admin@smashburger.com" };

    const handleLogout = () => {
        console.log("Logging out...");
    };


    // ------------------ Dropdown Handling --------------------
    
    // Profile Dropdown

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Notification Dropdown

    useEffect(() => {
        function handleClickOutside(event) {
            // Close profile dropdown if clicking outside
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
            // Close notification dropdown if clicking outside
            if (notiRef.current && !notiRef.current.contains(event.target)) {
                setNotiOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    return (
        <nav className={`px-6 py-4 z-50 shadow-sm border-b flex items-center justify-between transition-all duration-400
            ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}>

            {/* Left Side */}
            <div className="flex flex-row justify-around space-x-10">

                {/* Hamburger */}
                <button className={`px-2 py-1 rounded-md text-xl cursor-pointer border
                    ${darkMode ? "border-gray-700 text-gray-300 hover:text-white" : "border-gray-200 text-gray-600 hover:text-gray-900"}`}>
                    <i className="fa-solid fa-bars"></i>
                </button>

                {/* Search Box */}
                <div className={`flex items-center rounded-full px-4 py-2.5 w-full border
                    ${darkMode ? "border-gray-700" : "border-gray-300"}`}>

                    <i className={`fa-solid fa-magnifying-glass mr-3 
                        ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    ></i>
                    <input type="text" placeholder="Search or type command..."
                        className={`placeholder:tracking-tight font-medium bg-transparent outline-none text-sm w-100
                        ${darkMode ? "text-white placeholder-gray-400" : "text-black placeholder-gray-500"}`}
                    />

                </div>

            </div>

            {/* Right Side */}
            <div className="flex items-center gap-5 relative">

                {/* Dark Mode Toggle */}
                <button onClick={() => setDarkMode(!darkMode)}
                    className={`cursor-pointer ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} text-xl`}>
                    <i className={`fa-regular fa-${darkMode ? "sun" : "moon"}`}></i>
                </button>

                {/* Notification Icon Container */}
                <div className="relative" ref={notiRef}>

                    {/* NOTIFICATION Toggle */}
                    <button 
                        onClick={() => setNotiOpen(!notiOpen)}
                        className={`relative text-xl cursor-pointer transition-colors
                        ${darkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-600"}`}>
                        <i className="fa-regular fa-bell"></i>
                        {/* Red Dot Badge */}
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                    </button>

                    {/* ==== NOTIFICATION DROPDOWN ==== */}
                    <div className={`absolute right-0 top-full mt-4 w-80 rounded-2xl border shadow-2xl transition-all duration-300 origin-top-right z-[60]
                        ${notiOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                        ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
                        
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-sm">Notifications</h3>
                            <span className="text-[10px] text-orange-500 font-bold uppercase cursor-pointer hover:underline">Mark all as read</span>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {/* Notification Item 1 (New Order) */}
                            <div className={`p-4 flex gap-3 border-b transition-colors cursor-pointer ${darkMode ? "hover:bg-gray-800 border-gray-800" : "hover:bg-gray-50 border-gray-50"}`}>
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                                    <i className="fa-solid fa-utensils"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">New Order Received!</p>
                                    <p className="text-xs text-gray-500">Alice Johnson ordered a Smash Burger.</p>
                                    <p className="text-[10px] text-orange-400 mt-1">2 mins ago</p>
                                </div>
                            </div>

                            {/* Notification Item 2 (Stock Alert) */}
                            <div className={`p-4 flex gap-3 border-b transition-colors cursor-pointer ${darkMode ? "hover:bg-gray-800 border-gray-800" : "hover:bg-gray-50 border-gray-50"}`}>
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Low Stock Alert</p>
                                    <p className="text-xs text-gray-500">"Chocolate Milkshake" is nearly sold out.</p>
                                    <p className="text-[10px] text-gray-400 mt-1">15 mins ago</p>
                                </div>
                            </div>

                            {/* Notification Item 3 (System) */}
                            <div className={`p-4 flex gap-3 transition-colors cursor-pointer ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <i className="fa-solid fa-circle-check"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Payout Successful</p>
                                    <p className="text-xs text-gray-500">Weekly earnings have been sent to bank.</p>
                                    <p className="text-[10px] text-gray-400 mt-1">1 hour ago</p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-3 text-center border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                            <button className="text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">
                                View all activity
                            </button>
                        </div>
                    </div>

                </div>

                {/* Profile Icon Container */}
                <div className="relative" ref={dropdownRef}>

                    {/* Profile Toggle */}
                    <div onClick={() => setOpen(!open)}
                        className={`flex items-center gap-3 pl-3 py-1 rounded-full cursor-pointer transition-all
                        ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                            {currentUser.email.charAt(0).toUpperCase()}
                        </div>
                        <p className={`hidden sm:block ${darkMode ? "text-gray-200" : "text-gray-800"} font-medium text-sm`}>
                            Admin Panel
                        </p>
                        <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${open ? "rotate-180" : ""}`}></i>
                    </div>

                    {/* ==== DROPDOWN BOX ==== */}
                    <div className={`absolute right-0 top-full mt-3 w-64 rounded-xl py-2 z-50 transition-all duration-200 border shadow-2xl origin-top-right
                        ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                        ${darkMode ? "bg-gray-900 border-gray-700 shadow-black" : "bg-white border-gray-200 shadow-gray-200"}`}>

                        {/* Top User Info */}
                        <div className={`flex items-center gap-3 px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            <i className="fa-solid fa-user-tie"></i>
                            </div>
                            <div className="overflow-hidden">
                                <p className={`font-semibold text-sm truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                    {currentUser.email.split("@")[0]}
                                </p>
                                <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {currentUser.email}
                                </p>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <div className={`py-2 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                            {[
                                ["Store Profile", "fa-regular fa-id-card"],
                                ["Order History", "fa-solid fa-clock-rotate-left"],
                                ["Staff Settings", "fa-solid fa-users-gear"],
                                ["Billing", "fa-solid fa-receipt"],
                            ].map(([name, icon]) => (
                                <button key={name}
                                    className={`flex items-center gap-3 px-4 py-2.5 w-full text-left cursor-pointer transition-colors text-sm
                                        ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"}`}>
                                    <i className={`${icon} w-5`}></i>
                                    <span className='font-medium'>{name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 px-4 py-3 w-full text-left transition text-sm font-bold cursor-pointer
                                ${darkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"}`}
                        >
                            <i className="fa-solid fa-arrow-right-from-bracket w-5"></i> Sign out
                        </button>
                    </div>

                </div>

            </div>

        </nav>

    )

}


export default Navbar