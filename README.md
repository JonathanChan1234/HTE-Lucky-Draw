# HTE Lucky Draw

Lucky Draw Serverless Web App

## Live Demo

Check out https://hte-lucky-draw.web.app

## Framework

### 🔨**Frontend**

-   Angular 14
-   Angular Material
-   NgRX

### 💻**Backend**

-   Firebase Firestore
-   Firebase Cloud Function (NodeJs Express)
-   Firebase Authentication

## Features

-   Participant Management (Creating, editing and deleting participants)
-   Prize Management (Creating, editing and deleting prizes)
-   Selecting multiple random participants from elgible list
-   Advanced Settings (Set if the draw requires the participants to sign in, Lock draw i.e. not allow participants to sign in)
-   Resetting Draw

## Development

```bash
yarn start
# Check out http://localhost:4200
```

## Build and Deploy

```bash
# Angular
# Please update the firebase.json and environment.prod.ts according to your project
yarn build:deploy
# Cloud Function
# Please put your service account key in the functions directory first
yarn functions:deploy
```

## Project Structure

    ├──functions
        ├── src
            ├── middleware                  # Middleware for validation and authentication
            ├── model                       # Data Model Class
            ├── router                      # Express Router (Controller)
            ├── service                     # Service handling business logic
            ├── utils                       # Utility functions
            ├── firebase.ts                 # Exporting Firebase Object (Auth, Firestore)
            ├── index.ts                    # Entry Class for Development (With development server)
            ├── index.prod.ts               # Entry Class for Production
    ├──src
        ├── app
            ├── build-specific              # For NgRx Redux Dev Tools
            ├── constants                   # Storing Screen Size Constants
            ├── draw                        # Non-lazy loading Components for Lucky Draw Dashboard
            ├── guard                       # Angular Guard for routing
            ├── http-interceptor            # Angular HTTP Interceptor for authentication
            ├── main                        # Angular NgModule For Lucky Draw Main Page
            ├── pages                       # Other non-lazy loading components (register, login page, etc.)
            ├── participants                # Angular NgModule For Participant Dashboard
            ├── prizes                      # Angular NgModule for Prize Dashboard
            ├── service                     # Angular Service (Used Globally)
            ├── shared                      # Commonly used utils comopnents for other modules
            ├── utility                     # Utils Functions
        ├── app-routing.module.ts           # Angular global routing module
        ├── app.component.html
        ├── app.component.scss
        ├── app.component.ts
        ├── app.module.ts
