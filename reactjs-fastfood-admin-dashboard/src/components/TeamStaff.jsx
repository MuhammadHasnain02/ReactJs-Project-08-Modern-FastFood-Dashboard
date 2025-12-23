import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { RotatingLines } from "react-loader-spinner";

// ========= Data =========
import { PERMISSIONS , MOCK_ROLES , MOCK_STAFF } from '../data/dashboardData'

// Fallback for generating unique IDs when not using Firestore
const generateId = () => crypto.randomUUID();

// Custom Alert Component (to replace window.alert)

const CustomAlert = ({ message, type, onClose }) => {
    const colorClass = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl z-[100] transition-all transform duration-300 ${colorClass} text-white`}>
            <div className="flex items-center">
                <i className={`fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} mr-2`}></i>
                {message}
                <button onClick={onClose} className="ml-4 font-bold text-lg leading-none">&times;</button>
            </div>
        </div>
    );
};

// Form for adding/editing a staff member

const StaffFormModal = ({ staffMember, roles, setStaff, onClose }) => {

    const [name, setName] = useState(staffMember?.name || '');
    const [email, setEmail] = useState(staffMember?.email || '');
    const [roleId, setRoleId] = useState(staffMember?.roleId || roles[0]?.id || '');
    const [isLoading, setIsLoading] = useState(false);

    const isEdit = !!staffMember;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !roleId) {
            window.alert("Please fill out all fields.", 'error');
            return;
        }

        setIsLoading(true);
        try {
            const staffData = {
                name: name.trim(),
                email: email.trim(),
                roleId: roleId,
            };

            setStaff(prevStaff => {
                if (isEdit) {
                    // Update existing staff member
                    return prevStaff.map(s => s.id === staffMember.id ? { ...s, ...staffData } : s);
                } else {
                    // Add new staff member
                    const newStaff = { ...staffData, id: generateId() };
                    return [...prevStaff, newStaff];
                }
            });

            window.alert(`Staff member ${name} ${isEdit ? 'updated' : 'added'} successfully.`, 'success');
            onClose();
        } catch (error) {
            console.error("Error saving staff member:", error);
            window.alert(`Failed to save staff member: ${error.message}`, 'error');
        } finally {
            // Simulate network delay
            setTimeout(() => setIsLoading(false), 300);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg mx-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500"
                            required
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition duration-150"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-150 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            ) : (
                                <i className={`fa-solid ${isEdit ? 'fa-save' : 'fa-user-plus'} mr-2`}></i>
                            )}
                            {isEdit ? (isLoading ? 'Saving...' : 'Save Changes') : (isLoading ? 'Adding...' : 'Add Staff')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Haider@Ali11011
// @DLSHaider11011

/**
 * Role Management Section
 */
const RoleManagement = ({ roles, setRoles }) => {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [editingRole, setEditingRole] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (editingRole) {
            setNewRoleName(editingRole.name);
            setNewRoleDescription(editingRole.description);
            setSelectedPermissions(editingRole.access);
        } else {
            setNewRoleName('');
            setNewRoleDescription('');
            setSelectedPermissions([]);
        }
    }, [editingRole]);

    const handlePermissionToggle = (permission) => {
        setSelectedPermissions(prev => 
            prev.includes(permission) 
                ? prev.filter(p => p !== permission) 
                : [...prev, permission]
        );
    };

    const handleSaveRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) {
            window.alert("Role name cannot be empty.", 'error');
            return;
        }

        setIsLoading(true);
        try {
            const roleData = {
                name: newRoleName.trim(),
                description: newRoleDescription.trim(),
                access: selectedPermissions.sort(),
            };

            setRoles(prevRoles => {
                if (editingRole) {
                    // Update existing role
                    return prevRoles.map(r => r.id === editingRole.id ? { ...r, ...roleData } : r);
                } else {
                    // Create new role
                    const newRole = { ...roleData, id: generateId() };
                    return [...prevRoles, newRole];
                }
            });

            window.alert(`Role "${newRoleName}" ${editingRole ? 'updated' : 'created'} successfully.`, 'success');
            setEditingRole(null);
        } catch (error) {
            console.error("Error saving role:", error);
            window.alert(`Failed to save role: ${error.message}`, 'error');
        } finally {
            // Simulate network delay
            setTimeout(() => setIsLoading(false), 300);
        }
    };
    
    const handleDeleteRole = (role) => {
        // Simple confirmation replacement
        const confirmation = window.confirm(`Are you sure you want to delete the role: ${role.name}? This cannot be undone.`);

        if (confirmation) {
             setRoles(prevRoles => prevRoles.filter(r => r.id !== role.id));
             window.alert(`Role "${role.name}" deleted successfully.`, 'success');
        }
    };

    const cardClass = darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
    const inputClass = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className={`p-5 rounded-xl shadow-lg border ${cardClass}`}>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
                <i className="fa-solid fa-user-shield mr-2 text-indigo-500"></i> Role & Access Management
            </h3>

            {/* Role List */}
            <div className="mb-8">
                <h4 className="text-lg font-medium mb-3 border-b pb-2">Existing Roles</h4>
                <div className="space-y-3">
                    
                    {roles.map(role => (
                        <div key={role.id} className="flex justify-between items-center p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <div>
                                <p className="font-semibold">{role.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Permissions: {role.access?.length || 0}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setEditingRole(role)}
                                    className="text-sm px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteRole(role)}
                                    className="text-sm px-3 py-1 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Add/Edit Role Form */}
            <form onSubmit={handleSaveRole} className="p-4 border rounded-lg dark:border-gray-700">
                <h4 className="text-lg font-medium mb-4">{editingRole ? `Editing Role: ${editingRole.name}` : 'Create New Role'}</h4>
                
                <div className="space-y-3 mb-4">
                    <div>
                        <label className={labelClass}>Role Name</label>
                        <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} className={inputClass} required />
                    </div>
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} className={`${inputClass} h-20`}></textarea>
                    </div>
                </div>

                <div className="mb-4">
                    <p className={labelClass}>Define Access Levels</p>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        {PERMISSIONS.map(permission => (
                            <label key={permission} className="flex items-center space-x-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedPermissions.includes(permission)}
                                    onChange={() => handlePermissionToggle(permission)}
                                    className="rounded text-amber-500 focus:ring-amber-500 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <span className="dark:text-gray-300">{permission}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    {editingRole && (
                        <button
                            type="button"
                            onClick={() => setEditingRole(null)}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition duration-150"
                            disabled={isLoading}
                        >
                            Cancel Edit
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition duration-150 flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        ) : (
                            <i className="fa-solid fa-save mr-2"></i>
                        )}
                        {isLoading ? 'Saving...' : (editingRole ? 'Update Role' : 'Create Role')}
                    </button>
                </div>
            </form>
            
        </div>
    );
};


/**
 * Core Team Staff Component
 */
function TeamStaffPage({ userId, staff, roles, setStaff, setRoles }) {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const bgClass = darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
    const textPrimary = darkMode ? "text-white" : "text-gray-800";
    const cardClass = darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';

    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); 

        return () => clearTimeout(timer);
    }, []);

    const getRoleName = useCallback((roleId) => {
        return roles.find(r => r.id === roleId)?.name || 'Unknown Role';
    }, [roles]);

    const getRolePermissions = useCallback((roleId) => {
        return roles.find(r => r.id === roleId)?.access || [];
    }, [roles]);

    const handleAddStaff = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    const handleEditStaff = (staff) => {
        setEditingStaff(staff);
        setIsModalOpen(true);
    };

    const handleDeleteStaff = (staffMember) => {
        // Simple confirmation replacement
        if (!window.confirm(`Are you sure you want to remove ${staffMember.name} from the staff list?`)) return;

        setStaff(prevStaff => prevStaff.filter(s => s.id !== staffMember.id));
        window.alert(`${staffMember.name} has been removed.`, 'success');
    };
    
    // Filtered staff list logic
    const filteredStaff = staff.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRoleName(member.roleId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-all duration-300 ${bgClass}`}>
            
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
                <h1 className={`text-3xl font-bold ${textPrimary} flex items-center`}>
                    <i className="fa-solid fa-id-card w-7 h-7 mr-3 text-cyan-500"></i> Team & Staff Management
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">Session ID: {userId.substring(0, 8)}...</span>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col items-center mt-50">
                    <RotatingLines
                        visible={true}
                        height="70"
                        width="70"
                        color="#06B6D4"
                        strokeWidth="5"
                        animationDuration="1"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            ) : (
                <div>
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Staff List Table (Takes 2/3 width on large screens) */}
                        <div className="lg:col-span-2">
                            <div className={`p-5 rounded-xl shadow-lg border ${cardClass}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search staff by name, role, or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full max-w-sm p-2 rounded-lg border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    <button
                                        onClick={handleAddStaff}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 flex items-center"
                                        disabled={roles.length === 0}
                                    >
                                        <i className="fa-solid fa-user-plus mr-2"></i> Add New User
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Permissions</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredStaff.length === 0 ? (
                                                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No staff found.</td></tr>
                                            ) : (
                                                filteredStaff.map((member) => (
                                                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                                                {getRoleName(member.roleId)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {getRolePermissions(member.roleId).length > 0
                                                                    ? getRolePermissions(member.roleId).join(', ')
                                                                    : 'No specific access'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                            <button onClick={() => handleEditStaff(member)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                                Edit
                                                            </button>
                                                            <button onClick={() => handleDeleteStaff(member)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        {/* Role Management Section (Takes 1/3 width on large screens) */}
                        <div className="lg:col-span-1">
                            <RoleManagement roles={roles} setRoles={setRoles} darkMode={darkMode} />
                        </div>

                    </div>

                    {/* Staff Add/Edit Modal */}
                    {isModalOpen && (
                        <StaffFormModal
                            staffMember={editingStaff}
                            roles={roles}
                            setStaff={setStaff}
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}
                </div>
            )}


        </div>
    );
}

// --- Main App Wrapper (State Management) ---
function App() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)

    const [staff, setStaff] = useState(MOCK_STAFF);
    const [roles, setRoles] = useState(MOCK_ROLES);
    const [alertMessage, setAlertMessage] = useState(null);
    const userId = 'local-session-id'; // Placeholder for user identifier

    // Custom Alert function to replace window.alert
    const customAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(null), 4000);
    };

    // Global alert replacement
    useEffect(() => {
        window.alert = customAlert;
    }, []);


    return (
        <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
            {alertMessage && <CustomAlert message={alertMessage.message} type={alertMessage.type} onClose={() => setAlertMessage(null)} />}

            <div className="flex-1 sm:ml-20 md:ml-62">
                <TeamStaffPage 
                    userId={userId} 
                    staff={staff} 
                    roles={roles}
                    setStaff={setStaff}
                    setRoles={setRoles}
                />
            </div>
        </div>
    );
}

export default App;