import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Header, Footer } from '../../components/Common';
import { toast } from 'react-hot-toast';
import '../Dashboard.css'; // Reuse dashboard styles

const Settings = () => {
    const { user, login } = useAuth(); // login to refresh user? actually need a way to refresh user context
    // Assuming useAuth has a way to update user, or we just rely on page reload/navigation
    // Ideally useAuth should export a method to update local user state.
    // If not, we might need to manually update it or fetch me again.

    // For now, let's fetch 'me' on mount or use 'user' prop

    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile_no: user?.mobile_no || '',
        address: {
            country: user?.address?.country || '',
            state: user?.address?.state || '',
            city: user?.address?.city || '',
            area: user?.address?.area || '',
            area: user?.address?.area || ''
        }
    });

    const [loading, setLoading] = useState(false);

    // Location states
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/countries');
                setCountries(response.data.countries || []);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    // Cascading effects (similar to CustomerForm)
    useEffect(() => {
        if (formData.address.country) {
            api.get(`/countries/${formData.address.country}/states`)
                .then(res => setStates(res.data.states || []))
                .catch(err => console.error(err));
        } else {
            setStates([]);
        }
    }, [formData.address.country]);

    useEffect(() => {
        if (formData.address.state) {
            api.get(`/states/${formData.address.state}/cities`)
                .then(res => setCities(res.data.cities || []))
                .catch(err => console.error(err));
        } else {
            setCities([]);
        }
    }, [formData.address.state]);

    useEffect(() => {
        if (formData.address.city) {
            api.get(`/cities/${formData.address.city}/areas`)
                .then(res => setAreas(res.data.areas || []))
                .catch(err => console.error(err));
        } else {
            setAreas([]);
        }
    }, [formData.address.city]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['country', 'state', 'city', 'area', 'address'].includes(name)) {
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/profile', formData); // Use new endpoint
            if (response.data.success) {
                toast.success('Profile updated successfully');
                // Optionally update user context here if available
                // updateUser(response.data.user); 
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page-wrapper">
            <Header />
            <main className="dashboard-main section-padding">
                <div className="container">
                    <div className="section-header-row">
                        <h2>Profile Settings</h2>
                    </div>

                    <div className="settings-card card-modern animate-up">
                        <form onSubmit={handleSubmit} className="modern-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile_no"
                                    value={formData.mobile_no}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-section-title">Address Information</div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Country</label>
                                    <select name="country" value={formData.address.country} onChange={handleChange}>
                                        <option value="">Select Country</option>
                                        {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label>State</label>
                                    <select name="state" value={formData.address.state} onChange={handleChange} disabled={!formData.address.country}>
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>City</label>
                                    <select name="city" value={formData.address.city} onChange={handleChange} disabled={!formData.address.state}>
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label>Area</label>
                                    <select name="area" value={formData.address.area} onChange={handleChange} disabled={!formData.address.city}>
                                        <option value="">Select Area</option>
                                        {areas.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                                    </select>
                                </div>
                            </div>



                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Settings;
