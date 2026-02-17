
export const MOCK_TABLES = [
    { id: "T1", status: "Occupied", guests: 4, orderId: "ORD-001", timeSeated: "12:30 PM" },
    { id: "T2", status: "Available", guests: 0, orderId: null, timeSeated: null },
    { id: "T3", status: "Occupied", guests: 2, orderId: "ORD-004", timeSeated: "1:05 PM" },
    { id: "T4", status: "Reserved", guests: 0, orderId: null, timeSeated: null, reservedFor: "7:00 PM" },
    { id: "T5", status: "Available", guests: 0, orderId: null, timeSeated: null },
    { id: "T6", status: "Occupied", guests: 6, orderId: "ORD-002", timeSeated: "12:45 PM" },
];

export const MOCK_STAFF = [
    { id: "S1", name: "Alice", role: "Head Chef", status: "Busy", currentTask: "Preparing ORD-002" },
    { id: "S2", name: "Bob", role: "Waiter", status: "Available", currentTask: "Waiting at Station" },
    { id: "S3", name: "Charlie", role: "Barista", status: "Busy", currentTask: "Latte Art" },
    { id: "S4", name: "Dave", role: "Delivery Rider", status: "Out for Delivery", currentTask: "Delivering ORD-003" },
];

export const MOCK_INVENTORY = [
    { item: "Coffee Beans (Arabica)", stock: "12kg", status: "Good" },
    { item: "Milk (Whole)", stock: "2L", status: "Low" },
    { item: "Avocados", stock: "5 units", status: "Critical" },
    { item: "Sourdough Bread", stock: "8 loaves", status: "Medium" },
    { item: "Eggs", stock: "45 units", status: "Good" },
];

export const MOCK_MENU_RECOMMENDATIONS = [
    { name: "Truffle Mushroom Risotto", price: "₹450", description: "Rich, earthy flavors with automated stirring." },
    { name: "Cyber-Latte", price: "₹200", description: "Neon-infused foam art." },
    { name: "Quantum Burger", price: "₹350", description: "Juicy plant-based patty." },
];
