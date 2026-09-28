# ---- dev: Vite dev server with hot reload (used by docker compose) ----
FROM node:24-alpine AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- build: compile to static files ----
FROM dev AS build
RUN npm run build

# ---- prod: nginx serves the static files and proxies /api to FastAPI ----
# The unprivileged image listens on 8080 and runs as non-root, as OpenShift requires.
FROM nginxinc/nginx-unprivileged:1.29-alpine AS prod
ENV BACKEND_URL=http://backend:8000
# Files in templates/ get ${VAR} substituted into /etc/nginx/conf.d at startup.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
