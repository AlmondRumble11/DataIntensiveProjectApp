
/*
 
	* Go to master as each sql server has it
	* Drop databases if they already exist so they can be initialized again

*/
USE master
IF EXISTS(SELECT * FROM sys.databases WHERE name = 'DataIntensiveGlobal')
BEGIN
	DROP DATABASE DataIntensiveGlobal
	
END
IF EXISTS(SELECT * FROM sys.databases WHERE name = 'DataIntensiveFinland')
BEGIN
	DROP DATABASE DataIntensiveFinland
	
END
IF EXISTS(SELECT * FROM sys.databases WHERE name = 'DataIntensiveSweden')
BEGIN
	DROP DATABASE DataIntensiveSweden

END
	IF EXISTS(SELECT * FROM sys.databases WHERE name = 'DataIntensiveNorway')
BEGIN
	DROP DATABASE DataIntensiveNorway
	
END


/*
	
	* Create new user for the server that can be used to access the databases
	
*/
BEGIN
	CREATE DATABASE DataIntensiveGlobal
	CREATE DATABASE DataIntensiveFinland
	CREATE DATABASE DataIntensiveSweden
	CREATE DATABASE DataIntensiveNorway
	DROP LOGIN  AdminUser;
	DROP USER IF EXISTS AdminUser;
	CREATE LOGIN AdminUser WITH PASSWORD = 'admin';   
	CREATE USER AdminUser FOR LOGIN AdminUser;  
	GRANT CONNECT TO AdminUser
END

/*

	* Initialize the dummy PDF file for the books
	* Initialize countries for the loop

*/

DECLARE @pdf VARBINARY(MAX)
SELECT @pdf = BulkColumn
FROM OPENROWSET(BULK N'C:\DataIntensive\DataIntensiveProjectApp\MockFiles\mock.pdf', SINGLE_BLOB) AS Document;
SELECT @pdf, DATALENGTH(@pdf)
DECLARE @countryId INT 
SET @countryId=0


