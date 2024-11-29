import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import newDatabase from './database.js'

dotenv.config({ path: './server/.env' });
console.log('Loaded ENV:', process.env.SECRET_KEY);
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables');
}

// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = true;
const database = newDatabase({isPersistent});

// Create middlewares required for routes defined in app.js
// export const register = async (req, res) => {};

// You can also create helper functions in this file to help you implement logic
// inside middlewares

export const register = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = database.create({ username, password: hashedPassword });
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user.' });
    }
};

export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      console.log('Login request:', { username, password });
      
      const users = database.getAll();
      const user = users.find((user) => user.username === username);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: '1h',
      });
  
      res.status(201).json({ token });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Error logging in.' });
    }
};  

export const getProfile = (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required.' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = database.getById(decoded.id);
  
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }
  
      res.json({ message: `Welcome, ${user.username}!` });
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export const logout = (req, res) => {
    res.status(204).end();
};