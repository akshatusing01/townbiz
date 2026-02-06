const { pool } = require('../src/server');
const { v4: uuidv4 } = require('uuid');

exports.createBill = async (req, res) => {
    try {
        const { customerId, amount, items, notes } = req.body;
        const billId = uuidv4();
        const billDate = new Date();
        await pool.query('INSERT INTO bills (id, customer_id, amount, items, notes, bill_date) VALUES ($1, $2, $3, $4, $5, $6)', [billId, customerId, amount, JSON.stringify(items), notes, billDate]);
        res.status(201).json({ message: 'Bill created', billId });
    } catch (error) {
        console.error('Create bill error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getBillsByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const bills = await pool.query('SELECT * FROM bills WHERE customer_id = $1 ORDER BY bill_date DESC', [customerId]);
        res.json(bills.rows);
    } catch (error) {
        console.error('Get bills error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getBillById = async (req, res) => {
    try {
        const { billId } = req.params;
        const bill = await pool.query('SELECT * FROM bills WHERE id = $1', [billId]);
        if (bill.rows.length === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json(bill.rows[0]);
    } catch (error) {
        console.error('Get bill error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateBillStatus = async (req, res) => {
    try {
        const { billId } = req.params;
        const { status } = req.body;
        await pool.query('UPDATE bills SET status = $1 WHERE id = $2', [status, billId]);
        res.json({ message: 'Bill status updated' });
    } catch (error) {
        console.error('Update bill error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};