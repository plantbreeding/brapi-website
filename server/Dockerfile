# Build with : docker build -t brapicoordinatorselby/brapi.org ./
# run with : docker run --name="brapi.org" -v /etc/ssl/:/etc/ssl/ --network=bridge -p 80:80 -p 443:443 -d brapicoordinatorselby/brapi.org

FROM nginx:stable

# install 'ps' command for process management 
RUN apt-get update && apt-get install -y procps

# nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./brapi-ssl.conf /etc/nginx/sites-available/brapi-ssl.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]