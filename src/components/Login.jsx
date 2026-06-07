import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Mock API Interaction
        setTimeout(() => {
            // 1. Check Domain Validity
            const isStudent = email.endsWith('@st.niituniversity.in');
            const isFaculty = email.endsWith('.fac@st.niituniversity.in'); // Faculty Check

            if (!isStudent && !isFaculty) {
                setError('Please use a valid university email (@st... or .fac@st...)');
                setLoading(false);
                return;
            }

            // 2. Strict Password Check: Must be email prefix
            // Example: student@st... -> 'student'
            // Example: prof.fac@st... -> 'prof.fac'
            const emailPrefix = email.split('@')[0];

            if (password !== emailPrefix) {
                setError(`Invalid password. Hint: It's your email prefix.`);
                setLoading(false);
                return;
            }

            // 3. Determine Role
            const role = isFaculty ? 'faculty' : 'student';

            // Success
            const user = {
                email,
                name: emailPrefix,
                role
            };

            onLogin(user);
        }, 800);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">NIIT Health Portal</h1>
                <p className="login-subtitle">Secure Campus Access</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>University Email</label>
                        <input
                            type="email"
                            placeholder="id@st.niituniversity.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
