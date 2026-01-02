import React from 'react';
import { Link } from 'react-router-dom';
import './ProviderCard.css';

const ProviderCard = ({ pro, idx, setActiveChat, mousePos }) => {
    const avgRating = pro.reviews?.length > 0
        ? (pro.reviews.reduce((acc, r) => acc + r.rating, 0) / pro.reviews.length).toFixed(1)
        : 4.9;

    return (
        <div
            className="provider-card-modern reveal"
            style={{
                animationDelay: `${idx * 0.1}s`,
                "--mouse-x": mousePos ? `${mousePos.x}%` : '50%',
                "--mouse-y": mousePos ? `${mousePos.y}%` : '50%'
            }}
        >
            <div className="pro-card-header">
                {pro.status === 1 && <span className="elite-badge">VERIFIED</span>}
            </div>

            <div className="pro-main-info">
                <div className="pro-avatar-wrapper">
                    <div className="pro-avatar-ring"></div>
                    <img
                        src={pro.profile_image ? (
                            (pro.profile_image.startsWith('data:') || pro.profile_image.startsWith('http'))
                                ? pro.profile_image
                                : `data:image/jpeg;base64,${pro.profile_image}`
                        ) : `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=random`}
                        alt={pro.name}
                        className="pro-avatar-img"
                    />
                    <div className="pro-status-pulse"></div>
                </div>
                <h3>{pro.name}</h3>
                <span className="pro-role-tag">{pro.services?.[0]?.name || 'Service Professional'}</span>
            </div>

            <div className="pro-rating-row">
                <div className="pro-stars">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className={i < Math.floor(avgRating) ? 'star-filled' : 'star-empty'} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    ))}
                </div>
                <span className="rating-count">({pro.reviews?.length || 0} reviews)</span>
            </div>

            <div className="pro-meta-grid">
                <div className="meta-item">
                    <span className="meta-label">Services</span>
                    <span className="meta-value">{pro.services?.length || 0}</span>
                </div>
                <div className="meta-divider"></div>
                <div className="meta-item">
                    <span className="meta-label">Location</span>
                    <span className="meta-value">{pro.address?.city || 'Local Area'}</span>
                </div>
            </div>

            <div className="pro-card-footer">
                <button
                    className="btn-message-pro"
                    onClick={() => setActiveChat(pro)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                </button>
                <Link to={`/providers/${pro.id}`} className="btn-view-pro-profile">
                    <span>View Profile</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
            </div>
        </div>
    );
};

export default ProviderCard;
