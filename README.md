# Colab
Colab is a Collaborative Live Share Editor, an editor connecting both tutors and students and going as far as offering a sanctuary to those seeking a shared development environment.

# How to run
#### Dependencies

- Node.JS (ver. 10.16.0+)
- MySQL (ver. 5.7+ set to legacy authentication mode)

##### Setting Up
Run the ```npm install``` command in the server directory to setup the node app and all it's dependencies

For development you can use the command ```npm run serve-dev``` to start the app

If you want to restart the server on changes you can start it in watch mode using ```npm run watch-server-dev```

Make sure to have the following env variables ready before you run
(Can also be done by adding them to your IDE's running configuration)

|ENV Var.|Description|Default
|:-------|:----------|:------
|PORT|The port number to start the server on|4213
|MYSQL_PORT|The port number the MySQL instance is running on|3306
|MYSQL_USER|Username of the active MySQL database instance's user|root
|MYSQL_PASS|Password of the active MySQL database instance's user|root
|JWT_KEY|The secret key used for JWT|colabisthebestproject