-- Initialize tables
WHILE ( @countryId <= 3)
BEGIN

	IF (@countryId = 0)
	BEGIN 
		USE DataIntensiveGlobal		
	END
	IF (@countryId = 1)
	BEGIN 
		USE DataIntensiveFinland 				
	END
	IF (@countryId = 2)
	BEGIN 
		USE DataIntensiveSweden 
	END
	IF (@countryId = 3)
	BEGIN
		USE DataIntensiveNorway 
	END
	DROP LOGIN  AdminUser;
	DROP USER IF EXISTS AdminUser;
	CREATE LOGIN AdminUser WITH PASSWORD = 'admin';   
	CREATE USER AdminUser FOR LOGIN AdminUser;  
	GRANT CONNECT TO AdminUser
    -- Create all tables
	CREATE TABLE Country(
		Id int IDENTITY	PRIMARY KEY NOT NULL,
		[Name] varchar(255) NULL 
	)
	CREATE TABLE Publisher(
		Id int IDENTITY PRIMARY KEY NOT NULL,
		[Name] varchar(255), 
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
		[Password] varchar(255) NULL,
		CreatedDate DATETIME NULL,
		[Address] varchar(255) NULL,
		LastUpdatedBy DATETIME NULL
	) 

	CREATE TABLE [Language](
		Id int IDENTITY PRIMARY KEY NOT NULL,
		[Name] varchar(255) NULL,
		CountryId int FOREIGN KEY REFERENCES Country(Id)
	)

	CREATE TABLE Genre(
		Id int IDENTITY PRIMARY KEY  NOT NULL,
		[Name] varchar(255) NULL,
		CountryId int FOREIGN KEY REFERENCES Country(Id),
	)

	IF(@countryId > 0)
	BEGIN
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
		[Description] varchar(2000) NULL,
		PDF int NULL,
		CountrySpecificInfo varchar(max) NULL
	)
	END
	IF(@countryId = 0)
	BEGIN
	CREATE TABLE Book(
		Id int PRIMARY KEY NOT NULL,
		PDF varbinary(max) NULL,
	)
	END

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

	-- Read permissions
	GRANT SELECT ON "dbo"."Country" TO AdminUser
	GRANT SELECT ON "dbo"."Publisher" TO AdminUser
	GRANT SELECT ON "dbo"."Author" TO AdminUser
	GRANT SELECT ON "dbo"."Customer" TO AdminUser
	GRANT SELECT ON "dbo"."Language" TO AdminUser
	GRANT SELECT ON "dbo"."Genre" TO AdminUser
	GRANT SELECT ON "dbo"."Book" TO AdminUser
	GRANT SELECT ON "dbo"."Order" TO AdminUser
	GRANT SELECT ON "dbo"."OrderItem" TO AdminUser

	-- Write permissions
	GRANT INSERT ON "dbo"."Customer" TO AdminUser
	GRANT INSERT ON "dbo"."Order" TO AdminUser
	GRANT INSERT ON "dbo"."OrderItem" TO AdminUser

	--Update permissions
	GRANT UPDATE ON "dbo"."Customer" TO AdminUser



	IF(@countryId > 0)
	BEGIN
		-- Fill the tables
		INSERT INTO Country ([Name]) VALUES ('Finland')
		INSERT INTO Country ([Name]) VALUES ('Sweden')
		INSERT INTO Country ([Name]) VALUES ('Norway')

		INSERT INTO [Language] ([Name], CountryId) VALUES ('Finish', @countryId )
		INSERT INTO [Language] ([Name], CountryId) VALUES ('Swedish', @countryId )
		INSERT INTO [Language] ([Name], CountryId) VALUES ('Norwegian', @countryId )
		INSERT INTO [Language] ([Name], CountryId) VALUES ('English', @countryId )

		INSERT INTO Publisher ([Name], CountryId) VALUES ('FantasyBookForAll', @countryId )
		INSERT INTO Publisher ([Name], CountryId) VALUES ('EnglishBooks', @countryId )
		INSERT INTO Publisher ([Name], CountryId) VALUES ('FinlandNationalSocietyOfSolidBooks', @countryId )

		INSERT INTO Genre ([Name], CountryId) VALUES ('Fantasy', @countryId )
		INSERT INTO Genre ([Name], CountryId) VALUES ('Horror', @countryId )
		INSERT INTO Genre ([Name], CountryId) VALUES ('Comedy', @countryId )
		INSERT INTO Genre ([Name], CountryId) VALUES ('Romance', @countryId )
		INSERT INTO Genre ([Name], CountryId) VALUES ('Adventure', @countryId )
		INSERT INTO Genre ([Name], CountryId) VALUES ('Scifi', @countryId )
		INSERT INTO Genre ([Name], CountryId) VALUES ('Religion', @countryId )

		INSERT INTO Author (Firstname, Lastname, CountryId) VALUES ('J.R.R', 'Tolkien', @countryId )
		INSERT INTO Author (Firstname, Lastname, CountryId) VALUES ('G.R.R', 'Martin', @countryId )
		INSERT INTO Author (Firstname, Lastname, CountryId) VALUES ('J.K', 'Rowling', @countryId )

		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (1, 1, 1, 1, @countryId , 'The Lord of the Rings', '1954-07-29', 59.99, GETDATE(), 'The Lord of the Rings is the saga of a group of sometimes reluctant heroes who set forth to save their world from consummate evil.', 0.24)
		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (2, 2, 1, 1, @countryId , 'A Game of Thrones', '1996-08-01', 29.99, GETDATE(), 'Several noble houses of continent called Westeros fight a civil war over who should be king, while an exiled princess across the Narrow tries to find her place in the world, and the kingdom is threatened by some rising supernatural threat from the north.', 0.24)
		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (1, 2, 1, 2, @countryId , 'A Clash of Kings', '1998-11-16', 19.99, GETDATE(), 'Most epic game of chairs continues in this next chapter of the epic fantasy series. How will get to sit on the Iron Throne? Noble Robb Stark from the North, iron willed Stannis Baratheon , sadistic Joffrey Baratheon (or Bran the Broken who totally has the best story...).', 0.24)
		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (2, 3, 2, 3, @countryId , 'Harry Potter and the Chamber of Secrets', '1998-07-02', 49.99, GETDATE(), 'Witness the adventures of Harry Potter, a second year student in the Hogrwads school of witchcraft and wizardly', 0.24)
		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], CountrySpecificInfo) VALUES (1, 3, 2, 1, @countryId , 'Harry Potter and the Deathly Hallows', '2007-07-21', 9.99, GETDATE(), 'The last battle for the Hogwarts begins. Who will be victorious, plot armor powered Harry Potter or much more powerful dark wizard Voldemort', 0.24)

		

	END
    SET @countryId  = @countryId  + 1
END

/*

	* Create triggers for  DataIntensiveSweden database 

*/
GO
USE DataIntensiveSweden
GO
DROP TRIGGER IF EXISTS customer_insert_trigger_sweden
GO
CREATE TRIGGER  customer_insert_trigger_sweden
ON DataIntensiveSweden.[dbo].Customer
AFTER INSERT
AS
BEGIN
	INSERT INTO DataIntensiveFinland.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])   SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
	INSERT INTO DataIntensiveNorway.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROm DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
END	
GO
INSERT INTO DataIntensiveSweden.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address]) VALUES ('Jon', 'Snow', 'sdfsdfsdfsdfsdfsdfsdf.sndfdfow@email.com','IKnowNothing', GETDATE(), GETDATE(), 'Castle Black, Room 1') 
select * from DataIntensiveSweden.[dbo].Customer
select * from DataIntensiveFinland.[dbo].Customer
select * from DataIntensiveNorway.[dbo].Customer

