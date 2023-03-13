FROM php:8.2.3-fpm

ARG user
ARG uid

RUN apt-get update && apt-get install -y \
    sudo \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

WORKDIR /var/www/back-end
COPY . /var/www/back-end

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN sudo useradd -G www-data,root -u 1000 -d /home/fando fando
RUN sudo chown -R fando:www-data /var/www
RUN sudo chown -R www-data:www-data storage

USER root

COPY . .
RUN composer install