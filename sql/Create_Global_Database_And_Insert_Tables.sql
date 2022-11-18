
-- Initialize database
USE master
IF EXISTS(SELECT * FROM sys.databases WHERE name = 'DataIntensiveGlobal')
BEGIN
	DROP DATABASE DataIntensiveGlobal
END

BEGIN
	CREATE DATABASE DataIntensiveGlobal

	IF NOT EXISTS(SELECT * FROM sys.database_principals WHERE name = 'AdminUser')
	BEGIN
	-- Creates the login for server with password 'admin'.  
	CREATE LOGIN AdminUser   
	WITH PASSWORD = 'admin';  
	 
	-- Creates a database user for the login created above.  
	CREATE USER AdminUser FOR LOGIN AdminUser;  
	
	END
END
GO
  USE DataIntensiveGlobal
GO

-- Create all tables
CREATE TABLE Country(
	Id int IDENTITY	PRIMARY KEY NOT NULL,
	Name varchar(255) NULL 
)
CREATE TABLE Publisher(
	Id int IDENTITY PRIMARY KEY NOT NULL,
	Name varchar(255), 
	CountryId int FOREIGN KEY REFERENCES Country(Id)
)
CREATE TABLE Author(
	Id int IDENTITY PRIMARY KEY NOT NULL,
	Firstname varchar(255) NULL,
	Lastname varchar(255) NULL,
	CountryId int FOREIGN KEY REFERENCES Country(Id)
)

CREATE TABLE Customer(
	Id int IDENTITY PRIMARY KEY NOT NULL,
	Firstname varchar(255) NULL,
	Lastname varchar(255) NULL,
	Email varchar(255) NULL,
	Password varchar(255) NULL,
	CreatedDate DATE NULL,
	Address varchar(255) NULL
) 

CREATE TABLE [Language](
	Id int IDENTITY PRIMARY KEY NOT NULL,
	Name varchar(255) NULL,
	CountryId int FOREIGN KEY REFERENCES Country(Id)
)

CREATE TABLE Genre(
	Id int IDENTITY PRIMARY KEY  NOT NULL,
	Name varchar(255) NULL,
	CountryId int FOREIGN KEY REFERENCES Country(Id),
)

CREATE TABLE Book(
	Id int IDENTITY PRIMARY KEY NOT NULL,
	PublisherId int FOREIGN KEY REFERENCES Publisher(Id),
	AuthorId int FOREIGN KEY REFERENCES Author(Id),
	GenreId int FOREIGN KEY REFERENCES Genre(Id),
	LanguageId int FOREIGN KEY REFERENCES [Language](Id),
	CountryId int FOREIGN KEY REFERENCES Country(Id),
	Title varchar(255) NULL,
	PublishDate DATE NULL,
	AddedDate DATE NULL,
	Price float NULL,
	Description varchar(2000) NULL,
	PDF varbinary(max) NULL,
	CountrySpecificInfo varchar(max) NULL
)

CREATE TABLE [Order](
	Id int IDENTITY PRIMARY KEY NOT NULL,
	CustomerId int FOREIGN KEY REFERENCES Customer(Id),
	Total float NULL,
	OrderDate DATE NULL,
	CountryId int FOREIGN KEY REFERENCES Country(Id)
)

CREATE TABLE OrderItem(
	Id int IDENTITY PRIMARY KEY NOT NULL,
	OrderId int FOREIGN KEY REFERENCES [Order](Id),
	BookId int FOREIGN KEY REFERENCES Book(Id),
	CountryId int FOREIGN KEY REFERENCES Country(Id)
)



-- Fill the tables
INSERT INTO Country ([Name]) VALUES ('Finland')
INSERT INTO Country ([Name]) VALUES ('Sweden')
INSERT INTO Country ([Name]) VALUES ('Norway')

INSERT INTO [Language] ([Name], CountryId) VALUES ('Finish', 1)
INSERT INTO [Language] ([Name], CountryId) VALUES ('Swedish', 1)
INSERT INTO [Language] ([Name], CountryId) VALUES ('Norwegian', 1)
INSERT INTO [Language] ([Name], CountryId) VALUES ('English', 1)

INSERT INTO Publisher ([Name], CountryId) VALUES ('FantasyBookForAll', 1)
INSERT INTO Publisher ([Name], CountryId) VALUES ('EnglishBooks', 1)
INSERT INTO Publisher ([Name], CountryId) VALUES ('FinlandNationalSocietyOfSolidBooks', 1)