INSERT INTO DataIntensiveFinland.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])   SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
GO


DROP TRIGGER IF EXISTS customer_update_trigger_sweden
GO
CREATE OR ALTER TRIGGER  customer_update_trigger_sweden
ON DataIntensiveSweden.[dbo].Customer
AFTER UPDATE
AS
BEGIN
	DECLARE @lastCustomerId int;
	SET @lastCustomerId = (SELECT TOP 1 Id 
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy ASC);

	UPDATE DataIntensiveFinland.[dbo].Customer 
	SET 
		Firstname =Sweden.Firstname, 
		Lastname = Sweden.Lastname, 
		Email = Sweden.Email, 
		[Password] = Sweden.[Password], 
		CreatedDate = Sweden.CreatedDate, 
		LastUpdatedBy = Sweden.LastUpdatedBy, 
		[Address] = Sweden.[Address] 
	FROM
		DataIntensiveSweden.[dbo].Customer AS Sweden
	WHERE 
		Sweden.Id = @lastCustomerId


	UPDATE DataIntensiveNorway.[dbo].Customer 
	SET 
		Firstname = Sweden.Firstname, 
		Lastname = Sweden.Lastname, 
		Email = Sweden.Email, 
		[Password] = Sweden.[Password], 
		CreatedDate = Sweden.CreatedDate, 
		LastUpdatedBy = Sweden.LastUpdatedBy, 
		[Address] = Sweden.[Address] 
	FROM
		DataIntensiveSweden.[dbo].Customer AS Sweden
	WHERE 
		Sweden.Id = @lastCustomerId

END	

GO
USE [DataIntensiveSweden]
GO

UPDATE [dbo].[Customer]
   SET [Firstname] = 'KAKKA'
      ,[Lastname] = 'JUööe'
      ,[Email] = 'sdjkfdfgdfgdfgdfgdfgdfdfgdfgfgddfgdfdffgdfgdfgdnbsd'
      ,[Password] = 'kisdhfjksdfs'
	  
 WHERE Id = 1
GO

DECLARE @lastCustomerId int;
	SET @lastCustomerId = (SELECT TOP 1 Id
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);
UPDATE DataIntensiveFinland.[dbo].Customer 
	SET 
		Firstname =Sweden.Firstname, 
		Lastname = Sweden.Lastname, 
		Email = 'sdfsdfsd', 
		[Password] = Sweden.[Password], 
		CreatedDate = Sweden.CreatedDate, 
		LastUpdatedBy = Sweden.LastUpdatedBy, 
		[Address] = Sweden.[Address] 
	FROM
		DataIntensiveSweden.[dbo].Customer AS Sweden
	WHERE 
		Sweden.Id = @lastCustomerId
select * from DataIntensiveSweden.[dbo].Customer
select * from DataIntensiveFinland.[dbo].Customer
select * from DataIntensiveNorway.[dbo].Customer

/*

	* Create triggers for  DataIntensiveFinland database 

*/
GO
USE DataIntensiveFinland
GO
DROP TRIGGER IF EXISTS customer_insert_trigger
GO
CREATE TRIGGER  customer_insert_trigger
ON DataIntensiveFinland.[dbo].Customer
AFTER INSERT
AS
BEGIN
	INSERT INTO DataIntensiveSweden.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
	INSERT INTO DataIntensiveNorway.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
END	
GO
DROP TRIGGER IF EXISTS customer_update_trigger_finland
GO
CREATE TRIGGER  customer_update_trigger_finland
ON DataIntensiveFinland.[dbo].Customer
AFTER UPDATE
AS
BEGIN
	DECLARE @lastCustomerId int;
	SET @lastCustomerId = (SELECT TOP 1 Id 
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	UPDATE DataIntensiveSweden.[dbo].Customer 
	SET 
		Firstname = Finland.Firstname, 
		Lastname = Finland.Lastname, 
		Email = Finland.Email, 
		[Password] = Finland.[Password], 
		CreatedDate = Finland.CreatedDate, 
		LastUpdatedBy = Finland.LastUpdatedBy, 
		[Address] = Finland.[Address] 
	FROM
		DataIntensiveFinland.[dbo].Customer AS Finland
	WHERE 
		Finland.Id = @lastCustomerId


	UPDATE DataIntensiveNorway.[dbo].Customer 
	SET 
		Firstname = Finland.Firstname, 
		Lastname = Finland.Lastname, 
		Email = Finland.Email, 
		[Password] = Finland.[Password], 
		CreatedDate = Finland.CreatedDate, 
		LastUpdatedBy = Finland.LastUpdatedBy, 
		[Address] = Finland.[Address] 
	FROM
		DataIntensiveFinland.[dbo].Customer AS Finland
	WHERE 
		Finland.Id = @lastCustomerId

END	

/*

	* Create triggers for DataIntensiveNorway database 

*/
GO
USE DataIntensiveNorway
GO
DROP TRIGGER IF EXISTS customer_insert_trigger_norway
GO
CREATE TRIGGER customer_insert_trigger_norway
ON DataIntensiveNorway.[dbo].Customer
AFTER INSERT
AS
BEGIN
	INSERT INTO DataIntensiveFinland.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])   SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
	INSERT INTO DataIntensiveSweden.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROm DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
