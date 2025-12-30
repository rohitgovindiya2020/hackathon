import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import './ServiceDiscountDetail.css';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ServiceDiscountDetail = () => {
    const { providerId, serviceId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [provider, setProvider] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [service, setService] = useState(null);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [providerId, serviceId]);

    const fetchData = async () => {
        try {
            // We fetch the provider details which includes services and discounts
            const response = await api.get(`/providers/${providerId}`);
            const providerData = response.data.data;
            setProvider(providerData);

            // Find the specific service
            const foundService = providerData.services?.find(s => s.id == serviceId);
            setService(foundService);

            // Find the active discount for this service
            // Note: DB table has service_id column. Provider response 'discounts' relation should have it.
            const foundDiscount = providerData.discounts?.find(d => d.service_id == serviceId);
            setDiscount(foundDiscount);

        } catch (error) {
            console.error("Failed to fetch details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinDeal = async () => {
        if (!discount || !user) return;
        setJoining(true);
        try {
            // Assuming there is an endpoint to join interest. 
            // Based on previous conversations/code, we might need to create one or use existing.
            // For now, we will simulate or assume '/interests' endpoint exists as per api.php routes:
            // Route::post('/interests', [InterestController::class, 'store']);

            await api.post('/interests', {
                discount_id: discount.id
            });

            // Refresh data to show updated count
            await fetchData();
            // Optional: User feedback
            toast.success("Successfully joined the deal!");
        } catch (error) {
            console.error("Failed to join deal", error);
            const msg = error.response?.data?.message || "Failed to join. You might have already joined.";
            toast.error(msg);
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="sdd-loading">
                <Header />
                <div className="loader-container">
                    <div className="spinner-premium"></div>
                    <p>Loading deal details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!provider || !discount || !service) {
        return (
            <div className="sdd-not-found">
                <Header />
                <div className="error-container">
                    <h2>Deal Not Found</h2>
                    <p>The discount you are looking for is no longer available or invalid.</p>
                    <Link to={`/providers/${providerId}`} className="btn-primary">Back to Provider</Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Calculate dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isJoined = discount.interests?.some(i => i.customer_id === user?.id);
    const currentCount = discount.current_interest_count || 0;
    const progress = Math.min((currentCount / discount.required_interest_count) * 100, 100);

    return (
        <div className="sdd-wrapper">
            <Header />
            <main className="sdd-main">
                <div className="sdd-container">
                    {/* Breadcrumbs / Back */}
                    <Link to={`/providers/${providerId}`} className="sdd-back-link">
                        &larr; Back to {provider.name}
                    </Link>

                    <div className="sdd-content-grid">
                        {/* Main Deal Card */}
                        <div className="sdd-card-main">
                            <div className="sdd-badge-row">
                                <span className="sdd-badge-active">Active Deal</span>
                                <span className="sdd-badge-service">{service.category}</span>
                            </div>

                            <h1 className="sdd-title">
                                Save {discount.discount_percentage}% on {service.name}
                            </h1>

                            <div className="sdd-price-showcase">
                                <span className="sdd-price-original">${service.price}</span>
                                <span className="sdd-arrow">&rarr;</span>
                                <span className="sdd-price-discounted">
                                    ${(parseFloat(service.price) * (1 - parseFloat(discount.discount_percentage) / 100)).toFixed(2)}
                                </span>
                            </div>

                            <div className="sdd-progress-section">
                                <div className="sdd-progress-labels">
                                    <strong>Deal Progress</strong>
                                    <span>{currentCount} / {discount.required_interest_count} Joined</span>
                                </div>
                                <div className="sdd-progress-track">
                                    <div className="sdd-progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="sdd-progress-info">
                                    {currentCount >= discount.required_interest_count
                                        ? "Deal is unlocked! Valid during the discount period."
                                        : `${discount.required_interest_count - currentCount} more people needed to unlock this deal!`}
                                </p>
                            </div>

                            <button
                                className={`sdd-btn-join ${isJoined ? 'joined' : ''}`}
                                onClick={handleJoinDeal}
                                disabled={joining || isJoined}
                            >
                                {joining ? 'Joining...' : (isJoined ? 'You Joined This Deal ✓' : 'Join Deal Now')}
                            </button>

                            {isJoined && (
                                <p className="sdd-joined-msg">
                                    You will be notified when the discount period starts.
                                </p>
                            )}
                        </div>

                        {/* Details Sidebar/Panel */}
                        <div className="sdd-card-details">
                            <h3 className="sdd-details-title">Deal Timeline</h3>

                            <div className="sdd-timeline-item">
                                <div className="sdd-timeline-icon">📝</div>
                                <div className="sdd-timeline-content">
                                    <label>Interest Phase</label>
                                    <p>{formatDate(discount.interest_from_date)} - {formatDate(discount.interest_to_date)}</p>
                                    <span>Express interest during this period to help unlock the deal.</span>
                                </div>
                            </div>

                            <div className="sdd-timeline-item">
                                <div className="sdd-timeline-icon">🎉</div>
                                <div className="sdd-timeline-content">
                                    <label>Redemption Period</label>
                                    <p>{formatDate(discount.discount_start_date)} - {formatDate(discount.discount_end_date)}</p>
                                    <span>If unlocked, book the service between these dates to get the discount.</span>
                                </div>
                            </div>

                            <div className="sdd-divider"></div>

                            <h3 className="sdd-details-title">Location</h3>
                            <p className="sdd-location-text">
                                {discount.address || provider.address?.address || "Provider's Location"}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ServiceDiscountDetail;
