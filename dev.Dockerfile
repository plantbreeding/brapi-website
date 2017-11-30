# Build with : docker build -t brapi.org -f dev.Dockerfile ./
# run with : docker run --name="brapi.org" -p 8080:80 -d brapi.org

FROM richarvey/nginx-php-fpm

COPY ./ /var/www/html/

CMD ["/start.sh"]