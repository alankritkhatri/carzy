# Product Specification: Carzy - Car Management and Showcase Platform

### URL 
[https://carzy.vercel.app/](https://carzy.vercel.app/)

### GitHub 
[https://github.com/alankritkhatri/carzy](https://github.com/alankritkhatri/carzy)

---

## 1. Product Overview
Carzy is a full-stack web application designed for car dealers, enthusiasts, and collectors to efficiently manage and showcase their car inventory. It combines advanced AI features, a robust backend, and a sleek, user-friendly interface to deliver a comprehensive platform for car management and public showcasing.

---

## 2. Key Features

### 2.1 Authentication & User Management
- **Secure Login**: Implements JWT-based secure authentication.
- **Registration & Login**: User account creation and secure access.
- **Role-Based Access Control (RBAC)**: Restricts or grants access to features based on user roles (e.g., admin, dealer, viewer).

### 2.2 Car Management
- **CRUD Operations**: Full support for creating, reading, updating, and deleting car listings.
- **Image Handling**: Support for uploading up to 10 images per car.
- **Tagging System**: Organize cars with customizable tags.
- **Public URL Generator**: Automatic generation of public shareable URLs for car listings.

### 2.3 AI Integration
- **Detail Generation**: AI-powered generation of car details based on basic inputs.
- **Image Suggestions**: Integration with Lexica API for curated car image suggestions.
- **Metadata Extraction**: Automatic extraction of attributes like make, model, and year from car names.

### 2.4 Public Showcase
- **User Showcases**: Personalized URLs for individual users’ car inventories.
- **Public Listings**: Shareable car detail pages for external viewers.
- **Responsive Design**: Grid-based responsive car listing layouts for optimal viewing across devices.

---

## 3. Technical Stack

### 3.1 Frontend
- **Framework**: React with Vite for development speed.
- **State Management**: Redux Toolkit.
- **Styling**: Tailwind CSS for modern and responsive design.

### 3.2 Backend
- **Framework**: Node.js with Express.js.
- **Database**: MongoDB for storing user and car data.

### 3.3 APIs & Integrations
- **Authentication**: JSON Web Tokens (JWT).
- **Documentation**: Swagger/OpenAPI for API documentation.
- **HTTP Requests**: Axios for communication between the frontend and backend.
- **Image Suggestions**: Integration with Lexica API for AI-enhanced imagery.

### 3.4 Deployment
- **Containerization**: Dockerized frontend and backend for ease of deployment and scalability.
- **Proxy Setup**: Proxy configuration for API routing.
- **Hosting**: Deployed on Google Cloud for the backend and Vercel for the frontend.

---

## 4. Architecture
- **Microservices-Based**: Decoupled frontend and backend services in separate containers.
- **RESTful API Design**: Adheres to REST principles for API communication.
- **Environment Configurations**: Supports environment-based configurations for development, staging, and production.
- **Documentation**: Comprehensive API endpoint documentation using Swagger/OpenAPI.

---

## 5. User Experience Highlights
- Modern, responsive design for seamless user experience across devices.
- Intuitive workflows for creating and managing car listings.
- AI-driven enhancements to reduce user workload and improve listing quality.

---

## 6. Scalability & Security
- **Scalability**: Dockerized architecture allows scaling of frontend and backend services independently.
- **Security**: Role-based access control and secure JWT authentication for protected data access.

---

## 7. Future Enhancements
- Advanced analytics for car inventory trends.
- Real-time notifications for user interactions.
- Multi-language support for global accessibility.
