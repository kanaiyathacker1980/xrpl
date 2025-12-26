FROM debian:bullseye-slim

# Install WASI SDK
RUN apt-get update && apt-get install -y \
    wget \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt

RUN wget https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-20/wasi-sdk-20.0-linux.tar.gz \
    && tar xzf wasi-sdk-20.0-linux.tar.gz \
    && rm wasi-sdk-20.0-linux.tar.gz

ENV PATH="/opt/wasi-sdk-20.0/bin:${PATH}"

WORKDIR /workspace

CMD ["bash"]
