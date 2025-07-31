
FROM nginx:alpine


RUN rm -rf /usr/share/nginx/html/*


COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY Script.js /usr/share/nginx/html/


COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 8080


CMD ["nginx", "-g", "daemon off;"]