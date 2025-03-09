# Yeah!Nah Voting

A simple voting application built with PocketBase (Go) and Preact, allowing users to cast "Yeah!" or "Nah!" votes on items.

## 🚀 Quick Start

### Prerequisites

- Go 1.21 or higher
- Node.js and npm
- make

### Development Mode

There are two ways to run the application in development mode:

1. **All-in-one development** (PocketBase with static file serving):

```bash
make dev
```

This will:

- Start PocketBase with auto-migrations enabled
- Enable hot-reload for the Go backend
- Serve the static frontend files

2. **Separate frontend development** (recommended for frontend work):

```bash
# Terminal 1: Run the backend
make dev

# Terminal 2: Run Vite dev server with hot reload
cd webapp
npm run dev
```

Using the separate frontend development setup gives you:

- Full Vite hot module replacement (HMR)
- Faster frontend development feedback
- Vite's development features like error overlay
- Frontend running on `localhost:5173` by default

### Production Build

Build the complete application:

```bash
make build
```

This will:

1. Clean the build directory
2. Build the Preact webapp
3. Copy static files to the appropriate location
4. Compile the Go binary

Run the production build:

```bash
make serve
```

### Docker Deployment

Build the Docker image:

```bash
docker build -t yeahnah .
```

Run the container:

```bash
docker run -p 8090:8090 -v $(pwd)/pb_data:/app/pb_data.prod.db yeahnah serve
```

For multi-platform builds:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t yourusername/yeahnah:latest .
```

Environment variables can be passed to the container:

```bash
docker run -p 8090:8090 \
  -v $(pwd)/pb_data:/app/pb_data \
  -e ADMIN_EMAIL=admin@example.com \
  -e ADMIN_PASSWORD=secretpassword \
  yeahnah serve
```

## 📁 Project Structure

```
.
├── main.go              # PocketBase entry point
├── webapp/             # Preact frontend application
│   ├── src/           # Frontend source code
│   └── dist/          # Built frontend files
└── migrations/        # PocketBase migrations
```

## 🛠 Available Commands

- `make dev` - Run in development mode with hot-reload
- `make build` - Build the complete application
- `make serve` - Run the built application
- `make migrate` - Run PocketBase migrations
- `make webapp` - Build only the frontend
- `make clean` - Clean build artifacts
- `make tidy` - Tidy Go modules
- `make fmt` - Format Go code

## 🔍 Important Notes

- Auto-migrations only work in development mode
- The frontend is statically served by PocketBase in production
- The build process automatically packages the Preact webapp with the PocketBase server

## 🙏 Acknowledgments

- [PocketBase](https://pocketbase.io/)
- [Preact](https://preactjs.com/)
- [Vite](https://vitejs.dev/)

Feel free to modify this README according to your specific project details and requirements!
