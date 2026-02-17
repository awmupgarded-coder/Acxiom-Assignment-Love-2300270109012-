Event Management System - Assignment Project

This project is a web-based Event Management System developed in accordance with the provided flow chart and technical requirements.
It features a role-based architecture for Administrators, Vendors, and Users.

1. Role-Based Access Control

Admin: Full access to Maintenance, Reports (Placeholder), and User/Vendor management.
Vendor: Access to product management and transaction history.
User: Access to shopping, cart, and order status.
Security: Passwords are hidden (type="password") on all login screens.

2. Implementation of Flow Chart

The application follows the exact navigation flow defined in the assignment chart:
Index -> Login -> Specific Dashboard
Admin Maintenance Menu -> Add/Update Membership & User Management.

Login Credentials

You can register new users manually, or use the pre-configured Admin account:
Admin ID: admin
Password: admin

Technical Details
Backend: Node.js & Express (Single server.js file).
Frontend: HTML/CSS/JS (Single index.html file).
Database: In-memory storage (Data is reset upon server restart).
