# Build with : docker build -t brapi.org -f dev.Dockerfile ./
# run with : docker run --name="brapi.org" -p 8080:80 -d brapi.org

# All in one (build, run, delete container, delete image) :
# docker rm -f brapi.org && docker rmi brapi.org && docker build -t brapi.org -f dev.Dockerfile ./ && docker run --name="brapi.org" -p 80:80 brapi.org 
 
FROM richarvey/nginx-php-fpm

COPY ./ /var/www/html/

CMD ["/start.sh"]
