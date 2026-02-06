const { pool } = require('../src/server');
const { v4: uuidv4 } = require('uuid');

exports.createBusiness = async (req, res) => {
    try {
        const { name, description, location } = req.body;
        const userId = req.userId;
        const businessId = uuidv4();
        await pool.query('INSERT INTO businesses (id, name, description, location, user_id) VALUES ($1, $2, $3, $4, $5)', [businessId, name, description, location, userId]);
        res.status(201).json({ message: 'Business created', businessId });
    } catch (error) {
        console.error('Create business error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getBusinessById = async (req, res) => {
    try {
        const { businessId } = req.params;
        const business = await pool.query('SELECT * FROM businesses WHERE id = $1', [businessId]);
        if (business.rows.length === 0) {
            return res.status(404).json({ error: 'Business not found' });
        }
        res.json(business.rows[0]);
    } catch (error) {
        console.error('Get business error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        const { name, description, location } = req.body;
        await pool.query('UPDATE businesses SET name = $1, description = $2, location = $3 WHERE id = $4', [name, description, location, businessId]);
        res.json({ message: 'Business updated successfully' });
    } catch (error) {
        console.error('Update business error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllBusinesses = async (req, res) => {
    try {
        const userId = req.userId;
        const businesses = await pool.query('SELECT * FROM businesses WHERE user_id = $1', [userId]);
        res.json(businesses.rows);
    } catch (error) {
        console.error('Get all businesses error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};