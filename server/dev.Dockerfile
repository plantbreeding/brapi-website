# cd ./server
# clean : docker rm -f brapi.org && docker rmi brapi.org
# build : docker build -t brapi.org -f dev.Dockerfile ./
# run : docker run --name="brapi.org" -v C:/Users/ps664/Documents/BrAPI/brapi-website/site/:/var/www/html/ -p 8080:80 -d brapi.org

# All in one (build, run, delete container, delete image) :
# docker rm -f brapi.org && docker rmi brapi.org && docker build -t brapi.org -f dev.Dockerfile ./ && docker run --name="brapi.org" -p 80:80 brapi.org 
 
FROM richarvey/nginx-php-fpm

CMD ["/start.sh"]
