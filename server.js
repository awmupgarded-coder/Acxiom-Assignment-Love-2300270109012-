const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// --- IN-MEMORY DATABASE ---
let users = [
    { id: 'admin', password: 'admin', role: 'admin', name: 'Administrator' }
];
let products = []; 
let orders = [];   
let memberships = []; // New: Stores memberships created by Admin

// --- ROUTES ---

// 1. Serve Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Login
app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
        res.json({ success: true, role: user.role, name: user.name, id: user.id });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }
});

// 3. Register
app.post('/api/register', (req, res) => {
    const { name, email, password, role, category } = req.body;
    if (users.find(u => u.id === name)) { 
        return res.json({ success: false, message: 'User ID already exists' });
    }
    users.push({ id: name, name, email, password, role, category: category || null });
    res.json({ success: true });
});

// 4. Products
app.post('/api/products', (req, res) => {
    const { name, price, vendorId } = req.body;
    products.push({ id: Date.now(), name, price, vendorId });
    res.json({ success: true });
});

app.get('/api/products', (req, res) => {
    const vendorId = req.query.vendorId;
    if (vendorId) {
        res.json(products.filter(p => p.vendorId === vendorId));
    } else {
        res.json(products);
    }
});

// 5. Orders
app.post('/api/orders', (req, res) => {
    const { userId, items, total, details } = req.body;
    orders.push({ id: Date.now(), userId, items, total, details, status: 'Received' });
    res.json({ success: true });
});

// --- NEW MAINTENANCE MODULE ROUTES (Admin Only) ---

// 6. Get All Users (For Admin Maintenance)
app.get('/api/users', (req, res) => {
    res.json(users);
});

// 7. Add Membership (As per PDF Page 1)
app.post('/api/memberships', (req, res) => {
    const { vendorId, duration } = req.body;
    // PDF Requirement: Membership Number is mandatory (we generate it)
    const newMembership = {
        membershipId: 'MEM' + Date.now(),
        vendorId,
        duration,
        status: 'Active'
    };
    memberships.push(newMembership);
    res.json({ success: true, membershipId: newMembership.membershipId });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
