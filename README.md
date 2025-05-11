# goqii
This is assessment from Goqii.

Requirements:
1) An running web server with Apache or Nginx.
2) PHP - 8.2.12 with mysqli extension enabled.
3) MySql/MariaDB - any 1 of these will work with latest version
4) Node - v22.11.0
5) npm - 10.9.0

Once the above mentioned requirements are fullfilled, kindly follow below steps to setup the project.
Steps
1) Execute the database/sql_script.sql to create the database and the required users table.
Please be noted that if you wish to chose a different name for database, kindly change the database name in "Backend/db.php"
2) Place the folder Backend in document root of web server. Adjust it according if you wish to run with folder prefix or without folder name or a virtual host with/o sub-domain. Endpoint 'api.php' will be ready to serve based on the server setup.
3) Execute `npm install` in Frontend/user-management folder to install required extensions as per package.json
4) Execute `npm run start` to start the frontend application on development mode or execute `npm run build` to create an optimized production build and run it on webserver. 

