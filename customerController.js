const { pool } = require('../src/server');
const { v4: uuidv4 } = require('uuid');

exports.createCustomer = async (req, res) => {
    try {
        const { name, phone, email, businessId } = req.body;
        const customerId = uuidv4();
        await pool.query('INSERT INTO customers (id, name, phone, email, business_id) VALUES ($1, $2, $3, $4, $5)', [customerId, name, phone, email, businessId]);
        res.status(201).json({ message: 'Customer created', customerId });
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const { businessId } = req.params;
        const customers = await pool.query('SELECT * FROM customers WHERE business_id = $1', [businessId]);
        res.json(customers.rows);
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await pool.query('SELECT * FROM customers WHERE id = $1', [customerId]);
        if (customer.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer.rows[0]);
    } catch (error) {
        console.error('Get customer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { name, phone, email } = req.body;
        await pool.query('UPDATE customers SET name = $1, phone = $2, email = $3 WHERE id = $4', [name, phone, email, customerId]);
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        await pool.query('DELETE FROM customers WHERE id = $1', [customerId]);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
