# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.0.0
FROM oven/bun:${BUN_VERSION} as base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Install node modules
COPY --link bun.lockb package.json ./
RUN bun install --ci

# Copy application code
COPY --link . .


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENV DATABASE_URL="libsql://novel-warbird-ntak666.turso.io"
ENV DATABASE_AUTH_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTQ0MjA1MTcsImlkIjoiMTE1YmQzYjItNTA3Yy0xMWVlLTg0MWItNmUxMDVlNzhmZDg5In0.92cKr6Q2PumShiT10djGZkGcG4O_SUjtDYSbfOvnic5MY36zGB57ILQRRKvvVi3vqf9Yyraabt4p9ekEmAcrDA"
CMD [ "bun", "src/index.tsx" ]
