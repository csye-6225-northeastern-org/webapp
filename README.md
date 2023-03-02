# Webapp
Web application built using node.js, express, sequelize and Postgresql part of CSYE 6225  

## Introduction
This is a Node.js project designed to solve the user management system. This project exposes APIs to create, update and get the user info from DB. Below is the info regarding endpoints:

**GET /v1/healthz:** returns a 200 status code, indicating the API is healthy.

**GET /v1/user/:id:** retrieves the user with the specified id, if it exists. It requires the request to have a Authorization header with the username and password encoded in base64. The API compares the provided credentials with the user data in the database and returns a 400, 401, 403, or 200 status code and the user data, depending on the result of the authentication and the existence of the user.

**POST /v1/user:** creates a new user with the data in the request body. The API checks if the provided username is unique and if it is a valid email address, and returns a 400 status code if either condition is not met. If the username is unique and the email address is valid, the API hashes the password with bcrypt and creates the user in the database, returning a 201 status code and the user data.

**PUT /v1/user/:id:** updates the user with the specified id with the data in the request body. The API returns a 400 status code if the request tries to modify fields that should not be modified (e.g., username, account creation time, and account update time).


**GET /v1/product/:id:** retrieves the product info with specified id, if it exists. This API doesn't require the request to have a Authorization header with the username and password encoded in base64. The API compares the provided credentials with the user data in the database and returns a 400, 200 status code and the user data, depending on the result of the authentication and the existence of the user.

**POST /v1/product:** creates a new product with the data in the request body. This API requires the request to have a Authorization header with the username and password encoded in base64 and returns a 400 status code if either condition is not met. This API expects sku to have unique. If the credentials do not match 401 status code error is thrown. If the payload is valid, the API creates the product in DB, returning a 201 status code and the user data.

**PUT /v1/product/:id:** updates the product with the specified id with the data in the request body. The API returns a 400 status code if the request tries to modify fields that should not be modified (e.g., owner_user_id, data_added and date_last_updated).

**PUT /v1/product/:id:** To partially update the product with the specified id, the data in the request body this API must be leveraged. The API returns a 400 status code if the request tries to modify fields that should not be modified (e.g., owner_user_id, data_added and date_last_updated).

**DELETE /v1/product/:id:** To delete the product from Database, the user should initially provide credentials. If authenticated, then if the resource is not present then 404 will be returned. If the resource exists, then 204 will be returned else appropriate status codes will be returned 

**GET /v1/product/:product_id/image:** retrieves all the images info with specified product id and S3 path with bucket name, if it exists. This API requires the request to have a Authorization header with the username and password encoded in base64. The API compares the provided credentials with the user data in the database and returns a 400, 200 status code and the user data, depending on the result of the authentication and the existence of the user.

**POST /v1/product/:product_id/image:** This end point takes the image as input to upload for the given product-id. As this is an authenticated end point, user's credentials will be validated and upon authentication, the file will be uploaded to S3 automatically to the bucket created by Terraform so that the S3 credentials are not  hardcoded

**DELETE /v1/product/:id:** To delete the image related to product-id, the user should initially provide a valid image-id with the product-id in the params. User must provide auth credentials. If authenticated, then if the resource is not present then 404 will be returned. If the resource exists, then 204 will be returned else appropriate status codes will be returned respectively

**GET /v1/product/:product_id/image/:image_id:** retrieves a single specific image info with specified product id and S3 path with bucket name, if it exists. This API requires the request to have a Authorization header with the username and password encoded in base64. The API compares the provided credentials with the user data in the database and returns a 400, 200 status code and the user data, depending on the result of the authentication and the existence of the user.

## Dependencies

- express
- body-parser
- sequelize
- bcrypt
- jest
- supertest

## Prerequisites
To run this project, you need to have Node.js and npm installed on your machine.

## Installation
To install the project, follow these steps:

1. Clone the repository to your local machine using ```git clone``` command
2. Navigate to the project directory.
3. Run ```npm install``` to install all dependencies.
4. Start the application with ```npm start```
5. To test the application run the command ```npm test``` 

## Build AMI using packer
Packer template that uses the Amazon EBS builder to create an Amazon Machine Image (AMI) that can be used to launch an EC2 instance. The AMI will include a web application along with the necessary software and configuration to run it 

The Packer template contains several variables and locals that are used to customize the build process:

- The "variable" block defines input variables that control various aspects of the build process, such as the AWS region, instance type, and SSH user. It also includes variables for the web application's database connection details and runtime environment.

- The "locals" block defines a local value that generates a timestamp to be used in the AMI name. This ensures that each build of the AMI has a unique name.

- The "source" block defines the Amazon EBS builder named "webapp" that creates the AMI. The builder filters the source AMI to find the most recent Amazon Linux 2 AMI and creates a new AMI with the web application installed. The AMI is shared with the specified AWS account.

- The "build" block defines the build process that uses the "webapp" source to create the AMI. The block includes several provisioners that run scripts and commands to configure the AMI:

- The "file" provisioners copy files to the AMI, such as the web application service file and the web application code archive.

- The "shell" provisioners run shell commands and scripts to configure the AMI, such as setting environment variables and running a build script to deploy the web application.

- The resulting AMI can then be used to launch an EC2 instance with the web application already installed and configured.

#### Steps to run packer
1. Run the command ```packer validate .``` to validate the existing packer config
2. Upon success, run ```packer build .``` to execute the packer script that creates AMI
3. The AMI's created will be with the format webapp-{timestamp} to make sure the AMIs created are unique

### build.sh - Bash script to setup the EC2-instance when created from AMI
- It sets up several variables for the paths of the web application archive, the extracted files, and the base directory of the code.
- It waits for 30 seconds to allow the EC2 instance to initialize.
- It updates and upgrades the packages on the EC2 instance and installs several packages, including Git, Node.js, and PostgreSQL 14.
- It initializes and starts the PostgreSQL 14 service, creates a new database named "csye6225" and a new user named "ec2-user" with the password "pass", and grants the user all privileges on the database.
- It installs the unzip package and moves the web application archive to the EC2 instance.
- It checks if the web application archive exists, unzips it to the extracted path, and installs the dependencies of the web application.
- It moves the web application service file to the systemd location, sets the file permissions, and enables and starts the web application service using systemd. It also displays the status of the web application service and its logs using journalctl.
### webapp.service 
- This service file makes sure the webapp application runs as stand alone and run the the application 
- In the service file, first the bash_profile will be loaded for the ENV variables and the application will be run so that then app can take the variables
  
## Usage
The application can be used by hitting the API using postman. Please give your credentials by selecting Basic auth under Authorization Tab in Postman

 
