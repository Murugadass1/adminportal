import React from 'react';

const VideoPlayer = ({ video, onClose }) => {
    if (!video) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ position: 'absolute', top: '20px', right: '30px', cursor: 'pointer', zIndex: 1001 }} onClick={onClose}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>

            <div style={{ width: '80%', maxWidth: '1000px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 50px rgba(99, 102, 241, 0.3)' }}>
                <video controls autoPlay style={{ width: '100%', display: 'block' }}>
                    <source src={`http://localhost:5000/uploads/${video.filename}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', color: 'white' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>{video.title}</h2>
                <span style={{
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}>
                    {video.topic_name}
                </span>
            </div>
        </div>
    );
};

export default VideoPlayer;
