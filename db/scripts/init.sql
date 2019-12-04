/*use cinema;*/

DROP TABLE IF EXISTS CustomerSeat;
create table CustomerSeat(
	customerID int,
	seatID int,
	roomID int,

	primary key (customerID, roomID, seatID)
);

DROP TABLE IF EXISTS Customer;
Create Table Customer(
	customerID int AUTO_INCREMENT,
	foodID int DEFAULT NULL,
	screeningID int NOT NULL,
	age int NOT NULL,
	royaltyProgram bool,

	primary key (customerID)
);

DROP TABLE IF EXISTS Screening;
Create table Screening(
	screeningID int AUTO_INCREMENT,
	movieID int,
	roomID int,
	begin datetime NOT NULL,
	end datetime NOT NULL,
	projectionTypeID int,

	primary key (screeningID)
);

DROP TABLE IF EXISTS MovieGenre;
create table MovieGenre(
	genreID int,
	movieID int,

	primary key (genreID, movieID)
);

DROP TABLE IF EXISTS MovieDirector;
create table MovieDirector(
	directorID int,
	movieID int,

	primary key (directorID, movieID)
);

DROP TABLE IF EXISTS MovieActor;
create table MovieActor(
	actorID int,
	movieID int,

	primary key (actorID, movieID)
);

DROP TABLE IF EXISTS MovieAdvertisement;
create table MovieAdvertisement(
	advertisementID int,
	movieID int,

	primary key (AdvertisementID, movieID)
);

DROP TABLE IF EXISTS Genre;
create table Genre(
	genreID int AUTO_INCREMENT,
	genreName varchar(20),

	primary key (genreID)
);

DROP TABLE IF EXISTS Movie;
Create table Movie(
	movieID int AUTO_INCREMENT,
	title varchar(50) NOT NULL,
	ageNeeded int NOT NULL,
	duration int,

	primary key(movieID)
);

DROP TABLE IF EXISTS Director;
create table Director(
	directorID int AUTO_INCREMENT,
	lastName varchar(20),
	firstName varchar(20),

	primary key (directorID)
);

DROP TABLE IF EXISTS Actor;
create table Actor(
	actorID int AUTO_INCREMENT,
	lastName varchar(20),
	firstName varchar(20),

	primary key (actorID)
);

DROP TABLE IF EXISTS Advertisement;
Create table Advertisement(
	adID int AUTO_INCREMENT,
	brandName varchar(20),
	duration int,

	primary key (adID)
);

DROP TABLE IF EXISTS ProjectionType;
create table ProjectionType(
	projectionTypeID int AUTO_INCREMENT,
	projectionTypeName varchar(10),
	price int,

	primary key (projectionTypeID)
);

DROP TABLE IF EXISTS Food;
Create Table Food(
	foodID int AUTO_INCREMENT,
	foodName varchar(20) NOT NULL,
	typeFood varchar(10) CHECK (typeFood IN ('drink', 'eat', 'mix')),
	price int NOT NULL,

	primary key (foodID)
);

DROP TABLE IF EXISTS RoomSeat;
create table RoomSeat(
	seatID int,
	roomID int,
	available bool NOT NULL DEFAULT TRUE,

	primary key (seatID, roomID)
);

DROP TABLE IF EXISTS Room;
Create table Room(
	roomID int AUTO_INCREMENT,
	capacity int NOT NULL,

	primary key (roomID)
);

ALTER TABLE MovieGenre
	ADD FOREIGN KEY (movieID) references Movie(movieID) ON DELETE CASCADE,
	ADD FOREIGN KEY (genreID) references Genre(genreID) ON DELETE CASCADE;

ALTER TABLE MovieDirector
	ADD FOREIGN KEY (directorID) references Director(directorID) ON DELETE CASCADE,
	ADD FOREIGN KEY (movieID) references Movie(movieID) ON DELETE CASCADE;

ALTER TABLE MovieActor
	ADD FOREIGN KEY (actorID) references Actor(actorID) ON DELETE CASCADE,
	ADD FOREIGN KEY (movieID) references Movie(movieID) ON DELETE CASCADE;

ALTER TABLE MovieAdvertisement
	ADD FOREIGN KEY (advertisementID) references Advertisement(adID) ON DELETE CASCADE,
	ADD FOREIGN KEY (movieID) references Movie(movieID) ON DELETE CASCADE;

ALTER TABLE Customer
	ADD foreign key (foodID) references Food(foodID) ON DELETE SET NULL,
	ADD foreign key (screeningID) references Screening(screeningID) ON DELETE CASCADE;

ALTER TABLE Screening
	ADD foreign key (movieID) references Movie(movieID) ON DELETE SET NULL,
	ADD foreign key (roomID) references Room(roomID) ON DELETE SET NULL,
	ADD foreign key (projectionTypeID) references ProjectionType(projectionTypeID) ON DELETE SET NULL;

ALTER TABLE RoomSeat
	ADD FOREIGN KEY (roomID) references Room(roomID) ON DELETE CASCADE;

ALTER TABLE CustomerSeat
	ADD FOREIGN KEY (customerID) references Customer(customerID) ON DELETE CASCADE,
	ADD FOREIGN KEY (roomID) references Room(roomID) ON DELETE CASCADE,
	ADD FOREIGN KEY (seatID, roomID) references RoomSeat(seatID, roomID) ON DELETE CASCADE;


/*
insert into Food
values (1,'Coca','Drink',3000),
(2,'Sprite','Drink',3000),
(3,'Popcorn','Eatible',5000),
(4,'Popocorn + Cola','Mix',7000),
(5,'Candies','Eatible',4000)
;
select * from Food;
*/


