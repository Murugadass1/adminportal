
import React, { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';

const Admin = ({ user, onLogout, onBack }) => {
    // Security Guard using Effect
    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.username !== 'root')) {
            onBack(); // Kick back to home if unauthorized
        }
    }, [user, onBack]);

    const [activeTab, setActiveTab] = useState('users'); // users, videos, topics
    const [topics, setTopics] = useState([]);

    // Forms
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user', topicIds: [] });
    const [newTopic, setNewTopic] = useState('');
    const [videoUpload, setVideoUpload] = useState({ title: '', topicId: '', file: null });
    const [viewTopicId, setViewTopicId] = useState(''); // For filtering video list
    const [videos, setVideos] = useState([]);
    const [playingVideo, setPlayingVideo] = useState(null);

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        if (activeTab === 'content') {
            fetchVideos();
        }
    }, [activeTab, viewTopicId]);

    const fetchTopics = async () => {
        const res = await fetch('/api/content/topics');
        if (res.ok) {
            setTopics(await res.json());
        }
    };

    const fetchVideos = async () => {
        let url = '/api/content/videos';
        if (viewTopicId) url += `?topicId=${viewTopicId}`;
        const res = await fetch(url);
        if (res.ok) {
            setVideos(await res.json());
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            setMessage(data.message);
            if (res.ok) setNewUser({ username: '', password: '', role: 'user', topicIds: [] });
        } catch (err) {
            setMessage('Error creating user');
        }
    };

    const toggleTopicSelection = (id) => {
        const currentIds = newUser.topicIds;
        if (currentIds.includes(id)) {
            setNewUser({ ...newUser, topicIds: currentIds.filter(tid => tid !== id) });
        } else {
            setNewUser({ ...newUser, topicIds: [...currentIds, id] });
        }
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/content/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTopic }),
            });
            const data = await res.json();
            setMessage(data.message);
            if (res.ok) {
                setNewTopic('');
                fetchTopics();
            }
        } catch (err) {
            setMessage('Error creating topic');
        }
    };

    const handleUploadVideo = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', videoUpload.title);
        formData.append('topicId', videoUpload.topicId);
        formData.append('video', videoUpload.file);

        try {
            const res = await fetch('/api/content/videos', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setMessage(data.message);
            if (res.ok) {
                setVideoUpload({ title: '', topicId: '', file: null });
                fetchVideos(); // Refresh list
            }
        } catch (err) {
            setMessage('Upload error');
        }
    };

    return (
        <div className="layout">
            {playingVideo && <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />}

            {/* Sidebar */}
            {/* Sidebar */}
            <div className="sidebar">
                <a href="#" className="logo">
                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    Admin Portal
                </a>

                <button className="nav-item" onClick={onBack} style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>
                    ← Back to Home
                </button>

                <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>User Management</button>
                <button className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Content & Videos</button>
                <div style={{ flex: 1 }}></div>
                <button className="nav-item" onClick={onLogout} style={{ color: '#d32f2f' }}>Logout</button>
            </div>

            {/* Content */}
            <div className="content">
                <div className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h2 style={{ margin: 0 }}>Welcome, <span style={{ color: 'var(--primary-color)' }}>{user.username}</span></h2>
                    </div>
                    <div style={{ padding: '8px 15px', background: '#eee', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', color: '#555' }}>Admin Access</div>
                </div>

                {message && <div style={{ padding: '15px', marginBottom: '20px', background: '#ffebee', color: '#d32f2f', borderRadius: '8px' }}>{message}</div>}

                {activeTab === 'users' && (
                    <div className="card" style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                        <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '20px' }}>Create New User</h3>
                        <form onSubmit={handleCreateUser} style={{ maxWidth: '600px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="New Username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Assign Password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                />
                            </div>
                            <select
                                className="form-control"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                style={{ marginTop: '15px' }}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>

                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <label className="form-label">Assign Topics (Access Control)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {topics.map(topic => (
                                        <div
                                            key={topic.id}
                                            onClick={() => toggleTopicSelection(topic.id)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                border: '1px solid',
                                                borderColor: newUser.topicIds.includes(topic.id) ? 'var(--primary-color)' : '#ccc',
                                                background: newUser.topicIds.includes(topic.id) ? 'rgba(204, 0, 0, 0.1)' : 'transparent',
                                                color: newUser.topicIds.includes(topic.id) ? 'var(--primary-color)' : 'var(--text-secondary)',
                                                transition: 'all 0.2s',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {topic.name}
                                        </div>
                                    ))}
                                    {topics.length === 0 && <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No topics available. Create some first.</span>}
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create User</button>
                        </form>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
                        {/* Left Column: Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {/* Topic Creation */}
                            <div className="card" style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                                <h3 style={{ marginBottom: '20px' }}>Create Topic</h3>
                                <form onSubmit={handleCreateTopic} style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Topic Name (e.g., Entertainment)"
                                        value={newTopic}
                                        onChange={(e) => setNewTopic(e.target.value)}
                                        style={{ marginBottom: 0, flex: 1 }}
                                        required
                                    />
                                    <button type="submit" className="btn-primary">Add</button>
                                </form>
                            </div>

                            {/* Video Upload */}
                            <div className="card" style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                                <h3 style={{ marginBottom: '20px' }}>Upload Video</h3>
                                <form onSubmit={handleUploadVideo}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Video Title"
                                            value={videoUpload.title}
                                            onChange={(e) => setVideoUpload({ ...videoUpload, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            value={videoUpload.topicId}
                                            onChange={(e) => setVideoUpload({ ...videoUpload, topicId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Topic to Upload To</option>
                                            {topics.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: '20px', border: '2px dashed #ddd', padding: '30px', borderRadius: '8px', textAlign: 'center', background: '#fafafa' }}>
                                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '500' }}>
                                            {videoUpload.file ? videoUpload.file.name : 'Click to Select Video File'}
                                        </label>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setVideoUpload({ ...videoUpload, file: e.target.files[0] })}
                                            required
                                            style={{ display: 'none' }}
                                            id="video-upload"
                                        />
                                        <label htmlFor="video-upload" className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Browse</label>
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Upload Video</button>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Library */}
                        <div className="glass-panel" style={{ padding: '30px', minHeight: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0 }}>Video Library</h3>
                                <select
                                    style={{ width: '150px', marginBottom: 0, padding: '5px' }}
                                    value={viewTopicId}
                                    onChange={(e) => setViewTopicId(e.target.value)}
                                >
                                    <option value="">All Topics</option>
                                    {topics.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {videos.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No videos found.</p>}
                                {videos.map(video => (
                                    <div
                                        key={video.id}
                                        onClick={() => setPlayingVideo(video)}
                                        style={{
                                            background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                                    >
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold' }}>{video.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{video.topic_name} • {new Date(video.uploaded_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
