# Multi-stage Dockerfile - build stage + smaller runtime image

# ---- Build stage --------------------------------------------------------
FROM node:22.12.0 AS build

LABEL maintainer="Harsh Pahurkar <hpahurkar@myseneca.ca>"
LABEL description="Fragments node.js microservice (build stage)"

# Use /app as our working directory
WORKDIR /app

# Copy package manifests and install production dependencies only
COPY package.json package-lock.json ./

# Use npm ci for reproducible installs. Install production deps only to keep
# the runtime image small. This assumes tests/dev tooling isn't required at
# runtime.
RUN npm ci --only=production

# Copy source
COPY ./src ./src

# Copy our HTPASSWD file (used by tests / basic auth)
COPY ./tests/.htpasswd ./tests/.htpasswd


# ---- Runtime stage ------------------------------------------------------
# Use a smaller base image for runtime
FROM node:22.12.0-alpine AS runtime

LABEL description="Fragments node.js microservice (runtime)"

# Default port for the service
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

# Copy only the production node_modules and app source from the build stage
COPY --from=build /app /app

# Expose port and run
EXPOSE 8080
CMD ["node", "src/index.js"]
