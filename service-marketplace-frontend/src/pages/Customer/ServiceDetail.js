import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Services.css';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        fetchServiceDetails();
    }, [id]);

    const fetchServiceDetails = async () => {
        try {
            const response = await api.get(`/services/${id}`);
            setService(response.data.service);
        } catch (error) {
            console.error('Failed to fetch service details:', error);
            navigate('/services');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!bookingDate) {
            setBookingError('Please select a date and time');
            return;
        }

        try {
            await api.post('/bookings', {
                service_id: id,
                booking_date: bookingDate
            });
            alert('Booking created successfully!');
            navigate('/customer/dashboard');
        } catch (error) {
            setBookingError(error.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return <div className="loading">Loading details...</div>;
    if (!service) return null;

    return (
        <div className="service-page">
            <button className="btn-back" onClick={() => navigate('/services')}>
                ← Back to Services
            </button>

            <div className="service-detail-card">
                <div className="detail-header">
                    <h1>{service.name}</h1>
                    <span className="category-badge">{service.category}</span>
                </div>

                <div className="detail-content">
                    <div className="main-info">
                        <p className="description">{service.description}</p>
                        <div className="price-tag">
                            ${service.base_price}
                        </div>

                        <div className="provider-info">
                            <h3>Service Provider</h3>
                            <p>{service.provider?.name}</p>
                        </div>
                    </div>

                    <div className="booking-section">
                        <h3>Book This Service</h3>
                        {bookingError && <div className="error-message">{bookingError}</div>}

                        <div className="form-group">
                            <label>Select Date & Time</label>
                            <input
                                type="datetime-local"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>

                        <button className="btn-primary" onClick={handleBooking}>
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
