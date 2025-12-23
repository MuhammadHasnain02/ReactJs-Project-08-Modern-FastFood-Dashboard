// ========================= Live Orders ================================

export const initialOrders = [
    { id: 'ORD-7432', customer: 'Alice Johnson', timePlaced: '10:05 AM', items: ['Smash Burger (x1)', 'Large Fries (x1)'], status: 'PENDING' },
    { id: 'ORD-7431', customer: 'Bob Smith', timePlaced: '09:55 AM', items: ['Veggie Wrap (x2)', 'Soda (x2)'], status: 'PREPARING' },
    { id: 'ORD-7430', customer: 'Charlie Brown', timePlaced: '09:40 AM', items: ['Chicken Sandwich (x1)'], status: 'READY' },
    { id: 'ORD-7429', customer: 'Diana Prince', timePlaced: '09:20 AM', items: ['Milkshake (x3)'], status: 'COMPLETED' },
    { id: 'ORD-7428', customer: 'Elias Vance', timePlaced: '09:15 AM', items: ['Classic Burger (x1)', 'Small Fries (x1)'], status: 'PREPARING' },
    { id: 'ORD-7427', customer: 'Fiona Glenanne', timePlaced: '10:08 AM', items: ['Steak Sandwich (x1)'], status: 'PENDING' },
];

export const ORDER_STATUSES = {
    PENDING: { label: 'New/Pending', icon: 'fa-solid fa-circle-exclamation', color: 'text-red-500', next: 'PREPARING', nextLabel: 'Start Prep' },
    PREPARING: { label: 'Preparing', icon: 'fa-solid fa-fire-burner', color: 'text-amber-500', next: 'READY', nextLabel: 'Ready for Pickup' },
    READY: { label: 'Ready/Dispatch', icon: 'fa-solid fa-box-open', color: 'text-blue-500', next: 'COMPLETED', nextLabel: 'Mark Delivered' },
    COMPLETED: { label: 'Completed', icon: 'fa-solid fa-circle-check', color: 'text-green-500', next: null, nextLabel: 'Done' },
};

// ========================= Order History ================================

export const mockHistoryData = [

    { id: 'ORD-7429', customer: 'Diana Prince', total: 45.00, date: '2024-11-28 14:30', status: 'COMPLETED', payment: 'Card' },
    { id: 'ORD-7428', customer: 'Elias Vance', total: 22.50, date: '2024-11-28 10:15', status: 'COMPLETED', payment: 'Cash' },
    { id: 'ORD-7427', customer: 'Fiona Glenanne', total: 18.99, date: '2024-11-27 19:45', status: 'COMPLETED', payment: 'App' },
    { id: 'ORD-7426', customer: 'George Lucas', total: 8.50, date: '2024-11-27 12:00', status: 'CANCELLED', payment: 'Card' },
    { id: 'ORD-7425', customer: 'Hannah Baker', total: 35.75, date: '2024-11-26 15:30', status: 'COMPLETED', payment: 'Card' },
    { id: 'ORD-7424', customer: 'Ian Malcolm', total: 60.00, date: '2024-11-26 09:00', status: 'COMPLETED', payment: 'Cash' },
    { id: 'ORD-7423', customer: 'Jenny Fox', total: 12.99, date: '2024-11-25 18:10', status: 'CANCELLED', payment: 'Card' },
    { id: 'ORD-7422', customer: 'Kyle Reese', total: 29.99, date: '2024-11-25 11:55', status: 'COMPLETED', payment: 'App' },
    { id: 'ORD-7421', customer: 'Lois Lane', total: 55.00, date: '2024-11-24 16:20', status: 'COMPLETED', payment: 'Cash' },
    { id: 'ORD-7420', customer: 'Clark Kent', total: 15.20, date: '2024-11-24 10:40', status: 'COMPLETED', payment: 'Card' },

];

export const PAYMENT_OPTIONS = ['All', 'Card', 'Cash', 'App'];
export const STATUS_OPTIONS = ['All', 'COMPLETED', 'CANCELLED'];

// ========================= Food Menu ================================

