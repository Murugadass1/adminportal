import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)' }}>
            <div className="card" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', background: 'var(--card-bg)' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '5px' }}>
                        <span style={{ color: 'var(--primary-color)' }}>▶</span> TubeClone
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue</p>
                </div>

                {error && <div style={{ background: '#ffebee', color: '#d32f2f', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ padding: '12px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '12px' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Protected Admin Portal
                </div>
            </div>
        </div>
    );
};

export default Login;
