# Database Service

## Docker

If you want to use docker, first you need to install `docker` and `docker-compose`
Then you need to change directory to the root of the repository and run `docker-compose up`
It will run 2 services, a mysql service, and the nodejs api

If it's the first time you run the mysql service, you'll need to initialize the database with `init.sql` file located in `./db/scripts/init.sql`
In order to do this, you can follow the instructions:

+ run `docker ps`
+ find the line labeled as `mariadb`
+ copy its `CONTAINER ID`
+ run `docker exec -it CONTAINER_ID bash` (replace CONTAINER_ID by the CONTAINER ID you just copied)

With the above instructions you'll now be in mysql container and thus communicate with the database:

+ change directory to `/opt/db/scripts`
+ run `mysql --password=password cinema < init.sql` 

Now the database is initialized.

## Without docker

If you don't want to user docker, you'll need to run your own database and initialized it with the sql file on your own.
The instructions in the `Docker` section might be helpful.

And then, to run the api, you'll need to install nodejs on your computer and then follow the instructions:

+ change directory to the root of the repositorye
+ run `npm install`
+ run `npm run start`

Now the database and the api are running

## More

The api is associated with the port `8080`
The mysql database is associated with the port `3306`

The api will try to connect to the database with the following informations:

+ Database host: `db`
+ Database name: `cinema`
+ Database user: `root`
+ Database password: `password`
