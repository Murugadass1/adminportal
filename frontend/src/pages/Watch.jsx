import React, { useEffect, useState } from 'react';

const Watch = ({ video, onBack, user }) => {
    const [relatedVideos, setRelatedVideos] = useState([]);

    useEffect(() => {
        // Fetch "related" videos (for now, just all videos in the same topic)
        const fetchRelated = async () => {
            // If we had a real recommendation engine, we'd use it. 
            // For now, fetch videos of the same topic.
            const res = await fetch(`/api/content/videos?topicId=${video.topic_id}&userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                // Filter out current video
                setRelatedVideos(data.filter(v => v.id !== video.id));
            }
        };
        fetchRelated();
    }, [video, user]);

    return (
        <div className="layout" style={{ background: 'var(--bg-color)', overflow: 'hidden' }}>
            {/* Header / Navbar */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 24px', zIndex: 100 }}>
                <a href="#" className="logo" style={{ padding: 0, marginRight: '40px', cursor: 'pointer', textDecoration: 'none' }} onClick={onBack}>
                    <span style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>▶</span>
                    <span style={{ color: 'var(--text-primary)' }}>TubeClone</span>
                </a>

                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}
                >
                    ← Back to Home
                </button>
            </div>

            <div style={{ display: 'flex', width: '100%', marginTop: '60px', height: 'calc(100vh - 60px)' }}>
                {/* Main Content (Player) */}
                <div style={{ flex: 1, padding: '24px 24px 24px 80px', overflowY: 'auto' }}>
                    <div style={{ width: '100%', aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                        <video key={video.id} controls autoPlay style={{ width: '100%', height: '100%' }}>
                            <source src={`http://localhost:5000/uploads/${video.filename}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{video.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-secondary)' }}>
                            <span style={{ background: '#f0f0f0', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', color: '#333' }}>{video.topic_name}</span>
                            <span>{new Date(video.uploaded_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Description</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Watch this amazing video about {video.topic_name}. More details coming soon.
                        </p>
                    </div>
                </div>

                {/* Sidebar (Related Videos) */}
                <div style={{ width: '400px', padding: '24px', overflowY: 'auto', borderLeft: '1px solid var(--border-color)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Related Videos</h3>
                    {relatedVideos.map(rv => (
                        <div key={rv.id} style={{ display: 'flex', gap: '10px', cursor: 'pointer', marginBottom: '12px' }} onClick={() => { /* Handle switch */ }}>
                            <div style={{ width: '168px', height: '94px', background: '#ddd', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e0e0' }}>
                                    <span style={{ opacity: 0.5 }}>▶</span>
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px', lineHeight: '1.3', color: 'var(--text-primary)' }}>{rv.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rv.topic_name}</div>
                            </div>
                        </div>
                    ))}
                    {relatedVideos.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No related videos found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Watch;
