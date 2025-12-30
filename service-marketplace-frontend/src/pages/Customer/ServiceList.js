import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Services.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(response.data.services || []);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category ? service.category === category : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="service-page">
            <div className="service-header">
                <h1>Browse Services</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Home Services">Home Services</option>
                        <option value="Repairs">Repairs</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Consulting">Consulting</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading services...</div>
            ) : (
                <div className="service-grid">
                    {filteredServices.map(service => (
                        <div key={service.id} className="service-card">
                            <div className="service-info">
                                <h3>{service.name}</h3>
                                <p className="category">{service.category}</p>
                                <p className="description">{service.description}</p>
                                <p className="price">${service.base_price}</p>
                            </div>
                            <Link to={`/services/${service.id}`} className="btn-view">
                                View Details
                            </Link>
                        </div>
                    ))}
                    {filteredServices.length === 0 && (
                        <div className="no-results">No services found matching your criteria.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ServiceList;
