# SSE Calculator MCP Server

A stateful calculator server that uses Server-Sent Events (SSE) for real-time communication. This server implements the Model Context Protocol (MCP) for integration with AI assistants.

## Features

- Real-time calculator operations using SSE
- Stateful sessions for ongoing calculations
- History tracking for all calculations
- Web-based calculator interface
- MCP integration for AI assistants

## Architecture

The server is built using NestJS and implements the following components:

- **Session Service**: Manages calculator sessions and state
- **Calculator Service**: Performs calculation operations
- **SSE Controller**: Handles client connections and event streaming

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run start:dev
```

4. Open the calculator interface in your browser:

```
http://localhost:3000
```

## API Endpoints

### SSE Stream

```
GET /calculator/stream
```

Establishes an SSE connection and creates a new calculator session.

### Calculate

```
POST /calculator/calculate/:sessionId
```

Performs a calculation operation on the specified session.

Request body:
```json
{
  "operation": "add", // add, subtract, multiply, divide, clear
  "a": 5,
  "b": 3
}
```

### History

```
GET /calculator/history/:sessionId
```

Retrieves the calculation history for the specified session.

### Sessions

```
GET /calculator/sessions
```

Retrieves all active calculator sessions.

## MCP Integration

To use this server as an MCP server, add the following configuration to your MCP settings file:

```json
{
  "mcpServers": {
    "remote-calculator": {
      "url": "http://localhost:3000/calculator/stream",
      "disabled": false,
      "alwaysAllow": [],
      "timeout": 60
    }
  }
}
```

## Deployment Options

For production deployment, you can use the following options:

1. **Docker**: A Dockerfile is provided for containerized deployment
   - See `Dockerfile` and `docker-compose.yml` for configuration

2. **Smithery.ai**: Deploy directly from GitHub
   - See `SMITHERY_DEPLOYMENT.md` for detailed instructions
   - Configuration provided in `smithery.json`

3. **Heroku/DigitalOcean**: Cloud platform deployment
   - See `DEPLOYMENT.md` for step-by-step instructions

4. **Self-hosted**: Use NGINX or similar for SSL termination and load balancing

## Hosting Your Own MCP Server

After deploying your server, update your MCP client configuration to point to your hosted URL:

```json
{
  "mcpServers": {
    "remote-calculator": {
      "url": "https://your-deployed-url.com/calculator/stream",
      "disabled": false,
      "alwaysAllow": [],
      "timeout": 60
    }
  }
}
```

## License

MIT
