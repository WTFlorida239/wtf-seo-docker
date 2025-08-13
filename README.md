# SEO Analysis and Keyword Tracking Tool

This project is a full-stack web application designed to provide users with tools for SEO analysis, including site audits and keyword tracking. It is built with a modern, containerized technology stack for scalability and ease of development.

---

## Current State of Development

The application has a solid foundation with several core features fully implemented and ready for use.

- **Architecture:** The application is built with a Node.js/Express.js backend and a React frontend. The entire stack is containerized with Docker and orchestrated using Docker Compose.

- **Backend Features:**
  - **Database:** Uses `better-sqlite3` with tables for `Users`, `Keywords`, and `Competitors`.
  - **Authentication:** A complete Google OAuth 2.0 flow is implemented using `passport.js`, including protected API routes.
  - **Keywords API:** Provides full CRUD functionality for managing SEO keywords, scoped to the authenticated user.
  - **Site Audit API:** An endpoint (`/api/audit`) uses `puppeteer` to perform a live crawl of a given URL and returns key SEO metrics (title, meta description, headers, word count).

- **Frontend Features:**
  - **UI/UX:** Built with React and `react-router-dom`. The layout includes a dynamic `Header` and a `Sidebar` for authenticated users.
  - **Pages & API Integration:** Includes pages for a public `Landing` screen, a user `Dashboard`, a `Keywords` management page, and a `Site Audit` page. These pages are fully connected to the backend APIs.

---

## Technology Stack

- **Backend:** [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Frontend:** [React](https://reactjs.org/), [React Router](https://reactrouter.com/)
- **Database:** [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **Authentication:** [Passport.js](http://www.passportjs.org/) with Google OAuth 2.0
- **Web Scraping:** [Puppeteer](https://pptr.dev/)
- **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## Getting Started

Follow these instructions to get the application running on your local machine.

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation & Running the App

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  **Create the environment file:**
    Create a file named `.env` in the project root. Copy the contents of `.env.example` into it and fill in your specific credentials.

    **`.env.example`**
    ```
    # Google OAuth Credentials
    GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"

    # Session Secret
    SESSION_SECRET="choose-a-long-random-string-for-your-session-secret"
    ```

3.  **Build and run the application:**
    This single command builds the Docker images for the client and server, installs all dependencies, and starts both services.
    ```bash
    docker compose up --build
    ```

4.  **Access the application:**
    Once the build is complete and the containers are running, open your web browser and navigate to:
    `http://localhost:3000`

---

## Project Structure

```
.
├── .env              # Local environment variables (you must create this)
├── client/           # Contains the React frontend application
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── server/           # Contains the Node.js/Express backend application
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml  # Orchestrates the client and server containers
```

---

## Next Steps / Future Work

The following features are planned but not yet implemented:
- **Competitors Feature:** Build out the API and frontend UI for tracking competitor domains. The database table already exists.
- **Store Audit Results:** Create a new `Audits` table in the database to store the results of site audits for historical tracking.
- **Content Analysis:** Implement a `Content` model and associated services for more in-depth content analysis features.
- **Testing:** Add a comprehensive suite of unit and integration tests for both the backend and frontend.
