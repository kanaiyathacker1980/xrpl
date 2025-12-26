# Build WASI SDK Docker Image

docker build -t wasi-sdk:latest .

# This creates a Docker image with WASI SDK for compiling C to WebAssembly
# Used by the hooks-compiler service
