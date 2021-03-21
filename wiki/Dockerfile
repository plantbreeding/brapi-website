# Build with : docker build -t brapicoordinatorselby/brapi-wiki ./
# run with : docker run --name="brapi-wiki" -v ./LocalSettings.php:/var/www/html/LocalSettings.php --network=bridge -p 80:80 -d brapicoordinatorselby/brapi-wiki

FROM mediawiki:1.35.1

RUN curl -sSL https://extdist.wmflabs.org/dist/extensions/PluggableAuth-REL1_35-2a465ae.tar.gz -o PluggableAuth-REL1_35-2a465ae.tar.gz
RUN tar -xzf PluggableAuth-REL1_35-2a465ae.tar.gz -C /var/www/html/extensions

RUN curl -sSL https://extdist.wmflabs.org/dist/extensions/OpenIDConnect-REL1_35-05d76c0.tar.gz -o OpenIDConnect-REL1_35-05d76c0.tar.gz
RUN tar -xzf OpenIDConnect-REL1_35-05d76c0.tar.gz -C /var/www/html/extensions

RUN curl -sSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer --version=1.10.20

RUN apt-get -y update \
     && apt-get -y autoremove \
     && apt-get clean \
     && apt-get install -y \
        libzip-dev \
        zip \
  && docker-php-ext-install zip

RUN echo '{ "extra": { "merge-plugin": { "include": [ "extensions/OpenIDConnect/composer.json" ] } } }' >> /var/www/html/composer.local.json

WORKDIR /var/www/html/
RUN composer update