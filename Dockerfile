# syntax=docker/dockerfile:1.6

############################
# Base Python image
############################
FROM --platform=$BUILDPLATFORM python:3.12-slim AS py-base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

############################
# Backend dependencies
############################
FROM py-base AS backend-deps
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

############################
# Backend runtime
############################
FROM py-base AS backend
COPY --from=backend-deps /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=backend-deps /usr/local/bin /usr/local/bin

WORKDIR /app/backend
COPY backend /app/backend

ENV HOST=0.0.0.0 \
    PORT=8000

EXPOSE 8000
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

############################
# Frontend build
############################
FROM --platform=$BUILDPLATFORM node:20-alpine AS frontend-build
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY src /app/src
COPY public /app/public
COPY index.html /app/index.html
COPY postcss.config.mjs /app/postcss.config.mjs
COPY tailwind.config.ts /app/tailwind.config.ts
COPY vite.config.ts /app/vite.config.ts
RUN npm run build

############################
# Frontend runtime (nginx)
############################
FROM nginx:1.27-alpine AS frontend
COPY --from=frontend-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]