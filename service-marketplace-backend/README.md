# Service Marketplace - Laravel Backend

A comprehensive RESTful API backend for the Service Marketplace platform, built with Laravel 11.x.

## Features

### Discount & Interest System
- Time-based discount creation by service providers
- Interest-based discount activation (requires minimum customer interest)
- Customer interest limitation (max 3 active interests)
- Automatic promo code generation upon discount activation
- Email notifications to customers and providers

### Service Management
- Area-based service registration
- Provider availability calendar
- Skill & certification verification
- Service comparison
- Pre-service requirement checklists
- Service status tracking (requested → accepted → in progress → completed)
- Post-service issue reporting
- Service history with photos
- Provider response scoring
- Customer preference profiles
- Recurring service reminders
- Area demand insights
- In-app chat (booking-specific)

## Tech Stack

- **Framework**: Laravel 11.x
- **Authentication**: Laravel Sanctum (API tokens)
- **Database**: MySQL 8.0+
- **PHP**: 8.2+

## Project Structure

```
service-marketplace-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    # API endpoints
│   │   ├── Middleware/         # Custom middleware
│   │   └── Requests/           # Form validation
│   ├── Models/                 # Eloquent models
│   ├── Jobs/                   # Background jobs
│   └── Notifications/          # Email notifications
├── database/
│   ├── migrations/             # Database schema (17 tables)
│   └── seeders/                # Sample data
├── routes/
│   └── api.php                 # API routes
└── .env                        # Environment config
```

## Database Schema

### Core Tables
- `users` - All users (customers, providers, admins)
- `areas` - Geographic service areas
- `provider_areas` - Provider service area mappings

### Discount System
- `services` - Services offered by providers
- `discounts` - Time-based discounts with interest requirements
- `customer_interests` - Customer interest tracking
- `promo_codes` - Generated promotional codes

### Service Management
- `service_bookings` - Service requests and bookings
- `service_availability` - Provider calendar
- `certifications` - Provider certifications
- `service_requirements` - Pre-service checklists
- `booking_issues` - Issue tracking
- `service_photos` - Before/after photos
- `chat_messages` - In-app messaging
- `customer_preferences` - Customer preferences
- `service_reminders` - Recurring reminders
- `provider_response_scores` - Provider metrics

## Setup Instructions

### Prerequisites
- PHP 8.2 or higher
- Composer
- MySQL 8.0 or higher
- phpMyAdmin (optional, for database management)

### Installation

1. **Install Dependencies**
   ```bash
   cd service-marketplace-backend
   composer install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure Database**
   
   Edit `.env` file:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=service_marketplace
   DB_USERNAME=root
   DB_PASSWORD=your_password_here
   ```

4. **Create Database**
   
   Using phpMyAdmin:
   - Open phpMyAdmin
   - Create new database: `service_marketplace`
   - Collation: `utf8mb4_unicode_ci`
   
   Or using MySQL command:
   ```bash
   mysql -u root -p -e "CREATE DATABASE service_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

5. **Run Migrations**
   ```bash
   php artisan migrate
   ```

6. **Start Development Server**
   ```bash
   php artisan serve
   ```
   
   API will be available at: `http://localhost:8000/api`

## API Endpoints (To Be Implemented)

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user

### Services
- `GET /api/services` - List services (filtered by area)
- `POST /api/services` - Create service (provider)
- `GET /api/services/{id}` - Get service details
- `PUT /api/services/{id}` - Update service
- `POST /api/services/compare` - Compare services

### Discounts
- `POST /api/discounts` - Create discount (provider)
- `GET /api/discounts` - List discounts
- `GET /api/discounts/{id}` - Get discount details

### Interests
- `POST /api/interests` - Express interest (customer)
- `DELETE /api/interests/{id}` - Remove interest
- `GET /api/my-interests` - Get customer's interests

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking status

### Provider Features
- `POST /api/provider/availability` - Set availability
- `GET /api/provider/availability` - Get availability
- `POST /api/provider/certifications` - Upload certification
- `GET /api/provider/insights` - Area demand insights

### Customer Features
- `POST /api/customer/preferences` - Set preferences
- `GET /api/customer/preferences` - Get preferences
- `GET /api/customer/history` - Service history
- `POST /api/customer/reminders` - Set reminder

### Chat
- `POST /api/chat/send` - Send message
- `GET /api/chat/{booking_id}` - Get messages

## Development

### Create a New Model
```bash
php artisan make:model ModelName -m
```

### Create a New Controller
```bash
php artisan make:controller Api/ControllerName
```

### Create a New Job
```bash
php artisan make:job JobName
```

### Run Tests
```bash
php artisan test
```

## Scheduled Tasks

The following tasks run automatically:

- **Hourly**: Check discount activation (when interest count is met)
- **Daily**: Send service reminders

To run the scheduler:
```bash
php artisan schedule:work
```

## Email Configuration

For discount activation notifications, configure email in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@servicemarketplace.com
MAIL_FROM_NAME="Service Marketplace"
```

## Contributing

This is a custom project for a specific service marketplace platform.

## License

Proprietary - All rights reserved
