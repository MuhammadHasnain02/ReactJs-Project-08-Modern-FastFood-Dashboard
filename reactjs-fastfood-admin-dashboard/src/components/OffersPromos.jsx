import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { mockPromotions } from '../data/dashboardData'

const CustomConfirm = ({ message, onConfirm, onCancel }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    
    const bgClass = darkMode ? "bg-gray-800" : "bg-white";
    const textPrimary = darkMode ? "text-white" : "text-gray-900";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] bg-opacity-10 z-50 flex justify-center items-center p-4">
            <div className={`p-6 rounded-xl shadow-2xl max-w-sm w-full ${bgClass}`}>
                <p className={`text-lg font-semibold mb-6 ${textPrimary}`}>{message}</p>
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onCancel} 
                        className={`px-4 py-2 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const CreatePromoForm = ({ onSave, onCancel }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const [formData, setFormData] = useState({
        code: '',
        type: 'PERCENTAGE',
        value: '',
        startDate: '',
        endDate: '',
        minOrder: '',
        isFirstTimeUser: false,
    });

    const bgClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
    const inputClass = darkMode 
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-500" 
        : "bg-white border-gray-300 text-gray-900 focus:ring-amber-500";
    const labelClass = darkMode ? "text-gray-300" : "text-gray-700";

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] bg-opacity-10 z-50 flex justify-center items-center p-4">
            <div className={`p-6 rounded-xl shadow-2xl w-full max-w-lg ${bgClass} transition-all duration-500 scale-100 overflow-y-auto max-h-[90vh]`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center">
                        <i className="fa-solid fa-tag mr-2 text-purple-600"></i> Create New Promo
                    </h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-times text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Code & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Code Name</label>
                            <input 
                                type="text" name="code" value={formData.code} onChange={handleChange} required 
                                placeholder="e.g. SAVE20"
                                className={`w-full py-2 px-3 border rounded-lg uppercase ${inputClass}`} 
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Discount Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className={`w-full py-2 px-3 border rounded-lg ${inputClass}`}>
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FLAT">Flat Amount ($)</option>
                            </select>
                        </div>
                    </div>

                    {/* Value & Min Order */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Discount Value</label>
                            <input 
                                type="number" name="value" value={formData.value} onChange={handleChange} required min="0" step="0.01"
                                placeholder={formData.type === 'PERCENTAGE' ? '15' : '5.00'}
                                className={`w-full py-2 px-3 border rounded-lg ${inputClass}`} 
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Min. Order ($)</label>
                            <input 
                                type="number" name="minOrder" value={formData.minOrder} onChange={handleChange} min="0" step="0.01"
                                placeholder="0.00"
                                className={`w-full py-2 px-3 border rounded-lg ${inputClass}`} 
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Start Date</label>
                            <input 
                                type="date" name="startDate" value={formData.startDate} onChange={handleChange} required 
                                className={`w-full py-2 px-3 border rounded-lg ${inputClass}`} 
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${labelClass}`}>End Date</label>
                            <input 
                                type="date" name="endDate" value={formData.endDate} onChange={handleChange} required 
                                className={`w-full py-2 px-3 border rounded-lg ${inputClass}`} 
                            />
                        </div>
                    </div>

                    {/* Conditions */}
                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                        <h3 className={`text-sm font-bold mb-2 ${labelClass}`}>Conditions</h3>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="checkbox" name="isFirstTimeUser" checked={formData.isFirstTimeUser} onChange={handleChange} 
                                className="form-checkbox h-5 w-5 text-amber-500 rounded focus:ring-amber-500"
                            />
                            <span className={`text-sm ${labelClass}`}>Valid for First-Time Users Only</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            type="button" onClick={onCancel} 
                            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 rounded-lg font-semibold text-white bg-purple-700 hover:bg-purple-800 cursor-pointer shadow-md transition-colors"
                        >
                            <i className="fa-solid fa-check mr-2"></i> Create Promo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function OffersPromos() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // State for custom confirmation

    // Dynamic classes
    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-800";
    const tableHeaderClass = darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500";
    const tableRowClass = darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50";

    useEffect(() => {
        // Simulate initial data load
        const timer = setTimeout(() => {
            setPromotions(mockPromotions);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSavePromo = (newPromo) => {
        // Calculate status simply based on dates for this demo
        const now = new Date();
        const start = new Date(newPromo.startDate);
        const end = new Date(newPromo.endDate);
        
        let status = 'ACTIVE';
        if (now < start) status = 'SCHEDULED';
        if (now > end) status = 'EXPIRED';

        const promoWithId = {
            ...newPromo,
            id: `P-${Date.now()}`,
            usage: 0,
            status: status,
            value: parseFloat(newPromo.value),
            minOrder: parseFloat(newPromo.minOrder) || 0, // Default to 0 if empty
            isFirstTimeUser: newPromo.isFirstTimeUser
        };

        setPromotions(prev => [promoWithId, ...prev]);
        setIsFormOpen(false);
    };

    const handleDeleteClick = (id) => {
        setConfirmDeleteId(id);
    };

    const handleConfirmDelete = () => {
        setPromotions(prev => prev.filter(p => p.id !== confirmDeleteId));
        setConfirmDeleteId(null);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'ACTIVE': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</span>;
            case 'SCHEDULED': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scheduled</span>;
            case 'EXPIRED': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Expired</span>;
            default: return null;
        }
    };

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-500 ${bgClass}`}>
            
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <i className="fa-solid fa-tags w-7 h-7 mr-3 text-purple-600"></i> Offers & Promotions
                </h1>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 cursor-pointer transition-colors flex items-center"
                    >
                        <i className="fa-solid fa-plus mr-2"></i> Create New Promo
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#9333EA"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <div>
                    {/* Promotions Table */}
                    <div className={`overflow-x-auto rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className={tableHeaderClass}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Usage</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                {promotions.map((promo) => (
                                    <tr key={promo.id} className={tableRowClass}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-bold text-lg text-purple-500 dark:text-purple-500">{promo.code}</span>
                                            {(promo.minOrder > 0 || promo.isFirstTimeUser) && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {promo.minOrder > 0 && <span>Min Order: ${promo.minOrder.toFixed(2)}</span>}
                                                    {promo.isFirstTimeUser && <span className="ml-2 font-medium text-red-400"> (New User Only)</span>}
                                                </p>
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${textPrimary}`}>
                                            {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `$${promo.value.toFixed(2)} FLAT OFF`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col">
                                                <span><i className="fa-solid fa-calendar-check mr-1 text-green-500"></i> {promo.startDate}</span>
                                                <span><i className="fa-solid fa-calendar-xmark mr-1 text-red-500"></i> {promo.endDate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(promo.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center">
                                                <i className="fa-solid fa-users mr-2 text-indigo-400"></i>
                                                <span className={`font-semibold ${textPrimary}`}>{promo.usage}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button 
                                                onClick={() => handleDeleteClick(promo.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                title="Delete Promotion"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {promotions.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No promotions found. Create one to get started!</div>
                        )}
                    </div>
        
                    {/* Create Promo Modal */}
                    {isFormOpen && (
                        <CreatePromoForm 
                            onSave={handleSavePromo} 
                            onCancel={() => setIsFormOpen(false)}
                            darkMode={darkMode}
                        />
                    )}
                    
                    {/* Custom Delete Confirmation Modal (Replaces alert/confirm) */}
                    {confirmDeleteId && (
                        <CustomConfirm
                            message="Are you sure you want to permanently delete this promotion?"
                            onConfirm={handleConfirmDelete}
                            onCancel={() => setConfirmDeleteId(null)}
                            darkMode={darkMode}
                        />
                    )}
                </div>
            )}

        </div>
    );
}

// --- Main App Wrapper (for running in single file environment) ---
function App() {
    return (
        <div className="flex min-h-screen">
            <div className="flex-1 sm:ml-20 md:ml-62">
                <OffersPromos />
            </div>
        </div>
    );
}

export default App;