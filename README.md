# Fitbit Sleep Server

This project is a simple web server that wraps the functionality of retrieving Fitbit sleep data. It exposes an HTTP endpoint to fetch sleep data based on a date input and uses basic authentication for security.

## Project Structure

```
fitbit-sleep-server
├── src
│   ├── get_fitbit_sleep_data.js  // Contains functionality to retrieve Fitbit sleep data
│   ├── server.js                  // Sets up the Express web server and defines endpoints
├── Dockerfile                      // Instructions to build the Docker image
├── .dockerignore                   // Files and directories to ignore when building the Docker image
├── package.json                    // Configuration file for npm, listing dependencies
├── package-lock.json               // Locks the versions of the dependencies
└── README.md                       // Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd fitbit-sleep-server
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the server:**
   ```
   node src/server.js
   ```

   The server will start on `http://localhost:3000`.

## Usage

To retrieve Fitbit sleep data, make a GET request to the following endpoint:

```
GET /sleep?date=<YYYY-MM-DD>
```

### Authentication

Basic authentication is required. Use the following credentials:

- Username: `your_username`
- Password: `your_password`

## Docker

To build and run the Docker container:

1. **Build the Docker image:**
   ```
   docker build -t fitbit-sleep-server .
   ```

2. **Run the Docker container:**
   ```
   docker run -p 3000:3000 fitbit-sleep-server
   ```

The server will be accessible at `http://localhost:3000`.

## License

This project is licensed under the MIT License.