export const mockMenuItems = [
    { id: 'M-001', name: 'Classic Smash Burger', price: 8.99, category: 'Main', status: 'AVAILABLE', imgUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Burger' },
    { id: 'M-002', name: 'Spicy Chicken Sandwich', price: 7.99, category: 'Main', status: 'AVAILABLE', imgUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Chicken' },
    { id: 'M-003', name: 'Large Fries', price: 3.50, category: 'Side', status: 'AVAILABLE', imgUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Fries' },
    { id: 'M-004', name: 'Chocolate Milkshake', price: 4.00, category: 'Dessert', status: 'SOLD_OUT', imgUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Milkshake' },
    { id: 'M-005', name: 'Veggie Supreme Wrap', price: 7.50, category: 'Vegan', status: 'AVAILABLE', imgUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Wrap' },
];

// ========================= Inventory ================================

export const mockInventoryData = [

    { id: 'I-001', name: 'Brioche Buns', stock: 50, unit: 'Units', reorderPoint: 100 },
    { id: 'I-002', name: 'Beef Patties (1/4 lb)', stock: 250, unit: 'Units', reorderPoint: 300 },
    { id: 'I-003', name: 'Lettuce (Romaine)', stock: 5, unit: 'Heads', reorderPoint: 10 },
    { id: 'I-004', name: 'Tomato Slices', stock: 15, unit: 'KG', reorderPoint: 20 },
    { id: 'I-005', name: 'Frying Oil', stock: 20, unit: 'Liters', reorderPoint: 10 },
    { id: 'I-006', name: 'Chocolate Syrup', stock: 80, unit: 'ML', reorderPoint: 500 },
    { id: 'I-007', name: 'Sweet Potato Fries', stock: 150, unit: 'Packs', reorderPoint: 100 },

];

// ========================= Customers ================================

export const mockCustomerData = [

    { id: 'C-001', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-1234', totalOrders: 15, loyaltyPoints: 450, history: [
        { orderId: 'ORD-7432', date: '2024-11-28', total: 25.50, items: ['Smash Burger (x1)', 'Large Fries (x1)'] },
        { orderId: 'ORD-7401', date: '2024-11-10', total: 12.00, items: ['Chocolate Milkshake (x3)'] },
    ]},
    { id: 'C-002', name: 'Bob Smith', email: 'bob@example.com', phone: '555-5678', totalOrders: 7, loyaltyPoints: 210, history: [
        { orderId: 'ORD-7431', date: '2024-11-28', total: 32.50, items: ['Veggie Wrap (x2)', 'Soda (x2)'] },
    ]},
    { id: 'C-003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-9012', totalOrders: 3, loyaltyPoints: 90, history: []},
    { id: 'C-004', name: 'Diana Prince', email: 'diana@example.com', phone: '555-3456', totalOrders: 22, loyaltyPoints: 660, history: [
        { orderId: 'ORD-7429', date: '2024-11-28', total: 45.00, items: ['Milkshake (x3)', 'Veggie Wrap (x1)'] },
    ]},
    { id: 'C-005', name: 'Elias Vance', email: 'elias@example.com', phone: '555-7890', totalOrders: 10, loyaltyPoints: 300, history: [
        { orderId: 'ORD-7428', date: '2024-11-28', total: 22.50, items: ['Classic Burger (x1)', 'Small Fries (x1)'] },
    ]}

];

// ========================= Offers & Promos ================================

export const mockPromotions = [

    { id: 'P-001', code: 'LUNCH50', type: 'PERCENTAGE', value: 50, startDate: '2024-11-01', endDate: '2024-12-31', minOrder: 15, usage: 145, status: 'ACTIVE', isFirstTimeUser: false },
    { id: 'P-002', code: 'WELCOME10', type: 'FLAT', value: 10, startDate: '2024-01-01', endDate: '2025-12-31', minOrder: 0, usage: 890, status: 'ACTIVE', isFirstTimeUser: true },
    { id: 'P-003', code: 'BURGERDAY', type: 'PERCENTAGE', value: 20, startDate: '2024-12-25', endDate: '2024-12-26', minOrder: 20, usage: 0, status: 'SCHEDULED', isFirstTimeUser: false },
    { id: 'P-004', code: 'SUMMER_FUN', type: 'FLAT', value: 5, startDate: '2024-06-01', endDate: '2024-08-31', minOrder: 10, usage: 320, status: 'EXPIRED', isFirstTimeUser: false },
    { id: 'P-005', code: 'FREESHIP', type: 'FLAT', value: 3.99, startDate: '2024-11-20', endDate: '2024-11-30', minOrder: 25, usage: 45, status: 'EXPIRED', isFirstTimeUser: false },

];

// ========================= Analytics ================================

export const mockCategoryData = [
    { name: 'Appetizers', revenue: 4500, orders: 850 },
    { name: 'Main Courses', revenue: 15500, orders: 1200 },
    { name: 'Drinks', revenue: 7200, orders: 2500 },
    { name: 'Desserts', revenue: 3800, orders: 600 },
    { name: 'Sides', revenue: 2100, orders: 750 },
];

// ========================= Team / Staff ================================

export const PERMISSIONS = [
    'View Reports', 
    'Manage Inventory', 
    'Process Orders', 
    'Manage Staff', 
    'Configure Menu'
];

export const MOCK_ROLES = [
    { id: 'manager', name: 'Manager', description: 'Full operational control and reporting.', access: PERMISSIONS },
    { id: 'cashier', name: 'Cashier', description: 'Handles order processing only.', access: ['Process Orders'] },
    { id: 'driver', name: 'Driver', description: 'Views orders for delivery.', access: ['Process Orders'] }
];

export const MOCK_STAFF = [
    { id: 's1', name: 'Alice Johnson', email: 'alice.j@corp.com', roleId: 'manager' },
    { id: 's2', name: 'Bob Smith', email: 'bob.s@corp.com', roleId: 'cashier' },
    { id: 's3', name: 'Charlie Driver', email: 'charlie.d@corp.com', roleId: 'driver' },
];

// ========================= Settings ================================

export const mockInitialSettings = {

    store: {
        location: '123 Main St, Anytown, CA 90210',
        phone: '(555) 123-4567',
        operatingHours: 'Mon-Fri: 9am - 5pm, Sat: 10am - 2pm',
    },
    payment: {
        stripeApiKey: 'sk_test_************************',
        paypalClientId: 'AZX-************************',
    },
    printer: {
        kitchenPrinterIP: '192.168.1.101',
        receiptPrinterIP: '192.168.1.102',
    },
    taxes: {
        localSalesTax: 8.25, // percentage
        taxId: 'TX-123456789',
    }

};

// ========================= xxx --- xxx ================================