<p align="center"><a href="https://laravel.com" target="_blank">
    CareMaster
    </a></p>

Clone Project
git clone git@github.com:Opest123/caremaster-test.git

installation
composer install

yarn / npm install

Serve project with Laravel Valet
valet secure
https://caremaster-test.test

.env
SANCTUM_STATEFUL_DOMAINS=*.caremaster-test.test,*.caremaster-test.test:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=caremaster_test
DB_USERNAME=root
DB_PASSWORD= 

Mail provider of choice for email notiifcation.
