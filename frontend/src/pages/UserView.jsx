import React, { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';

const UserView = ({ user, onLogout }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingVideo, setPlayingVideo] = useState(null);

    useEffect(() => {
        const fetchAssignedVideos = async () => {
            // Pass userId to filter videos by assigned topics
            const res = await fetch(`/api/content/videos?userId=${user.id}`);
            if (res.ok) {
                setVideos(await res.json());
            }
            setLoading(false);
        };
        fetchAssignedVideos();
    }, [user.id]);

    return (
        <div className="layout">
            {playingVideo && <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />}

            <div className="glass-panel sidebar" style={{ borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none' }}>
                <h3 style={{ margin: '20px 0', textAlign: 'center', color: 'var(--secondary-color)' }}>User Portal</h3>
                <button className="nav-link active">My Content</button>
                <div style={{ flex: 1 }}></div>
                <button className="nav-link" onClick={onLogout} style={{ color: '#ef4444' }}>Logout</button>
            </div>

            <div className="content">
                <header style={{ marginBottom: '30px' }}>
                    <h2>Welcome, {user.username}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Here are the videos from topics assigned to you.</p>
                </header>

                {loading ? <p>Loading content...</p> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {videos.length === 0 && <p>No videos assigned to you yet.</p>}
                        {videos.map(video => (
                            <div
                                key={video.id}
                                className="glass-panel"
                                style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => setPlayingVideo(video)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{ position: 'relative', height: '180px', background: 'black' }}>
                                    <img
                                        src={`http://localhost:5000/uploads/${video.filename}#t=1`} // Thumbnail hack using timestamp? No, images wont load from video file directly in img. 
                                        // Better to just show a play icon placeholder or actual video muted.
                                        // Let's use video tag but disable controls so it looks like a thumbnail.
                                        style={{ display: 'none' }} // placeholder
                                        alt=""
                                    />
                                    <video
                                        src={`http://localhost:5000/uploads/${video.filename}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        preload="metadata"
                                    />
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(0,0,0,0.3)'
                                    }}>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.5)'
                                        }}>
                                            ▶
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '15px' }}>
                                    <h4 style={{ margin: '0 0 5px 0' }}>{video.title}</h4>
                                    <span style={{ fontSize: '0.8rem', background: 'var(--primary-color)', padding: '2px 8px', borderRadius: '4px' }}>{video.topic_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserView;
