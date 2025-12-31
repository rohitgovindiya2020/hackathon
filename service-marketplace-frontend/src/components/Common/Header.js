import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLocationContext } from '../../contexts/LocationContext';
import api from '../../services/api';
import styles from './Header.module.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState({ services: [], providers: [], discounts: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const { user, logout } = useAuth();
    const { selectedLocation, updateLocation } = useLocationContext();
    const navigate = useNavigate();

    // Location Modal State
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [tempLocation, setTempLocation] = useState({
        country: '',
        state: '',
        city: '',
        area: ''
    });
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    // Fetch Countries
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

    // Cascading Location Effects
    useEffect(() => {
        if (tempLocation.country) {
            api.get(`/countries/${tempLocation.country}/states`)
                .then(res => setStates(res.data.states || []))
                .catch(err => console.error(err));
        } else {
            setStates([]);
        }
    }, [tempLocation.country]);

    useEffect(() => {
        if (tempLocation.state) {
            api.get(`/states/${tempLocation.state}/cities`)
                .then(res => setCities(res.data.cities || []))
                .catch(err => console.error(err));
        } else {
            setCities([]);
        }
    }, [tempLocation.state]);

    useEffect(() => {
        if (tempLocation.city) {
            api.get(`/cities/${tempLocation.city}/areas`)
                .then(res => setAreas(res.data.areas || []))
                .catch(err => console.error(err));
        } else {
            setAreas([]);
        }
    }, [tempLocation.city]);

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setTempLocation(prev => ({ ...prev, [name]: value }));
    };

    const openLocationModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTempLocation(selectedLocation);
        setIsLocationModalOpen(true);
    };

    const saveLocation = () => {
        updateLocation(tempLocation);
        setIsLocationModalOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }

        return () => {
            document.body.classList.remove('menu-open');
        };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const performSearch = async () => {
            if (searchQuery.trim().length > 1) {
                setIsSearching(true);
                try {
                    const response = await api.get(`/search?query=${encodeURIComponent(searchQuery)}`);
                    if (response.data.status === 'success') {
                        setResults(response.data.data);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error('Error performing global search:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults({ services: [], providers: [], discounts: [] });
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(performSearch, 400);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowSuggestions(false);
            setIsSearchVisible(false);
        }
    };

    const handleResultClick = (type, item) => {
        switch (type) {
            case 'service':
                navigate(`/services/${item.id}`);
                break;
            case 'provider':
                navigate(`/providers/${item.id}`);
                break;
            case 'discount':
                navigate(`/providers/${item.service_provider_id}/service/${item.service_id}/discount`);
                break;
            default:
                break;
        }
        setSearchQuery('');
        setShowSuggestions(false);
        setIsSearchVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.headerSearch}`)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <header className={`${styles.modernHeader} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={styles.headerContainer}>
                    {/* Logo */}
                    <Link to="/" className={styles.headerLogo}>
                        <div className={styles.logoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className={styles.logoText}>Service<span className={styles.logoHighlight}>Hub</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.desktopNav}>
                        <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Home
                        </NavLink>
                        {user?.role !== 'provider' && (
                            <>
                                <NavLink to="/services" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Services
                                </NavLink>
                                <NavLink to="/providers" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Providers
                                </NavLink>
                                <div className={styles.navItemLocation}>
                                    <span className={styles.navLink}>
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
                                        </svg>
                                        <Link to="/discounts/my-area" className={styles.navLinkText}>Discount at My Area</Link>
                                        <button className={styles.btnEditLocation} onClick={openLocationModal} title="Edit Area">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </span>
                                </div>
                            </>
                        )}
                        <NavLink to="/about" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            About
                        </NavLink>
                    </nav>

                    {/* User Actions & Mobile Btn */}
                    <div className={styles.headerActions}>
                        {/* Search Toggle Button */}
                        <button
                            className={`${styles.searchToggleBtn} ${isSearchVisible ? styles.active : ''}`}
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                            title="Toggle Search"
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {user ? (
                            <div className={styles.userMenu}>
                                <button
                                    className={styles.userProfileBtn}
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                >
                                    <div className={styles.userAvatar}>
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className={styles.userName}>{user.name}</span>
                                    <svg className={`${styles.dropdownArrow} ${isProfileDropdownOpen ? styles.open : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className={styles.profileDropdown}>
                                        <Link to={`/${user.role}/dashboard`} className={styles.dropdownItem} onClick={() => setIsProfileDropdownOpen(false)}>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Dashboard
                                        </Link>
                                        <Link to="/profile" className={styles.dropdownItem} onClick={() => setIsProfileDropdownOpen(false)}>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Profile
                                        </Link>

                                        <div className={styles.dropdownDivider}></div>
                                        <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logout}`}>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.authButtons}>
                                <Link to="/login" className={styles.btnSecondary}>Login</Link>
                                <Link to="/register" className={styles.btnPrimary}>Get Started</Link>
                            </div>
                        )}

                        <button
                            className={styles.mobileMenuBtn}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Bottom Search Section - Toggleable */}
                {isSearchVisible && (
                    <div className={`${styles.headerSearchSection} ${isSearchVisible ? styles.visible : ''}`}>
                        <div className={styles.headerSearch}>
                            <form onSubmit={handleSearch}>
                                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search services, experts, or discounts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                {isSearching && <div className={styles.searchSpinner}></div>}
                            </form>

                            {showSuggestions && (results.services.length > 0 || results.providers.length > 0 || results.discounts.length > 0) && (
                                <div className={styles.suggestionsList}>
                                    {results.services.length > 0 && (
                                        <div className={styles.suggestionGroup}>
                                            <div className={styles.groupLabel}>Services</div>
                                            {results.services.map((service) => (
                                                <div key={`s-${service.id}`} className={styles.suggestionItem} onClick={() => handleResultClick('service', service)}>
                                                    <div className={styles.suggestionIcon}>🛠️</div>
                                                    <div className={styles.suggestionInfo}>
                                                        <span className={styles.suggestionName}>{service.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {results.providers.length > 0 && (
                                        <div className={styles.suggestionGroup}>
                                            <div className={styles.groupLabel}>Professionals</div>
                                            {results.providers.map((pro) => (
                                                <div key={`p-${pro.id}`} className={styles.suggestionItem} onClick={() => handleResultClick('provider', pro)}>
                                                    <div className={styles.suggestionIcon}>👤</div>
                                                    <div className={styles.suggestionInfo}>
                                                        <span className={styles.suggestionName}>{pro.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {results.discounts.length > 0 && (
                                        <div className={styles.suggestionGroup}>
                                            <div className={styles.groupLabel}>Special Offers</div>
                                            {results.discounts.map((discount) => (
                                                <div key={`d-${discount.id}`} className={styles.suggestionItem} onClick={() => handleResultClick('discount', discount)}>
                                                    <div className={styles.suggestionIcon}>🏷️</div>
                                                    <div className={styles.suggestionInfo}>
                                                        <span className={styles.suggestionName}>{discount.service?.name}</span>
                                                        <span className={styles.suggestionMeta}>{discount.discount_percentage}% OFF in {discount.address?.city}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                {/* Search in Mobile Menu */}
                <form className={styles.mobileSearch} onSubmit={handleSearch}>
                    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <nav className={styles.mobileNav}>
                    <Link to="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Home
                    </Link>
                    {user?.role !== 'provider' && (
                        <>
                            <Link to="/services" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Services
                            </Link>
                            <Link to="/providers" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Providers
                            </Link>
                        </>
                    )}
                    <Link to="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        About
                    </Link>
                </nav>

                <div className={styles.mobileDivider}></div>

                {user ? (
                    <div className={styles.mobileUserSection}>
                        <Link to={`/${user.role}/dashboard`} className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link to="/profile" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Profile
                        </Link>
                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={`${styles.mobileNavLink} ${styles.logout}`}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className={styles.mobileAuthButtons}>
                        <Link to="/login" className={styles.btnSecondary} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                        <Link to="/register" className={styles.btnPrimary} onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                    </div>
                )}
            </div>

            {
                isLocationModalOpen && (
                    <div className={styles.locationModalOverlay}>
                        <div className={styles.locationModal}>
                            <div className={styles.modalHeader}>
                                <h3>Select Your Area</h3>
                                <button className={styles.btnClose} onClick={() => setIsLocationModalOpen(false)}>&times;</button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Country</label>
                                    <select name="country" value={tempLocation.country} onChange={handleLocationChange}>
                                        <option value="">Select Country</option>
                                        {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>State</label>
                                    <select name="state" value={tempLocation.state} onChange={handleLocationChange} disabled={!tempLocation.country}>
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>City</label>
                                    <select name="city" value={tempLocation.city} onChange={handleLocationChange} disabled={!tempLocation.state}>
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Area</label>
                                    <select name="area" value={tempLocation.area} onChange={handleLocationChange} disabled={!tempLocation.city}>
                                        <option value="">Select Area</option>
                                        {areas.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                                    </select>
                                </div>
                                <button className={styles.btnSaveLocation} onClick={saveLocation}>Save Location</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Header;
