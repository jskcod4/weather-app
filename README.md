## Angular Weather Application Documentation

### Project Overview

This project is a weather application built with Angular 19. It is designed to display weather data for cities and includes features such as favorite cities, weather search, and history of searched cities.

### Project Structure

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

- Cache Model
- City Model
- Weather Model

6. Pages

This folder contains the application’s main pages:

- FavoritesPage: A page that displays the list of favorite cities.
- HistoryPage: A page that shows the history of searched cities.
- WeatherPage: The main page that displays the weather data for a selected city.

7. Services

This folder contains various services responsible for different functionalities within the app:

- CacheService: Prevents duplicate API calls by caching data locally.
- EventService: Used for emitting and listening to events throughout the application.
- FavoriteService: Allows users to add or remove cities from their list of favorites.
- StorageService: Provides utility functions for storing and retrieving data from the browser’s local storage.

### Running the Project

Prerequisites

Before running the project, make sure you have the following installed:
• Node.js 20
• Angular CLI 19

### Installation

#### 1. Clone the repository:

```
https://github.com/jskcod4/weather-app.git
cd weather-app
```

#### 2. Install the dependencies:

```
npm install
```

### Running the Application

To start the application in development mode:

#### 1. Run the following command to start the application:

```
ng serve
```

or

```
npx ng service
```

#### 2. Open your browser and navigate to:

`http://localhost:4200/dashboard/weather`

### Build the Application

To build the application for production:

```
npm run build
```

This will compile and optimize the application for production, and the output will be placed in the dist/ folder.

### Run Tests

To run unit tests for the application:

```
npm run test
```

This will run all unit tests using Karma and Jasmine.

### Run Service Worker

If you have configured a service worker for offline functionality, you can serve the application with a local HTTP server like http-server:

1. Install http-server globally if not already installed:

```
npm install -g http-server
```

2. Build the application for production:

```
ng build --prod
```

3. Serve the built application with the service worker enabled:

```
http-server ./dist/weather-app/browser/
```

This will serve the application on a local server with the service worker enabled, allowing you to test offline capabilities.

### Optimization of Long Lists: Using Angular VirtualScroll

In the case of the Favorites History page, where a long list of data is already stored locally, I opted not to implement pagination. Since all the data is available at once, pagination isn’t necessary. However, if the list were fetched from the server, pagination would definitely be more applicable to manage performance.

Instead of pagination, I used Angular VirtualScroll[https://material.angular.io/cdk/scrolling/overview], a powerful component designed to optimize rendering performance for large lists. This component only renders visible items in the list, which significantly reduces the number of DOM elements that need to be managed, ensuring that the application remains responsive even when handling large datasets.

Key Benefits of Angular VirtualScroll:

1. Improved Performance: It renders only the visible items, reducing the load on the browser and improving overall performance.

2. Memory Efficiency: By limiting the number of DOM elements, it reduces memory consumption, making the app more efficient.

3. Seamless User Experience: Despite the large number of items, users experience smooth scrolling and faster interactions without delays or jank.

4. Easy Integration: It can be seamlessly integrated with Angular applications, offering a simple solution to optimize long lists without the complexity of traditional pagination.

This approach ensures that the app remains fast and user-friendly while avoiding unnecessary complexity.

### Using CacheService for Efficient Data Handling

In this project, I implemented a custom CacheService that stores previously made queries in a cache and returns the stored value when the same query is made again, avoiding redundant API calls. The cache is maintained for a configurable time period, which in this application is set to 5 minutes.

Benefits of Using CacheService:

1. Reduced API Calls: By storing and reusing query results, the service prevents repeated requests for the same data within the cache time, minimizing load on the server and improving performance.

2. Improved Response Time: With cached results, the app can instantly retrieve data without waiting for an API response, enhancing user experience.

3. Optimized Resource Usage: Reducing API calls helps save on bandwidth and reduces pressure on the server, making the application more efficient overall.

4. Customizable Cache Duration: The cache duration is configurable (set to 5 minutes here), providing flexibility in how long data is retained in the cache.

### Advantages of Using Block Element Modifier (BEM)

1. Clear Structure: BEM promotes a clean and structured naming convention, dividing styles into blocks, elements, and modifiers. This approach avoids complex or conflicting CSS selectors.

2. Scalability: Ideal for large-scale projects where multiple developers are involved, BEM ensures consistency in naming, making the codebase easier to understand and extend.

3. Reusability: By breaking styles into modular components (blocks, elements), you can reuse these components across different parts of the application, improving maintainability.

4. Avoiding Global Styles: BEM encourages the use of isolated components, which minimizes the risk of unintended style overrides and conflicts.

5. Performance: With clear and specific selectors, BEM reduces the likelihood of redundancy and ensures styles are applied efficiently.

### Advantages of NgRx Translate:

1. Centralization of Translations: NgRx Translate allows keeping all translations in one place, making it easy to maintain and manage multilingual content.

2. Multilingual Support: The project supports both Spanish and English, allowing users to easily switch between the two languages.

3. Scalability: By using NgRx, translations can be managed in an efficient and scalable manner, resulting in optimal performance even with a large number of translations.

Deployment:

To implement NgRx Translate, translations were configured in separate JSON files for each language, and through an NgRx store, the global state of translations is managed, facilitating switching between languages dynamically in the user interface.
