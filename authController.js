const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../src/server');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    try {
        const { username, password, email, type } = req.body;
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await pool.query('INSERT INTO users (id, username, email, password_hash, type) VALUES ($1, $2, $3, $4, $5)', [userId, username, email, hashedPassword, type]);

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.rows[0].id, type: user.rows[0].type }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username, type: user.rows[0].type } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userType = decoded.type;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};