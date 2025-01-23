## Angular Weather Application Documentation

Project Overview

This project is a weather application built with Angular 19. It is designed to display weather data for cities and includes features such as favorite cities, weather search, and history of searched cities.

Project Structure

The project is structured into several main folders, each serving specific purposes. Below is an explanation of each folder and its contents.

1. Components

This folder contains the reusable components of the application. Each component is a self-contained unit that can be imported into other components and pages. Components include element like result-list.component, to show all result list view to application

2. Environments

This folder contains configuration files for different environments (such as development). It is used to set variables like API URLs, environment-specific keys, and other configurations that differ between the development and production environments.
• environment.ts for development configurations.

3. Helpers

This folder includes helper functions or wrappers for external libraries. These wrappers are created to simplify and centralize the usage of third-party libraries throughout the application.

4. Layout

The layout folder includes the layout-related components, such as:
• DashboardComponent.Service: This is the main layout component for the weather application. It holds the structure of the app and is responsible for the overall presentation of pages (like the sidebar, aside, and lazy load modules with router-outlet).

5. Models

This folder contains the TypeScript models (interfaces and classes) that define the data structures used in the application, such as:
• Cache Model
• City Model
• Weather Model

6. Pages

This folder contains the application’s main pages:
• FavoritesPage: A page that displays the list of favorite cities.
• HistoryPage: A page that shows the history of searched cities.
• WeatherPage: The main page that displays the weather data for a selected city.

7. Services

This folder contains various services responsible for different functionalities within the app:
• CacheService: Prevents duplicate API calls by caching data locally.
• EventService: Used for emitting and listening to events throughout the application.
• FavoriteService: Allows users to add or remove cities from their list of favorites.
• StorageService: Provides utility functions for storing and retrieving data from the browser’s local storage.

Running the Project

Prerequisites

Before running the project, make sure you have the following installed:
• Node.js 20
• Angular CLI 19

Installation 1. Clone the repository:

git clone <repository-url>
cd <project-directory>

    2.	Install the dependencies:

npm install

Running the Application

To start the application in development mode:

1. Run the following command to start the application:

ng serve or npx ng service

2. Open your browser and navigate to:

http://localhost:4200

Build the Application

To build the application for production:

npm run build

This will compile and optimize the application for production, and the output will be placed in the dist/ folder.

Run Tests

To run unit tests for the application:

npm run test

This will run all unit tests using Karma and Jasmine.

Run Service Worker

If you have configured a service worker for offline functionality, you can serve the application with a local HTTP server like http-server: 1. Install http-server globally if not already installed:

npm install -g http-server

    2.	Build the application for production:

ng build --prod

    3.	Serve the built application with the service worker enabled:

http-server ./dist/weather-app/browser/

This will serve the application on a local server with the service worker enabled, allowing you to test offline capabilities.

Let me know if you need any modifications or additions!
