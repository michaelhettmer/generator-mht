FROM nginx:1.17.8-alpine

COPY public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx", "-g", "'daemon off;'"]