const pool = require('./config/db');

async function createRoot() {
    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE username = "root"');
        if (existing.length === 0) {
            await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                ['root', 'Muruga@7557', 'admin']);
            console.log('Root user created.');
        } else {
            console.log('Root user already exists.');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createRoot();
