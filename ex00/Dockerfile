# Use nginx alpine for small image size
FROM nginx:alpine

# Copy game files to nginx html directory with proper ownership
COPY --chown=nginx:nginx index.html /usr/share/nginx/html/
COPY --chown=nginx:nginx styles.css /usr/share/nginx/html/
COPY --chown=nginx:nginx script.js /usr/share/nginx/html/

# Expose port 80 (default HTTP port)
EXPOSE 80

# nginx starts automatically with the base image
