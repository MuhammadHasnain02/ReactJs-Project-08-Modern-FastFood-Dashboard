import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { mockInventoryData } from '../data/dashboardData'

const getStockClass = (stock, reorderPoint) => {

    if (stock <= reorderPoint) {
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 font-bold';
    }
    if (stock <= reorderPoint * 2) {
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';

};

const AlertsCard = ({ lowStockItems, onReceiveStock }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const cardBg = darkMode ? "bg-red-800/20 border-red-700" : "bg-red-50 border-red-300";
    const textPrimary = darkMode ? "text-red-400" : "text-red-700";
    const itemBg = darkMode ? "bg-gray-800/50" : "bg-white";

    return (
        <div className={`p-4 rounded-xl shadow-lg border-2 border-dashed transition-all duration-500 ${cardBg}`}>
            <h2 className={`text-xl font-bold mb-3 flex items-center ${textPrimary}`}>
                <i className="fa-solid fa-triangle-exclamation mr-2"></i> Low Stock Alerts ({lowStockItems.length})
            </h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {lowStockItems.length > 0 ? (
                    lowStockItems.map(item => (
                        <div key={item.id} className={`p-3 rounded-lg shadow-sm border ${itemBg} ${darkMode ? 'border-red-700' : 'border-red-200'} flex justify-between items-center`}>
                            <div>
                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                                <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                                    <i className="fa-solid fa-arrow-down mr-1"></i> Critical: {item.stock} {item.unit}
                                </p>
                            </div>
                            <button
                                onClick={() => onReceiveStock(item)}
                                className="text-xs px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                                <i className="fa-solid fa-truck-loading mr-1"></i> Receive
                            </button>
                        </div>
                    ))
                ) : (
                    <p className={`text-center py-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <i className="fa-solid fa-check-circle text-2xl mb-2 text-green-500"></i><br/>
                        All stock levels are currently healthy.
                    </p>
                )}
            </div>
        </div>
    );
};

const ReceiveStockForm = ({ item, onUpdate, onCancel }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const [amount, setAmount] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const inputClass = darkMode 
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";
    const formBg = darkMode ? "bg-gray-800" : "bg-white";

    const handleSubmit = (e) => {
        e.preventDefault();
        const quantity = parseFloat(amount);
        if (isNaN(quantity) || quantity <= 0) {
            console.error("Invalid amount entered.");
            return;
        }

        setIsSaving(true);
        // Simulate API call delay
        setTimeout(() => {
            onUpdate(item.id, quantity);
            setIsSaving(false);
            onCancel();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className={`p-6 rounded-xl shadow-2xl w-full max-w-sm ${formBg} transition-all duration-500 transform scale-100`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Receive Stock: {item.name}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Current Stock: <span className="font-semibold">{item.stock} {item.unit}</span>
                    </p>
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Quantity Received ({item.unit})
                        </label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                            step="any" 
                            min="0.01"
                            placeholder={`Enter quantity of ${item.unit}`}
                            className={`w-full py-2 px-3 border rounded-lg ${inputClass}`}
                            disabled={isSaving}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            disabled={isSaving}
                            className={`px-4 py-2 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            <i className="fa-solid fa-xmark mr-2"></i> Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            {isSaving ? (
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            ) : (
                                <i className="fa-solid fa-box-open mr-2"></i>
                            )}
                            Update Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function Inventory() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState(null);

    // Dynamic classes
    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-800";
    const tableHeaderClass = darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500";
    const tableRowClass = darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50";

    // 1. useEffect for initial data load
    useEffect(() => {
        console.log("Fetching inventory data...");
        const timer = setTimeout(() => {
            setInventory(mockInventoryData);
            setIsLoading(false);
            console.log("Inventory data loaded.");
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Memoized list of low-stock items
    const lowStockItems = useMemo(() => {
        return inventory.filter(item => item.stock <= item.reorderPoint);
    }, [inventory]);
    
    // Handlers
    const handleReceiveStock = (item) => {
        setItemToUpdate(item);
        setIsFormOpen(true);
    };

    const handleUpdateStock = (id, quantityReceived) => {
        setInventory(prev => 
            prev.map(item => 
                item.id === id ? { ...item, stock: item.stock + quantityReceived } : item
            )
        );
        console.log(`Inventory for ${id} updated by +${quantityReceived}`);
    };
    
    const handleCancelForm = () => {
        setIsFormOpen(false);
        setItemToUpdate(null);
    };

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-500 ${bgClass}`}>
            
            {/* Header and Dark Mode Toggle */}
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <i className="fa-solid fa-boxes w-7 h-7 mr-3 text-amber-600"></i> Inventory Stock Management
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

                    {/* Layout: Alerts Card (1/3 width) and Stock Table (2/3 width) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 1. Low Stock Alerts Card (Col 1) */}
                        <div className="lg:col-span-1">
                            <AlertsCard 
                                lowStockItems={lowStockItems} 
                                onReceiveStock={handleReceiveStock}
                            />
                        </div>

                        {/* 2. Stock Level Table (Cols 2-3) */}
                        <div className="lg:col-span-2">
                            <div className={`p-4 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <h3 className={`text-xl font-bold mb-4 ${textPrimary}`}>All Ingredients</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className={tableHeaderClass}>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Ingredient Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Current Stock</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Unit</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Reorder Point</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                            {inventory.map((item) => (
                                                <tr key={item.id} className={tableRowClass}>
                                                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span 
                                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockClass(item.stock, item.reorderPoint)}`}
                                                        >
                                                            {item.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm">{item.unit}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm">{item.reorderPoint}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                        <button 
                                                            onClick={() => handleReceiveStock(item)}
                                                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                                            title="Receive Stock"
                                                        >
                                                            <i className="fa-solid fa-truck-loading mr-1"></i> Receive
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Receive Stock Modal */}
                    {isFormOpen && itemToUpdate && (
                        <ReceiveStockForm 
                            item={itemToUpdate}
                            onUpdate={handleUpdateStock}
                            onCancel={handleCancelForm}
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
            <Inventory />
        </div>
    );
}

export default App;