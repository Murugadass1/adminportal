
import React, { useState, useEffect } from 'react';

const Library = ({ user, onLogout, onWatch, isAdmin, onAdmin }) => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [selectedTopic, user.id]);

    const fetchTopics = async () => {
        const res = await fetch('/api/content/topics');
        if (res.ok) setTopics(await res.json());
    };

    const fetchVideos = async () => {
        setLoading(true);
        try {
            let url = '/api/content/videos';
            const params = new URLSearchParams();

            // Only filter by user if NOT admin
            if (!isAdmin && user.id) {
                params.append('userId', user.id);
            }

            if (selectedTopic) {
                params.append('topicId', selectedTopic);
            }

            // Append params if any exist
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await fetch(url);
            if (res.ok) {
                setVideos(await res.json());
            } else {
                console.error('Failed to fetch videos');
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout">
            <div className="sidebar">
                <a href="#" className="logo">
                    <span style={{ fontSize: '1.5rem' }}>▶</span>
                    TubeClone
                </a>

                <button className={`nav-item ${selectedTopic === '' ? 'active' : ''}`} onClick={() => setSelectedTopic('')}>
                    🏠 Home
                </button>

                <div className="nav-section-title">Topics</div>
                {topics.map(t => (
                    <button
                        key={t.id}
                        className={`nav-item ${selectedTopic === t.id.toString() ? 'active' : ''}`}
                        onClick={() => setSelectedTopic(t.id.toString())}
                    >
                        {t.name}
                    </button>
                ))}

                <div style={{ flex: 1 }}></div>
                {isAdmin && (
                    <button
                        className="nav-item"
                        style={{ color: 'var(--primary-color)' }}
                        onClick={onAdmin}
                    >⚡ Admin Panel</button>
                )}
                <button className="nav-item" onClick={onLogout} style={{ color: '#d32f2f' }}>Logout</button>
            </div>

            <div className="content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div className="search-bar-container">
                        <input type="text" className="search-input" placeholder="Search" />
                        <button className="search-btn">🔍</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {user.username[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {loading ? <p>Loading videos...</p> : (
                    <div className="video-grid">
                        {videos.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No videos found.</p>}
                        {videos.map(video => (
                            <div
                                key={video.id}
                                className="video-card"
                                onClick={() => onWatch(video)}
                            >
                                <div className="video-thumbnail">
                                    <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '2rem', opacity: 0.3 }}>▶</span>
                                    </div>
                                    <span style={{
                                        position: 'absolute', bottom: '8px', right: '8px',
                                        background: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px',
                                        borderRadius: '4px', fontSize: '0.75rem'
                                    }}>
                                        VIDEO
                                    </span>
                                </div>
                                <div className="video-info">
                                    <div className="avatar"></div>
                                    <div className="video-details">
                                        <h3 className="video-title">{video.title}</h3>
                                        <div className="video-meta">{video.topic_name}</div>
                                        <div className="video-meta">{new Date(video.uploaded_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;