INSERT INTO Genre ([Name], CountryId) VALUES ('Fantasy', 1)
INSERT INTO Genre ([Name], CountryId) VALUES ('Horror', 1)
INSERT INTO Genre ([Name], CountryId) VALUES ('Comedy', 1)
INSERT INTO Genre ([Name], CountryId) VALUES ('Romance', 1)
INSERT INTO Genre ([Name], CountryId) VALUES ('Adventure', 1)
INSERT INTO Genre ([Name], CountryId) VALUES ('Scifi', 1)
INSERT INTO Genre ([Name], CountryId) VALUES ('Religion', 1)

INSERT INTO Customer (Firstname, Lastname, Email, [Password], CreatedDate, address) VALUES ('Frodo', 'Baggins', 'frodo.baggins@email.com','OneRing1234', GETDATE(), 'Bagshot Row, Bag End') 
INSERT INTO Customer (Firstname, Lastname, Email, [Password], CreatedDate, address) VALUES ('Harry', 'Potter', 'harry.potter@email.com','TheOneWhoLived', GETDATE(), '4 Privet Drive, Surrey') 
INSERT INTO Customer (Firstname, Lastname, Email, [Password], CreatedDate, address) VALUES ('Jon', 'Snow', 'jon.snow@email.com','IKnowNothing', GETDATE(), 'Castle Black, Room 1') 

INSERT INTO Author (Firstname, Lastname, CountryId) VALUES ('J.R.R', 'Tolkien', 1)
INSERT INTO Author (Firstname, Lastname, CountryId) VALUES ('G.R.R', 'Martin', 1)
INSERT INTO Author (Firstname, Lastname, CountryId) VALUES ('J.K', 'Rowling', 1)
---
INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (1, 1, 1, 1, 1, 'The Lord of the Rings', '1954-07-29', 59.99, GETDATE(), 'The Lord of the Rings is the saga of a group of sometimes reluctant heroes who set forth to save their world from consummate evil.', 0.24)
INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (2, 2, 1, 1, 1, 'A Game of Thrones', '1996-08-01', 29.99, GETDATE(), 'Several noble houses of continent called Westeros fight a civil war over who should be king, while an exiled princess across the Narrow tries to find her place in the world, and the kingdom is threatened by some rising supernatural threat from the north.', 0.24)
INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (1, 2, 1, 2, 1, 'A Clash of Kings', '1998-11-16', 19.99, GETDATE(), 'Most epic game of chairs continues in this next chapter of the epic fantasy series. How will get to sit on the Iron Throne? Noble Robb Stark from the North, iron willed Stannis Baratheon , sadistic Joffrey Baratheon (or Bran the Broken who totally has the best story...).', 0.24)
INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (2, 3, 2, 3, 1, 'Harry Potter and the Chamber of Secrets', '1998-07-02', 49.99, GETDATE(), 'Witness the adventures of Harry Potter, a second year student in the Hogrwads school of witchcraft and wizardly', 0.24)
INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (1, 3, 2, 1, 1, 'Harry Potter and the Deathly Hallows', '2007-07-21', 9.99, GETDATE(), 'The last battle for the Hogwarts begins. Who will be victorious, plot armor powered Harry Potter or much more powerful dark wizard Voldemort', 0.24)

INSERT INTO [Order] (CustomerId, Total, OrderDate, CountryId) VALUES (1, 159.96, GETDATE(), 1)
INSERT INTO [Order] (CustomerId, Total, OrderDate, CountryId) VALUES (2, 69.98, GETDATE(), 1)

INSERT INTO OrderItem (OrderId, BookId, CountryId) VALUES (1, 1, 1)
INSERT INTO OrderItem (OrderId, BookId, CountryId) VALUES (1, 2, 1)
INSERT INTO OrderItem (OrderId, BookId, CountryId) VALUES (1, 3, 1)
INSERT INTO OrderItem (OrderId, BookId, CountryId) VALUES (1, 4, 1)
INSERT INTO OrderItem (OrderId, BookId, CountryId) VALUES (2, 1, 1)
INSERT INTO OrderItem (OrderId, BookId, CountryId) VALUES (2, 5, 1)


select * from Book