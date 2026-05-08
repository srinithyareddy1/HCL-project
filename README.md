# StayLux - Premium Hotel Booking Platform

**StayLux** is a full-stack, modularly-developed hotel reservation and property management platform. It offers a seamless user experience for finding, filtering, and booking premium hotel rooms, alongside a robust and secure Spring Boot backend architecture. 

This project was built progressively, prioritizing a strict separation of concerns and a unified API integration between a React/Vite frontend and a Java Spring Boot backend.

---

## 🏗 Architectural Diagram

The system follows a standard three-tier architecture: **Client (Frontend)** ↔ **Server (Backend API)** ↔ **Database**.

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend [React Vite Frontend - Port 5174]
        UI[User Interface / Pages]
        Context[React Context API State]
        API_Layer[api.js Integration Layer]
        
        UI --> Context
        UI --> API_Layer
    end

    %% Backend Layer
    subgraph Backend [Spring Boot Backend - Port 8080]
        Security[Spring Security + JWT Filter]
        Controllers[REST Controllers]
        Services[Business Logic Services]
        Repositories[Spring Data JPA]
        
        Security --> Controllers
        Controllers --> Services
        Services --> Repositories
    end

    %% Database Layer
    subgraph DB [PostgreSQL / MySQL]
        Database[(Relational DB)]
    end

    %% Connections
    API_Layer -- "HTTP / REST (JSON)" --> Security
    Repositories -- "Hibernate ORM" --> Database
```

---

## 🚀 Local Setup Instructions

The project has been separated into two distinct folders for modularity: `frontend/` and `hotelmgmt/` (backend). You will need to start both servers concurrently.

### 1. Backend Setup (`hotelmgmt/`)
The backend is a Maven-based Spring Boot application.

1. Navigate to the backend directory:
   ```bash
   cd hotelmgmt
   ```
2. Ensure you have your database running (MySQL/PostgreSQL) and update `src/main/resources/application.properties` with your credentials if necessary.
3. Build and run the server using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will start on **http://localhost:8080** and automatically seed initial hotel and room data into the database.*

### 2. Frontend Setup (`frontend/`)
The frontend is a fast React application powered by Vite.

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically start on **http://localhost:5174** (or 5173).*

---

## 💻 Technology Stack

### Frontend
- **Framework:** React.js powered by Vite
- **Styling:** Pure Vanilla CSS (`index.css`) emphasizing custom, dynamic glassmorphism and modern UI design. No heavy UI frameworks were used.
- **Routing:** React Router v6
- **Icons:** Lucide React

### Backend
- **Core:** Java 17+, Spring Boot 3.x
- **Security:** Spring Security with stateless JWT (JSON Web Tokens)
- **Database Access:** Spring Data JPA / Hibernate
- **Database Engine:** MySQL/PostgreSQL 

---

## 🧩 Development Methodology (Modular Approach)

The application was built using a highly modular and iterative approach. Rather than building a monolith, the project was carefully separated to ensure scalability and maintainability.

1. **Entity First, Controller Last (Backend):**
   - We started by designing strict database entities (`User`, `Hotel`, `Room`, `Booking`, `Promotion`).
   - Built the Repository layer (JPA).
   - Designed isolated Service layers containing the core business logic (e.g., preventing double-booking, calculating prices, validating promo codes).
   - Finally, exposed these services via RESTful Controllers with clean, consistent JSON DTOs.

2. **Security & RBAC Refactoring:**
   - Initially built with complex Role-Based Access Control (Admin vs User), the project was later streamlined. Administrative endpoints were removed to create a flat, user-first security model, dramatically simplifying the authentication flow.
   - JWT validation runs on a centralized filter before hitting any controller.

3. **Frontend Componentization:**
   - The UI was broken down into reusable components (`HotelCard`, `SearchBar`, etc.).
   - Global state (Authentication, Toast notifications) was abstracted into React Context Providers (`AuthContext`, `ToastContext`).
   - Hardcoded mock data was utilized initially to design the UI rapidly without backend dependencies.

4. **API Bridge Layer:**
   - Rather than sprinkling `fetch()` calls throughout React components, we established a centralized `api.js` layer.
   - `api.js` automatically handles JWT attachment, CORS configurations, error throwing, and Data Transfer Object (DTO) mapping to convert complex backend entity relations into flat, UI-friendly objects.

---

## 🔑 Core Features & API Endpoints

### 🏨 Hotel & Room Discovery
- **`GET /hotels/all`**: Fetches all properties.
- **`GET /hotels/search`**: Advanced filtering by location, price, rating, and category.
- **`GET /rooms/hotel/{id}`**: Retrieves all available rooms for a specific property.

### 📅 Booking Engine
- **`POST /bookings/book`**: Securely processes reservations. The backend enforces capacity checks and applies valid promo codes.
- **`GET /bookings/my-bookings`**: Retrieves the authenticated user's complete history (upcoming, completed, cancelled).
- **`DELETE /bookings/cancel/{id}`**: Processes cancellations.

### 🛡 Authentication & Loyalty
- **`POST /auth/login` & `/auth/register`**: JWT issuance and user creation.
- **`GET /bookings/my-loyalty`**: Returns the user's loyalty tier (Silver, Gold, Platinum) and accumulated points based on their booking history.

---

## ✨ Design Philosophy
StayLux prioritizes visual excellence. The UI features dark-mode aesthetics, rich gradients, dynamic micro-animations, and glassmorphism elements, ensuring a premium user experience that matches the luxury properties listed on the platform.
