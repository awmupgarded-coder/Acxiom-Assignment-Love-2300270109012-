const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serves index.html from same folder

// --- IN-MEMORY DATABASE (Minimal Backend) ---
let users = [
    { id: 'admin', password: 'admin', role: 'admin', name: 'Administrator' } // Default Admin
];
let products = []; // Stores vendor items
let orders = [];   // Stores user orders

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

// 3. Register (Vendor/User)
app.post('/api/register', (req, res) => {
    const { name, email, password, role, category } = req.body;
    
    // Simple validation
    if (users.find(u => u.id === name)) { // Using Name as ID for simplicity per PDF flow
        return res.json({ success: false, message: 'User ID/Name already exists' });
    }

    const newUser = {
        id: name, // Using Name as User ID as per PDF screenshots roughly implying simple ID
        name,
        email,
        password,
        role,
        category: category || null
    };

    users.push(newUser);
    res.json({ success: true });
});

// 4. Products (Add & Get)
app.post('/api/products', (req, res) => {
    const { name, price, vendorId } = req.body;
    const newProduct = {
        id: Date.now(),
        name,
        price,
        vendorId
    };
    products.push(newProduct);
    res.json({ success: true });
});

app.get('/api/products', (req, res) => {
    const vendorId = req.query.vendorId;
    if (vendorId) {
        // Return products for specific vendor
        const vendorProducts = products.filter(p => p.vendorId === vendorId);
        res.json(vendorProducts);
    } else {
        // Return all products
        res.json(products);
    }
});

// 5. Orders
app.post('/api/orders', (req, res) => {
    const { userId, items, total, details } = req.body;
    const newOrder = {
        id: Date.now(),
        userId,
        items,
        total,
        details,
        status: 'Received'
    };
    orders.push(newOrder);
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
