import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { mockInitialSettings  } from '../data/dashboardData'

// Custom Alert/Confirmation Modal (reused from previous files)
const CustomModal = ({ title, message, isOpen, onConfirm, onCancel, type = 'info' }) => {
    
    if (!isOpen) return null;

    const colorClass = {
        info: 'bg-indigo-600 hover:bg-indigo-700',
        success: 'bg-green-600 hover:bg-green-700',
        danger: 'bg-red-600 hover:bg-red-700',
        confirm: 'bg-amber-600 hover:bg-amber-700'
    }[type];

    const confirmText = type === 'confirm' ? 'Confirm' : 'OK';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white border-b pb-2">{title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                    <div className="flex justify-end space-x-3">
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        )}
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md ${colorClass} transition`}
                            >
                                {confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SETTINGS PAGE COMPONENT ---

function SettingsPage({ userId }) {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    const [isLoading, setIsLoading] = useState(true);
    
    const [settings, setSettings] = useState(mockInitialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [alert, setAlert] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-800";
    const cardClass = darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
    const inputClass = "w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500 transition duration-150";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); 

        return () => clearTimeout(timer);
    }, []);

    const handleChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call to save settings
        setTimeout(() => {
            setIsSaving(false);
            // In a real app, this is where you'd call a Firestore setDoc or updateDoc.
            console.log("Settings saved:", settings);
            setAlert({ 
                isOpen: true, 
                title: "Configuration Saved", 
                message: "All application settings have been successfully updated.", 
                type: 'success', 
                onConfirm: () => setAlert({ ...alert, isOpen: false })
            });
        }, 1000); 
    };

    const SettingCard = ({ title, icon, children }) => (
        <div className={`p-7 rounded-xl shadow-lg border ${cardClass} flex flex-col h-full`}>

            <div className="flex items-center mb-4 border-b pb-3 border-gray-700/50">
                <i className={`${icon} w-6 h-6 mr-3 text-gray-600`}></i>
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            <div className="space-y-4 flex-grow">
                {children}
            </div>
            
        </div>
    );

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-300 ${bgClass}`}>
            
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
                
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-500">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.07a2 2 0 0 1 0-2.73l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    System Settings
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">User ID: {userId.substring(0, 8)}...</span>
                
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#6B7280"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <div>
                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        
                        {/* 1. Store Information */}
                        <SettingCard title="Store Information" icon="fa-solid fa-store">
                            <div>
                                <label className="block text-sm font-medium mb-1">Location Address</label>
                                <input
                                    type="text"
                                    value={settings.store.location}
                                    onChange={(e) => handleChange('store', 'location', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={settings.store.phone}
                                    onChange={(e) => handleChange('store', 'phone', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Operating Hours</label>
                                <textarea
                                    value={settings.store.operatingHours}
                                    onChange={(e) => handleChange('store', 'operatingHours', e.target.value)}
                                    className={`${inputClass} resize-none h-20`}
                                    placeholder="e.g., Mon-Fri: 9am-5pm"
                                />
                            </div>
                        </SettingCard>

                        {/* 2. Tax Rates Management */}
                        <SettingCard title="Tax Rates Management" icon="fa-solid fa-percent">
                            <div>
                                <label className="block text-sm font-medium mb-1">Local Sales Tax (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={settings.taxes.localSalesTax}
                                    onChange={(e) => handleChange('taxes', 'localSalesTax', parseFloat(e.target.value))}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tax ID / VAT Number</label>
                                <input
                                    type="text"
                                    value={settings.taxes.taxId}
                                    onChange={(e) => handleChange('taxes', 'taxId', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g., TX-123456789"
                                />
                            </div>
                            <div className="p-3 bg-indigo-50 dark:bg-gray-700/50 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
                                Tax is applied automatically to all sales transactions.
                            </div>
                        </SettingCard>
                        
                        {/* 3. Payment Gateway Setup */}
                        <SettingCard title="Payment Gateway Setup" icon="fa-brands fa-cc-stripe">
                            <div className="space-y-4">
                                <div className="p-[11px] rounded-lg text-gray-600 bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-sm">
                                    Warning: API Keys grant full access to your funds. Handle with care.
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stripe Secret Key</label>
                                    <input
                                        type="password"
                                        value={settings.payment.stripeApiKey}
                                        onChange={(e) => handleChange('payment', 'stripeApiKey', e.target.value)}
                                        className={inputClass}
                                        placeholder="sk_live_..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">PayPal Client ID</label>
                                    <input
                                        type="password"
                                        value={settings.payment.paypalClientId}
                                        onChange={(e) => handleChange('payment', 'paypalClientId', e.target.value)}
                                        className={inputClass}
                                        placeholder="AZX-..."
                                    />
                                </div>
                            </div>
                        </SettingCard>

                        {/* 4. Printer Configuration */}
                        <SettingCard title="Printer Configuration" icon="fa-solid fa-print">
                            <div>
                                <label className="block text-sm font-medium mb-1">Kitchen Printer IP Address</label>
                                <input
                                    type="text"
                                    value={settings.printer.kitchenPrinterIP}
                                    onChange={(e) => handleChange('printer', 'kitchenPrinterIP', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g., 192.168.1.101"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Receipt Printer IP Address</label>
                                <input
                                    type="text"
                                    value={settings.printer.receiptPrinterIP}
                                    onChange={(e) => handleChange('printer', 'receiptPrinterIP', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g., 192.168.1.102"
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <button
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition"
                                    disabled={isSaving}
                                    onClick={() => { /* Placeholder for testing connection */ }}
                                >
                                    <i className="fa-solid fa-plug mr-2"></i> Test Connection
                                </button>
                            </div>
                        </SettingCard>

                    </div>

                    {/* Save Button - Fixed Footer-like position for easy access */}
                    <div className="flex justify-center border-t border-gray-200 dark:border-gray-700 pt-5 pb-15">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full max-w-lg px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Configuration...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                    Save All Settings
                                </>
                            )}
                        </button>
                    </div>
                    
                    {/* Alert Modal */}
                    <CustomModal
                        title={alert.title} 
                        message={alert.message} 
                        isOpen={alert.isOpen} 
                        type={alert.type} 
                        onConfirm={alert.onConfirm}
                    />
                </div>
            )}


        </div>
    );
}

// Wrapper component to provide context and run the page
export default function App() {
    return (
        <div className="flex-1 sm:ml-20 md:ml-62">
            <SettingsPage userId="admin-user-001" />
        </div>
    );
}