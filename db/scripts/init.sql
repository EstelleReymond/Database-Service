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
	begin date NOT NULL,
	end date NOT NULL,
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


INSERT INTO ProjectionType
VALUES	
	(4, '2D', 7000),
	(1, '3D', 10000),
	(2, 'IMAX', 10000),
	(3, 'Talk', 2000);

INSERT INTO Actor
VALUES
	(9, 'Malek', 'Rami'),
	(1, 'HoSong', 'Kang'),
	(2, 'Teller', 'Miles'),
	(3, 'Jackman', 'Hugh'),
	(4, 'Diecapri', 'Leonardo'),
	(5, 'Reno', 'Jean'),
	(6, 'Osment', 'Haley Joel'),
	(7, 'Homs', 'Emmyl ou'),
	(8, 'Emile', 'Hirsch');

INSERT INTO Director
VALUES 
	(9, 'Singer', 'Bryan'),
    (1, 'Bong', 'Joon Ho'),
    (2, 'Chazelle', 'Damien'),
    (3, 'Nolan', 'Christopher'),
    (4, 'Boyle', 'Danny'),
    (5, 'Besson', 'Luc'),
    (6, 'Spielberg', 'Steven'),
    (7, 'Buck', 'Chris'),
    (8, 'Ovredal', 'André');

INSERT INTO Movie
VALUES 
	(1, 'Parasite',18,132),
    (2, 'Whiplash',12,107),
    (3, 'The Prestige', 6, 128),
    (4, 'The Beach', 16, 119),
    (5, 'Leon', 16, 103),
    (6, 'Artificial Intelligence', 12, 140),
    (7, 'Frozen', 0, 112),
    (8, 'Jane Doe Identity', 12, 90),
    (9, 'Celebration', 0, 180),
	(10, 'Bohemian Rhapsody',12, 135);

INSERT INTO Advertisement
VALUES	
	(6, 'Mercedes', 2),
	(1, 'Snickers', 1),
	(2, 'SamYang', 3),
	(3, 'Samsung', 2),
	(4, 'Sony', 6),
	(5, 'Häagen-Dazs', 1);

INSERT INTO Genre
VALUES
    (5, 'Horor'),
    (1, 'Drama'),
    (2, 'Thriller'),
    (3, 'Sci-fi'),
    (4, 'Animation');

INSERT INTO Screening
VALUES
	(1, 10 ,3, '2019-12-06 20:00:00', '2019-12-06 22:30:00', 4),
    (2, 10, 3, '2019-12-07 20:00:00', '2019-12-07 22:30:00', 4),
    (3, 9, 3, '2019-12-08 20:30:00', '2019-12-05 23:30:00', 3),
    (4, 1, 1, '2019-12-05 19:45:00', '2019-12-05 22:05:00', 2),
    (5, 1, 1, '2019-12-06 19:45:00', '2019-12-05 22:05:00', 2),
    (6, 1, 1, '2019-12-07 19:45:00', '2019-12-05 22:05:00', 2),
    (7, 1, 1, '2019-12-08 19:30:00', '2019-12-05 21:50:00', 2),
	(8, 7, 2, '2019-12-05 16:00:00', '2019-12-05 18:00:00', 1),
    (9, 7, 2, '2019-12-05 19:00:00', '2019-12-05 21:00:00', 1),
    (10, 7, 2, '2019-12-06 16:00:00', '2019-12-06 18:00:00', 1),
    (11, 7, 2, '2019-12-06 19:00:00', '2019-12-06 21:00:00', 1),
    (12, 7, 2, '2019-12-07 16:00:00', '2019-12-07 18:00:00', 1),
    (13, 7, 2, '2019-12-07 19:00:00', '2019-12-07 21:00:00', 1),
    (14, 7, 2, '2019-12-08 19:00:00', '2019-12-08 21:00:00', 1),
	(15, 10, 3, '2019-12-05 20:00:00', '2019-12-05 22:30:00', 4);

INSERT INTO MovieActor
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 10);



INSERT INTO MovieDirector
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
	(9, 10);

INSERT INTO MovieGenre
VALUES
	(1, 10),
    (2, 1),
    (1, 2),
    (2, 3),
    (2, 4),
    (1, 5),
    (3, 6),
    (4, 7),
    (2, 8);








