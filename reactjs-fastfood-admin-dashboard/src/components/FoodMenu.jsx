import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { mockMenuItems } from '../data/dashboardData'

const StatusToggle = ({ item, onToggle }) => {
    const isAvailable = item.status === 'AVAILABLE';
    const buttonClass = isAvailable 
        ? 'bg-green-600 hover:bg-green-700' 
        : 'bg-red-600 hover:bg-red-700';

    return (
        <button
            onClick={() => onToggle(item.id, isAvailable ? 'SOLD_OUT' : 'AVAILABLE')}
            className={`w-full py-2 text-sm font-semibold text-white rounded-b-xl transition-colors duration-500 ${buttonClass}`}
            title={isAvailable ? 'Click to mark Sold Out' : 'Click to mark Available'}
        >
            <i className={`fa-solid ${isAvailable ? 'fa-check' : 'fa-times-circle'} mr-2`}></i>
            {isAvailable ? 'Available' : 'Sold Out'}
        </button>
    );
};

const MenuItemCard = ({ item, onToggle, onEdit }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const cardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
    const textPrimary = darkMode ? "text-white" : "text-gray-900";
    const textSecondary = darkMode ? "text-gray-400" : "text-gray-500";
    
    const statusOverlay = item.status === 'SOLD_OUT' 
        ? 'absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white rounded-t-xl' 
        : 'hidden';

    return (
        <div className={`rounded-xl shadow-lg border overflow-hidden transition-all duration-500 transform hover:shadow-2xl ${cardBg}`}>
            {/* Image and Sold Out Overlay */}
            <div className="relative h-40 w-full overflow-hidden">
                <img 
                    src={item.imgUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                        // Fallback image in case the placeholder fails
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/400x300/6B7280/D1D5DB?text=No+Image";
                    }}
                />
                <div className={statusOverlay}>
                    <i className="fa-solid fa-ban text-6xl mb-2 text-red-500"></i>
                    <p className="text-2xl font-bold">SOLD OUT</p>
                    <p className="text-sm">Quickly toggle below to restock.</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className={`text-xl font-bold ${textPrimary} truncate`}>{item.name}</h3>
                <div className="flex justify-between items-center text-sm">
                    <p className={`${textPrimary} font-extrabold text-2xl text-red-500`}>
                        ${item.price.toFixed(2)}
                    </p>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${textSecondary} bg-gray-100 dark:bg-gray-700`}>
                        {item.category}
                    </span>
                </div>
                
                {/* Actions */}
                <div className="pt-2 flex space-x-2">
                    <button
                        onClick={() => onEdit(item)}
                        className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-lg transition-colors duration-500 
                                   ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
                        title="Edit Item Details"
                    >
                        <i className="fa-solid fa-pen-to-square mr-2"></i> Edit
                    </button>
                </div>
            </div>
            
            {/* Status Toggle (Bottom bar) */}
            <StatusToggle item={item} onToggle={onToggle} />
        </div>
    );
};

const ItemForm = ({ itemToEdit, onSave, onCancel }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const [formData, setFormData] = useState(itemToEdit || { name: '', price: '', category: '', imgUrl: '', status: 'AVAILABLE' });
    const isEditMode = !!itemToEdit;

    const inputClass = darkMode 
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";
    const formBg = darkMode ? "bg-gray-800" : "bg-white";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className={`p-6 rounded-xl shadow-2xl w-full max-w-md ${formBg} transition-all duration-500 transform scale-100`}>
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={`w-full py-2 px-3 border rounded-lg ${inputClass}`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className={`w-full py-2 px-3 border rounded-lg ${inputClass}`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required className={`w-full py-2 px-3 border rounded-lg ${inputClass}`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Image URL (Placeholder)</label>
                        <input type="text" name="imgUrl" value={formData.imgUrl} onChange={handleChange} className={`w-full py-2 px-3 border rounded-lg ${inputClass}`} />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className={`px-4 py-2 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            <i className="fa-solid fa-ban mr-2"></i> Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                            <i className="fa-solid fa-floppy-disk mr-2"></i> {isEditMode ? 'Save Changes' : 'Create Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function FoodMenu() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    // Dynamic classes
    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-700";
    const cardBgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

    // 1. useEffect for initial data load
    useEffect(() => {
        console.log("Fetching menu data...");
        const timer = setTimeout(() => {
            setMenuItems(mockMenuItems);
            setIsLoading(false);
            console.log("Menu data loaded.");
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Handlers
    const handleToggleStatus = (id, newStatus) => {
        setMenuItems(prev => 
            prev.map(item => 
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
        console.log(`Item ${id} status changed to: ${newStatus}`);
    };

    const handleOpenAddForm = () => {
        setItemToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditItem = (item) => {
        setItemToEdit(item);
        setIsFormOpen(true);
    };
    
    const handleCancelForm = () => {
        setIsFormOpen(false);
        setItemToEdit(null);
    };

    const handleSaveItem = (formData) => {
        if (itemToEdit) {
            // Edit existing item
            setMenuItems(prev => prev.map(item => 
                item.id === itemToEdit.id ? { ...item, ...formData, price: parseFloat(formData.price) } : item
            ));
            console.log("Item updated:", formData.name);
        } else {
            // Add new item
            const newId = `M-${(menuItems.length + 101).toString().slice(-3)}`;
            const newItem = { 
                ...formData, 
                id: newId, 
                price: parseFloat(formData.price),
                status: 'AVAILABLE' // New items are always available
            };
            setMenuItems(prev => [newItem, ...prev]);
            console.log("New item added:", newItem.name);
        }
        setIsFormOpen(false);
        setItemToEdit(null);
    };

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-500 ${bgClass}`}>
            
            {/* Header, Add Button, and Dark Mode Toggle */}
            <div className="flex flex-wrap justify-between items-center border-b pb-4 border-gray-300 dark:border-gray-700">
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <i className="fa-solid fa-utensil-spoon w-7 h-7 mr-3 text-orange-500"></i> Food Menu Management
                </h1>
                <button
                    onClick={handleOpenAddForm}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                    <i className="fa-solid fa-plus mr-2"></i> Add New Item
                </button>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#F97316"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <div>

                    {/* Menu Items Grid - Responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-6 mb-15">
                        {menuItems.map(item => (
                            <MenuItemCard 
                                key={item.id} 
                                item={item} 
                                onToggle={handleToggleStatus} 
                                onEdit={handleEditItem}
                                darkMode={darkMode}
                            />
                        ))}
                    </div>

                    {/* Simulated Add/Edit Form */}
                    {isFormOpen && (
                        <ItemForm 
                            itemToEdit={itemToEdit}
                            onSave={handleSaveItem}
                            onCancel={handleCancelForm}
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
            <FoodMenu />
        </div>
    );
}

export default App;