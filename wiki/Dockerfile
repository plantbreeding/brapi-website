# Build with : docker build -t brapicoordinatorselby/brapi-wiki ./
# run with : docker run --name="brapi-wiki" -v ./LocalSettings.php:/var/www/html/LocalSettings.php --network=bridge -p 80:80 -d brapicoordinatorselby/brapi-wiki

FROM mediawiki:1.35.1


WORKDIR /var/www/html/extensions
RUN echo "" \
# Download and extract PluggableAuth plugin
 && curl -sSL https://extdist.wmflabs.org/dist/extensions/PluggableAuth-REL1_35-2a465ae.tar.gz -o PluggableAuth-REL1_35-2a465ae.tar.gz \
 && tar -xzf PluggableAuth-REL1_35-2a465ae.tar.gz -C /var/www/html/extensions \
# Download and extract OpenIDConnect plugin
 && curl -sSL https://extdist.wmflabs.org/dist/extensions/OpenIDConnect-REL1_35-05d76c0.tar.gz -o OpenIDConnect-REL1_35-05d76c0.tar.gz \
 && tar -xzf OpenIDConnect-REL1_35-05d76c0.tar.gz -C /var/www/html/extensions \
# Download and extract php composer
 && curl -sSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer --version=1.10.20 \
# update apt-get
 && apt-get -y update \
 && apt-get -y autoremove \
 && apt-get clean \
# install libzip-dev and zip packages
 && apt-get install -y \
        libzip-dev \
        zip \
 && docker-php-ext-install zip \
# connect OpenIDConnect plugin with composer
 && echo '{ "extra": { "merge-plugin": { "include": [ "extensions/OpenIDConnect/composer.json" ] } } }' >> /var/www/html/composer.local.json

WORKDIR /var/www/html/
RUN composer update

# black list files from being served by apache
COPY ./block-files.conf /etc/apache2/conf-enabled