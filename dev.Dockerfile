# Build with : Docker build -t brapi.org ./
# run with : docker run --name="brapi.org" -p 8080:80 -d brapi.org

FROM richarvey/nginx-php-fpm

COPY ./ /var/www/html/

CMD ["/start.sh"]