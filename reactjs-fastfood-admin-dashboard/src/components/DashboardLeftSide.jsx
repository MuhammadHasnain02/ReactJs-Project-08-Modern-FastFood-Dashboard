import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";


function DashboardLeftSide() {

  const navigation = useNavigate()
  const { darkMode, setDarkMode } = useContext(ThemeContext)

  return (

    <div className={`fixed left-0 top-0 h-screen w-62 border-r flex flex-col py-6 px-4 transition-all duration-400
      ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-gray-50 text-black border-gray-300"}`}>

      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer mb-6 pb-3 border-b border-gray-300"
        onClick={() => navigation('/')}
      >
        <div className="flex flex-row items-center justify-center 
          bg-gradient-to-tr from-green-600 to-emerald-700 rounded-full w-11 h-11 transition ease-in-out duration-500 hover:scale-105 cursor-pointer p-2 shadow-xl"
        >
          <i className="fa-solid fa-utensils text-[18px] text-gray-200"></i>
        </div>

        <span className={`text-xl md:text-[22px] font-extrabold 
          ${darkMode ? "text-white" : "text-gray-700"}
        `}>
          Fast <span className="text-green-600">Food</span>
        </span>
      </div>

      {/* Navigation */}
      <div className="flex flex-col space-y-4">

        {/* Dashboard */}
        <div
          onClick={() => navigation('/')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-chart-bar text-lg"></i>
          Dashboard
        </div>

        {/* Live Orders */}
        <div
          onClick={() => navigation('/liveorders')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-regular fa-bell text-lg"></i>
          Live Orders
        </div>

        {/* Order History */}
        <div
          onClick={() => navigation('/orderhistory')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-history text-lg"></i>
          Order History
        </div>

        {/* Food Menu */}
        <div
          onClick={() => navigation('/foodmenu')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-burger text-lg"></i>
          Food Menu
        </div>

        {/* Inventory */}
        <div
          onClick={() => navigation('/inventory')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-boxes text-lg"></i>
          Inventory
        </div>

        {/* Customers */}
        <div
          onClick={() => navigation('/customers')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-users text-lg"></i>
          Customers
        </div>

        {/* Offers & Promos */}
        <div
          onClick={() => navigation('/offers&promos')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-tags text-lg"></i>
          Offers & Promos
        </div>

        {/* Analytics */}
        <div
          onClick={() => navigation('/analytics')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-chart-bar text-lg"></i>
          Analytics
        </div>

        {/* Team / Staff */}
        <div
          onClick={() => navigation('/team&staff')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-id-card text-lg"></i>
          Team / Staff
        </div>

        {/* Settings */}
        <div
          onClick={() => navigation('/setting')}
          className={`
            flex items-center font-semibold gap-3 p-2 rounded cursor-pointer transition
            ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          <i className="fa-solid fa-gear text-lg"></i>
          Settings
        </div>

      </div>

    </div>

  );
}

export default DashboardLeftSide;
