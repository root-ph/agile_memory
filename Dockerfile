FROM nginx
COPY . /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/nginx.conf