END	

GO
DROP TRIGGER IF EXISTS customer_update_trigger_norway
GO
CREATE TRIGGER customer_update_trigger_norway
ON DataIntensiveNorway.[dbo].Customer
AFTER UPDATE
AS
BEGIN
	DECLARE @lastCustomerId int;
	SET @lastCustomerId = (SELECT TOP 1 Id 
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	UPDATE DataIntensiveFinland.[dbo].Customer 
	SET 
		Firstname = Norway.Firstname, 
		Lastname = Norway.Lastname, 
		Email = Norway.Email, 
		[Password] = Norway.[Password], 
		CreatedDate = Norway.CreatedDate, 
		LastUpdatedBy = Norway.LastUpdatedBy, 
		[Address] = Norway.[Address] 
	FROM
		DataIntensiveNorway.[dbo].Customer AS Norway
	WHERE 
		Norway.Id = @lastCustomerId


	UPDATE DataIntensiveSweden.[dbo].Customer 
	SET 
		Firstname = Norway.Firstname, 
		Lastname = Norway.Lastname, 
		Email = Norway.Email, 
		[Password] = Norway.[Password], 
		CreatedDate = Norway.CreatedDate, 
		LastUpdatedBy = Norway.LastUpdatedBy, 
		[Address] = Norway.[Address] 
	FROM
		DataIntensiveNorway.[dbo].Customer AS Norway
	WHERE 
		Norway.Id = @lastCustomerId

END	

/*

	* Create triggers for DataIntensiveGlobal database 

*/
GO
USE DataIntensiveGlobal
GO
DROP TRIGGER IF EXISTS customer_insert_trigger_global
GO
CREATE TRIGGER  customer_insert_trigger_global
ON DataIntensiveGlobal.[dbo].Customer
AFTER INSERT
AS
BEGIN
	INSERT INTO DataIntensiveNorway.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROm DataIntensiveGlobal.[dbo].Customer ORDER BY Id DESC ;
	INSERT INTO DataIntensiveFinland.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])   SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROM DataIntensiveGlobal.[dbo].Customer ORDER BY Id DESC ;
	INSERT INTO DataIntensiveSweden.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address] FROm DataIntensiveGlobal.[dbo].Customer ORDER BY Id DESC ;
	RETURN
END	
GO




/*

	* Insert Rest of the values

*/
GO
INSERT INTO DataIntensiveSweden.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address]) VALUES ('Frodo', 'Baggins', 'dsfsdffsdfsdf.baggins@email.com','OneRing1234', GETDATE(), GETDATE(), 'Bagshot Row, Bag End') 
INSERT INTO DataIntensiveGlobal.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address]) VALUES ('Harry', 'Potter', 'harry.potter@email.com','TheOneWhoLived', GETDATE(), GETDATE(), '4 Privet Drive, Surrey') 
INSERT INTO DataIntensiveGlobal.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address]) VALUES ('Jon', 'Snow', 'jon.snow@email.com','IKnowNothing', GETDATE(), GETDATE(), 'Castle Black, Room 1') 


DECLARE @countryId INT 
SET @countryId=1
INSERT INTO DataIntensiveFinland.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (1, 159.96, GETDATE(), @countryId )
INSERT INTO DataIntensiveFinland.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (2, 69.98, GETDATE(), @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 1, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 2, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 3, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 4, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (2, 1, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (2, 5, @countryId )


SET @countryId  = @countryId  + 1
INSERT INTO DataIntensiveSweden.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (1, 159.96, GETDATE(), @countryId )
INSERT INTO DataIntensiveSweden.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (2, 69.98, GETDATE(), @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 1, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 2, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 3, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 4, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (2, 1, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (2, 5, @countryId )


SET @countryId  = @countryId  + 1
INSERT INTO DataIntensiveNorway.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (1, 159.96, GETDATE(), @countryId )
INSERT INTO DataIntensiveNorway.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (2, 69.98, GETDATE(), @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 1, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 2, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 3, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (1, 4, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (2, 1, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, BookId, CountryId) VALUES (2, 5, @countryId )


select * from DataIntensiveSweden.[dbo].Customer
select * from DataIntensiveFinland.[dbo].Customer
select * from DataIntensiveNorway.[dbo].Customer
select * from DataIntensiveGlobal.[dbo].Genre