
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

	* Create databases
	* Create new user for the server that can be used to access the databases
	
*/

	CREATE DATABASE DataIntensiveGlobal
	CREATE DATABASE DataIntensiveFinland
	CREATE DATABASE DataIntensiveSweden
	CREATE DATABASE DataIntensiveNorway

	-- Maybe here?
	DROP LOGIN  AdminUser;
	DROP USER IF EXISTS AdminUser;
	CREATE LOGIN AdminUser WITH PASSWORD = 'admin';   
	CREATE USER AdminUser FOR LOGIN AdminUser;  
	GRANT CONNECT TO AdminUser


/*

	* Initialize the dummy PDF file for the books
	* Initialize countries for the loop

*/

--DECLARE @pdf VARBINARY(MAX)
--SELECT @pdf = BulkColumn
--FROM OPENROWSET(BULK N'C:\DataIntensive\DataIntensiveProjectApp\MockFiles\mock.pdf', SINGLE_BLOB) AS Document;
--SELECT @pdf, DATALENGTH(@pdf)
DECLARE @countryId INT 
SET @countryId=0


-- Initialize tables
WHILE ( @countryId <= 3)
BEGIN
	
	-- Select the database to be used
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


	-- Create AdminUser for each of the databases
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
		LastUpdatedBy TIMESTAMP NULL 
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

	CREATE TABLE BookDetail(
		Id int IDENTITY PRIMARY KEY NOT NULL,
		[Path] varchar(2000),
		[Filename] varchar(2000),
		DateAdded Date,
		ContentType varchar(10)
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
		[Description] varchar(2000) NULL,
		BookDetailId int FOREIGN KEY REFERENCES BookDetail(Id) ON DELETE CASCADE,
		CountrySpecificInfo varchar(max) NULL
	)

	CREATE TABLE [Order](
		Id int IDENTITY PRIMARY KEY NOT NULL,
		CustomerId int FOREIGN KEY REFERENCES Customer(Id) ON DELETE CASCADE,
		Total float NULL,
		OrderDate DATE NULL,
		CountryId int FOREIGN KEY REFERENCES Country(Id)
	)

	CREATE TABLE OrderItem(
		Id int IDENTITY PRIMARY KEY NOT NULL,
		CustomerId int FOREIGN KEY REFERENCES Customer(Id) ON DELETE CASCADE,
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
	GRANT SELECT ON "dbo"."BookDetail" TO AdminUser
	GRANT SELECT ON "dbo"."Order" TO AdminUser
	GRANT SELECT ON "dbo"."OrderItem" TO AdminUser

	-- Write permissions
	GRANT INSERT ON "dbo"."Customer" TO AdminUser
	GRANT INSERT ON "dbo"."Order" TO AdminUser
	GRANT INSERT ON "dbo"."OrderItem" TO AdminUser

	--Update permissions
	GRANT UPDATE ON "dbo"."Customer" TO AdminUser


	-- Fille the tables only if database that is in use is the Global database 
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

		INSERT INTO BookDetail ([Path], [Filename], DateAdded, ContentType) VALUES ('./server/book_pdf/', 'mock.pdf', GETDATE(), '.pdf');
		INSERT INTO BookDetail ([Path], [Filename], DateAdded, ContentType) VALUES ('./server/book_pdf/', 'mock.pdf', GETDATE(), '.pdf');
		INSERT INTO BookDetail ([Path], [Filename], DateAdded, ContentType) VALUES ('./server/book_pdf/', 'mock.pdf', GETDATE(), '.pdf');
		INSERT INTO BookDetail ([Path], [Filename], DateAdded, ContentType) VALUES ('./server/book_pdf/', 'mock.pdf', GETDATE(), '.pdf');
		INSERT INTO BookDetail ([Path], [Filename], DateAdded, ContentType) VALUES ('./server/book_pdf/', 'mock.pdf', GETDATE(), '.pdf');

		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], BookDetailId, CountrySpecificInfo) VALUES (1, 1, 1, 1, @countryId , 'The Lord of the Rings', '1954-07-29', 59.99, GETDATE(), 'The Lord of the Rings is the saga of a group of sometimes reluctant heroes who set forth to save their world from consummate evil.', 1, 0.24)
		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], BookDetailId, CountrySpecificInfo) VALUES (2, 2, 1, 1, @countryId , 'A Game of Thrones', '1996-08-01', 29.99, GETDATE(), 'Several noble houses of continent called Westeros fight a civil war over who should be king, while an exiled princess across the Narrow tries to find her place in the world, and the kingdom is threatened by some rising supernatural threat from the north.', 2, 0.24)
		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], BookDetailId, CountrySpecificInfo) VALUES (1, 2, 1, 2, @countryId , 'A Clash of Kings', '1998-11-16', 19.99, GETDATE(), 'Most epic game of chairs continues in this next chapter of the epic fantasy series. How will get to sit on the Iron Throne? Noble Robb Stark from the North, iron willed Stannis Baratheon , sadistic Joffrey Baratheon (or Bran the Broken who totally has the best story...).', 3, 0.24)
		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], BookDetailId, CountrySpecificInfo) VALUES (2, 3, 2, 3, @countryId , 'Harry Potter and the Chamber of Secrets', '1998-07-02', 49.99, GETDATE(), 'Witness the adventures of Harry Potter, a second year student in the Hogrwads school of witchcraft and wizardly', 4, 0.24)
		INSERT INTO Book (PublisherId, AuthorId, GenreId, LanguageId, CountryId, Title, PublishDate, Price, AddedDate, [Description], BookDetailId, CountrySpecificInfo) VALUES (1, 3, 2, 1, @countryId , 'Harry Potter and the Deathly Hallows', '2007-07-21', 9.99, GETDATE(), 'The last battle for the Hogwarts begins. Who will be victorious, plot armor powered Harry Potter or much more powerful dark wizard Voldemort', 5, 0.24)
	END
    SET @countryId  = @countryId  + 1
END
GO


/******************************************************

	* Create triggers for  DataIntensiveSweden database 

*******************************************************/

USE DataIntensiveSweden
GO
--/*	

--	Insert trigger for customer table
--	Gets the last inserted customer FROM DataIntensiveSweden.[dbo].Customer and 
--	inserts the customer with the same Id to DataIntensiveFinland.[dbo].Customer and DataIntensiveNorway.[dbo].Customer tables

--*/
DROP TRIGGER IF EXISTS customer_insert_trigger_sweden
GO
CREATE OR ALTER TRIGGER customer_insert_trigger_sweden
ON DataIntensiveSweden.[dbo].Customer
AFTER INSERT
AS
BEGIN
	DECLARE @customerId int; 
	SET @customerId = (SELECT TOP 1 Id FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC);
	
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveFinland.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, [Address] FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
	END;
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveNorway.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, [Address] FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
	END;
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveGlobal.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, [Address] FROM DataIntensiveSweden.[dbo].Customer ORDER BY Id DESC ;
	END;
END;	
GO


--/*	

--	Update trigger for customer table
--	Gets the last updated customer FROM DataIntensiveSweden.[dbo].Customer and 
--	updates the customer with the same Id to DataIntensiveFinland.[dbo].Customer and DataIntensiveNorway.[dbo].Customer tables

--*/
DROP TRIGGER IF EXISTS customer_update_trigger_sweden
GO
CREATE OR ALTER TRIGGER  customer_update_trigger_sweden
ON DataIntensiveSweden.[dbo].Customer
AFTER UPDATE
AS
BEGIN
	DECLARE @lastCustomerId int;
	DECLARE @Firstname varchar(255);
	DECLARE @Lastname varchar(255);
	DECLARE @email varchar(255);
	DECLARE @password varchar(255);
	DECLARE @createdDate DATETIME;
	DECLARE @address varchar(255);
	DECLARE @lastUpdatedBy DATETIME;
	

	SET @lastCustomerId = (SELECT TOP 1 Id 
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @Firstname = (SELECT TOP 1 Firstname 
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @Lastname = (SELECT TOP 1 Lastname 
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @email = (SELECT TOP 1 Email 
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @password = (SELECT TOP 1 [Password] 
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @createdDate = (SELECT TOP 1 CreatedDate 
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @address = (SELECT TOP 1 [Address]
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @lastUpdatedBy = (SELECT TOP 1 LastUpdatedBy 
	FROM DataIntensiveSweden.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveNorway.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveSweden.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveNorway.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 

	WHERE 
		DataIntensiveNorway.[dbo].Customer.Id = @lastCustomerId
	END


	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveFinland.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveSweden.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveFinland.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 
	WHERE 
		 DataIntensiveFinland.[dbo].Customer.Id = @lastCustomerId
	END

	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveGlobal.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveSweden.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveGlobal.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 
	WHERE 
		DataIntensiveGlobal.[dbo].Customer.Id = @lastCustomerId
	END

END	
GO

--/*	

--	Delete trigger for customer table
--	Gets the last deleted customer FROM DataIntensiveSweden.[dbo].Customer and 
--	deletes the customer with the same Id from DataIntensiveFinland.[dbo].Customer and DataIntensiveNorway.[dbo].Customer tables

--*/

DROP TRIGGER IF EXISTS customer_delete_trigger_sweden
GO
CREATE OR ALTER TRIGGER customer_delete_trigger_sweden
ON  DataIntensiveSweden.[dbo].Customer
FOR DELETE
AS 
BEGIN
	DECLARE @custId INT;
	SELECT @custId = del.Id FROM DELETED del;

	IF EXISTS(SELECT 1 FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveGlobal.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveGlobal.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @custId
	END
	IF EXISTS(SELECT 1 FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveFinland.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveFinland.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @custId
	END;

	IF EXISTS(SELECT 1 FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveNorway.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveNorway.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @custId
	END;
END;
GO


--/*******************************************************

--	* Create triggers for  DataIntensiveFinland database 

--********************************************************/

USE DataIntensiveFinland
GO

--/*	

--	Insert trigger for customer table
--	Gets the last inserted customer FROM DataIntensiveFinland.[dbo].Customer and 
--	inserts the customer with the same Id to DataIntensiveSweden.[dbo].Customer and DataIntensiveNorway.[dbo].Customer tables

--*/
DROP TRIGGER IF EXISTS customer_insert_trigger_finland
GO
CREATE OR ALTER TRIGGER customer_insert_trigger_finland
ON DataIntensiveFinland.[dbo].Customer
AFTER INSERT
AS
BEGIN
	DECLARE @customerId int; 
	SET @customerId = (SELECT TOP 1 Id FROM DataIntensiveFinland.[dbo].Customer ORDER BY Id DESC);
	
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveSweden.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, [Address] FROM DataIntensiveFinland.[dbo].Customer ORDER BY Id DESC ;
	END;
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveNorway.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, [Address] FROM DataIntensiveFinland.[dbo].Customer ORDER BY Id DESC ;
	END;
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveGlobal.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate, [Address] FROM DataIntensiveFinland.[dbo].Customer ORDER BY Id DESC ;
	END;
END;	
GO

--/*	

--	Update trigger for customer table
--	Gets the last updated customer FROM DataIntensiveFinland.[dbo].Customer and 
--	updates the customer with the same Id to DataIntensiveSweden.[dbo].Customer and DataIntensiveNorway.[dbo].Customer tables

--*/
DROP TRIGGER IF EXISTS customer_update_trigger_finland
GO
CREATE OR ALTER TRIGGER customer_update_trigger_finland
ON DataIntensiveFinland.[dbo].Customer
AFTER UPDATE
AS
BEGIN
	DECLARE @lastCustomerId int;
	DECLARE @Firstname varchar(255);
	DECLARE @Lastname varchar(255);
	DECLARE @email varchar(255);
	DECLARE @password varchar(255);
	DECLARE @createdDate DATETIME;
	DECLARE @address varchar(255);
	DECLARE @lastUpdatedBy DATETIME;
	

	SET @lastCustomerId = (SELECT TOP 1 Id 
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @Firstname = (SELECT TOP 1 Firstname 
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @Lastname = (SELECT TOP 1 Lastname 
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @email = (SELECT TOP 1 Email 
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @password = (SELECT TOP 1 [Password] 
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @createdDate = (SELECT TOP 1 CreatedDate 
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @address = (SELECT TOP 1 [Address]
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @lastUpdatedBy = (SELECT TOP 1 LastUpdatedBy 
	FROM DataIntensiveFinland.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveNorway.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveFinland.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveNorway.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
		--LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 

	WHERE 
		DataIntensiveNorway.[dbo].Customer.Id = @lastCustomerId
	END


	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveSweden.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveFinland.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveSweden.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
		--LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 
	WHERE 
		 DataIntensiveSweden.[dbo].Customer.Id = @lastCustomerId
	END

	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveGlobal.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveFinland.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveGlobal.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 
	WHERE 
		DataIntensiveGlobal.[dbo].Customer.Id = @lastCustomerId
	END

END	
GO

--/*	

--	Delete trigger for customer table
--	Gets the last deleted customer FROM DataIntensiveFinland.[dbo].Customer and 
--	deletes the customer with the same Id from DataIntensiveSweden.[dbo].Customer and DataIntensiveNorway.[dbo].Customer tables

--*/

DROP TRIGGER IF EXISTS customer_delete_trigger_finland
GO
CREATE OR ALTER TRIGGER customer_delete_trigger_finland
ON  DataIntensiveFinland.[dbo].Customer
FOR DELETE
AS 
BEGIN
	DECLARE @custId INT;
	SELECT @custId = del.Id FROM DELETED del;

	IF EXISTS(SELECT 1 FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveSweden.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveSweden.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @custId
	END
	IF EXISTS(SELECT 1 FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveNorway.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveNorway.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @custId
	END;

	IF EXISTS(SELECT 1 FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveGlobal.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveGlobal.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @custId
	END;
END;
GO


--/******************************************************

--	* Create triggers for DataIntensiveNorway database 

--*******************************************************/
USE DataIntensiveNorway
GO

--/*	

--	Insert trigger for customer table
--	Gets the last inserted customer FROM DataIntensiveNorway.[dbo].Customer and 
--	inserts the customer with the same Id to DataIntensiveSweden.[dbo].Customer and DataIntensiveFinland.[dbo].Customer tables

--*/
DROP TRIGGER IF EXISTS customer_insert_trigger_norway
GO
CREATE OR ALTER TRIGGER customer_insert_trigger_norway
ON DataIntensiveNorway.[dbo].Customer
AFTER INSERT
AS
BEGIN
	DECLARE @customerId int; 
	SET @customerId = (SELECT TOP 1 Id FROM DataIntensiveNorway.[dbo].Customer ORDER BY Id DESC);
	
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveFinland.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate,  [Address] FROM DataIntensiveNorway.[dbo].Customer ORDER BY Id DESC ;
	END;
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveSweden.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate,  [Address] FROM DataIntensiveNorway.[dbo].Customer ORDER BY Id DESC ;
	END;
		IF NOT EXISTS(SELECT 1 FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveGlobal.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate,  [Address] FROM DataIntensiveNorway.[dbo].Customer ORDER BY Id DESC ;
	END;
END;	
GO


--/*	

--	Update trigger for customer table
--	Gets the last updated customer FROM DataIntensiveNorway.[dbo].Customer and 
--	updates the customer with the same Id to DataIntensiveSweden.[dbo].Customer and DataIntensiveFinland.[dbo].Customer tables

--*/
DROP TRIGGER IF EXISTS customer_update_trigger_norway
GO
CREATE OR ALTER TRIGGER customer_update_trigger_norway
ON DataIntensiveNorway.[dbo].Customer
AFTER UPDATE
AS
BEGIN
	DECLARE @lastCustomerId int;
	DECLARE @Firstname varchar(255);
	DECLARE @Lastname varchar(255);
	DECLARE @email varchar(255);
	DECLARE @password varchar(255);
	DECLARE @createdDate DATETIME;
	DECLARE @address varchar(255);
	DECLARE @lastUpdatedBy DATETIME;
	

	SET @lastCustomerId = (SELECT TOP 1 Id 
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @Firstname = (SELECT TOP 1 Firstname 
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @Lastname = (SELECT TOP 1 Lastname 
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @email = (SELECT TOP 1 Email 
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @password = (SELECT TOP 1 [Password] 
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @createdDate = (SELECT TOP 1 CreatedDate 
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @address = (SELECT TOP 1 [Address]
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @lastUpdatedBy = (SELECT TOP 1 LastUpdatedBy 
	FROM DataIntensiveNorway.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveFinland.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveNorway.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveFinland.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 

	WHERE 
		DataIntensiveFinland.[dbo].Customer.Id = @lastCustomerId
	END


	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveSweden.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveNorway.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveSweden.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 
	WHERE 
		 DataIntensiveSweden.[dbo].Customer.Id = @lastCustomerId
	END

	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveNorway.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveNorway.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveGlobal.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
		--LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 
	WHERE 
		DataIntensiveGlobal.[dbo].Customer.Id = @lastCustomerId
	END

END	
GO

--/*	

--	Delete trigger for customer table
--	Gets the last deleted customer FROM DataIntensiveNorway.[dbo].Customer and 
--	deletes the customer with the same Id from DataIntensiveSweden.[dbo].Customer and DataIntensiveFinland.[dbo].Customer tables

--*/
DROP TRIGGER IF EXISTS customer_delete_trigger_norway
GO
CREATE OR ALTER TRIGGER customer_delete_trigger_nowway
ON  DataIntensiveNorway.[dbo].Customer
FOR DELETE
AS 
BEGIN
	DECLARE @custId INT;
	SELECT @custId = del.Id FROM DELETED del;

	IF EXISTS(SELECT 1 FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveSweden.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveSweden.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @custId
	END
	IF EXISTS(SELECT 1 FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveFinland.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveFinland.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @custId
	END;

	IF EXISTS(SELECT 1 FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveGlobal.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveGlobal.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveGlobal.[dbo].Customer WHERE Id = @custId
	END;
END;
GO

/*****************************************************

	* Create triggers for DataIntensiveGlobal database 

******************************************************/
USE DataIntensiveGlobal
GO
DROP TRIGGER IF EXISTS customer_insert_trigger_global
GO
CREATE OR ALTER TRIGGER customer_insert_trigger_global
ON DataIntensiveGlobal.[dbo].Customer
AFTER INSERT
AS
BEGIN
	DECLARE @customerId int; 
	SET @customerId = (SELECT TOP 1 Id FROM DataIntensiveGlobal.[dbo].Customer ORDER BY Id DESC);
	
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @customerId)
	BEGIN	
		INSERT INTO DataIntensiveNorway.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate,  [Address] FROm DataIntensiveGlobal.[dbo].Customer ORDER BY Id DESC ;
	END;
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveFinland.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])   SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate,  [Address] FROM DataIntensiveGlobal.[dbo].Customer ORDER BY Id DESC ;
	END;
	IF NOT EXISTS(SELECT 1 FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @customerId)
	BEGIN
		INSERT INTO DataIntensiveSweden.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address])  SELECT TOP 1 Firstname, Lastname, Email, [Password], CreatedDate,  [Address] FROm DataIntensiveGlobal.[dbo].Customer ORDER BY Id DESC ;
	END;
	RETURN
END	
GO

/*	

	Update trigger for customer table
	Gets the last updated customer FROM DataIntensiveNorway.[dbo].Customer and 
	updates the customer with the same Id to DataIntensiveSweden.[dbo].Customer and DataIntensiveFinland.[dbo].Customer tables

*/
DROP TRIGGER IF EXISTS customer_update_trigger_global
GO
CREATE OR ALTER TRIGGER customer_update_trigger_global
ON DataIntensiveGlobal.[dbo].Customer
AFTER UPDATE
AS
BEGIN
	
	DECLARE @lastCustomerId int;
	DECLARE @Firstname varchar(255);
	DECLARE @Lastname varchar(255);
	DECLARE @email varchar(255);
	DECLARE @password varchar(255);
	DECLARE @createdDate DATETIME;
	DECLARE @address varchar(255);
	DECLARE @lastUpdatedBy DATETIME;
	

	SET @lastCustomerId = (SELECT TOP 1 Id 
	FROM DataIntensiveGlobal.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @Firstname = (SELECT TOP 1 Firstname 
	FROM DataIntensiveGlobal.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @Lastname = (SELECT TOP 1 Lastname 
	FROM DataIntensiveGlobal.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @email = (SELECT TOP 1 Email 
	FROM DataIntensiveGlobal.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @password = (SELECT TOP 1 [Password] 
	FROM DataIntensiveGlobal.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @createdDate = (SELECT TOP 1 CreatedDate 
	FROM DataIntensiveGlobal.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @address = (SELECT TOP 1 [Address]
	FROM DataIntensiveGlobal.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	SET @lastUpdatedBy = (SELECT TOP 1 LastUpdatedBy 
	FROM DataIntensiveGlobal.[dbo].Customer 
	ORDER BY LastUpdatedBy DESC);

	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveFinland.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveGlobal.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveFinland.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 

	WHERE 
		DataIntensiveFinland.[dbo].Customer.Id = @lastCustomerId
	END


	IF EXISTS(SELECT * FROM DataIntensiveSweden.[dbo].Customer WHERE Id = 4 EXCEPT SELECT * FROM DataIntensiveGlobal.[dbo].Customer	)
	BEGIN

	UPDATE DataIntensiveSweden.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 
	WHERE 
		 DataIntensiveSweden.[dbo].Customer.Id = @lastCustomerId
	END

	IF  EXISTS(
		SELECT * FROM 
		DataIntensiveNorway.[dbo].Customer
		WHERE Id = @lastCustomerId
		EXCEPT
		SELECT * FROM 
		DataIntensiveGlobal.[dbo].Customer
		
	)
	BEGIN
	UPDATE DataIntensiveNorway.[dbo].Customer 
	SET 
		Firstname = @Firstname, 
		Lastname = @Lastname, 
		Email = @email, 
		[Password] = @password, 
		CreatedDate = @createdDate, 
	--	LastUpdatedBy = @lastUpdatedBy, 
		[Address] = @address 
	WHERE 
		DataIntensiveNorway.[dbo].Customer.Id = @lastCustomerId
	END


END	
GO

/*	

	Delete trigger for customer table
	Gets the last deleted customer FROM DataIntensiveNorway.[dbo].Customer and 
	deletes the customer from other tables

*/
DROP TRIGGER IF EXISTS customer_delete_trigger_global
GO
CREATE OR ALTER TRIGGER customer_delete_trigger_global
ON  DataIntensiveGlobal.[dbo].Customer
FOR DELETE
AS 
BEGIN
	DECLARE @custId INT;
	SELECT @custId = del.Id FROM DELETED del;

	IF EXISTS(SELECT 1 FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveSweden.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveSweden.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveSweden.[dbo].Customer WHERE Id = @custId
	END
	IF EXISTS(SELECT 1 FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveFinland.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveFinland.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveFinland.[dbo].Customer WHERE Id = @custId
	END;

	IF EXISTS(SELECT 1 FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @custId)
	BEGIN
	DELETE FROM DataIntensiveNorway.[dbo].OrderItem WHERE CustomerId = @custId
	DELETE FROM DataIntensiveNorway.[dbo].[Order] WHERE CustomerId = @custId
	DELETE FROM DataIntensiveNorway.[dbo].Customer WHERE Id = @custId
	END;
END;
GO



/*

	* Insert rest of the values to every table

*/
INSERT INTO DataIntensiveGlobal.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address]) VALUES ('Frodo', 'Baggins', 'dsfsdffsdfsdf.baggins@email.com','OneRing1234', GETDATE(),  'Bagshot Row, Bag End') 
INSERT INTO DataIntensiveGlobal.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address]) VALUES ('Harry', 'Potter', 'harry.potter@email.com','TheOneWhoLived', GETDATE(),  '4 Privet Drive, Surrey') 
INSERT INTO DataIntensiveGlobal.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate,  [Address]) VALUES ('Jon', 'Snow', 'jon.snow@email.com','IKnowNothing', GETDATE(),  'Castle Black, Room 1') 


DECLARE @countryId INT 
SET @countryId = 1
INSERT INTO DataIntensiveFinland.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (1, 159.96, GETDATE(), @countryId )
INSERT INTO DataIntensiveFinland.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (2, 69.98, GETDATE(), @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 1, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 2, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 3, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 4, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (2, 2, 1, @countryId )
INSERT INTO DataIntensiveFinland.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (2, 2, 5, @countryId )


SET @countryId = @countryId  + 1
INSERT INTO DataIntensiveSweden.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (1, 159.96, GETDATE(), @countryId )
INSERT INTO DataIntensiveSweden.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (2, 69.98, GETDATE(), @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 1, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 2, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 3, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 4, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (2, 2, 1, @countryId )
INSERT INTO DataIntensiveSweden.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (2, 2, 5, @countryId )


SET @countryId  = @countryId  + 1
INSERT INTO DataIntensiveNorway.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (1, 159.96, GETDATE(), @countryId )
INSERT INTO DataIntensiveNorway.[dbo].[Order] (CustomerId, Total, OrderDate, CountryId) VALUES (2, 69.98, GETDATE(), @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 1, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 2, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 3, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (1, 1, 4, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (2, 2, 1, @countryId )
INSERT INTO DataIntensiveNorway.[dbo].OrderItem (OrderId, CustomerId, BookId, CountryId) VALUES (2, 2, 5, @countryId )

--------------------------------
--USE [DataIntensiveSweden]
--GO

--UPDATE [dbo].[Customer]
--   SET [Firstname] = 'KAKKA'
--      ,[Lastname] = 'JUööe'
--      ,[Email] = 'sdjkfdfgdfgdfgdfgdfgdfdfgdfgfgddfgdfdffgdfgdfgdnbsd'
--      ,[Password] = 'kisdhfjksdfs'
	  
-- WHERE Id = 1
--GO

--DECLARE @lastCustomerId int;
--	SET @lastCustomerId = (SELECT TOP 1 Id
--	FROM DataIntensiveSweden.[dbo].Customer 
--	ORDER BY LastUpdatedBy DESC);
--UPDATE DataIntensiveFinland.[dbo].Customer 
--	SET 
--		Firstname =Sweden.Firstname, 
--		Lastname = Sweden.Lastname, 
--		Email = 'sdfsdfsd', 
--		[Password] = Sweden.[Password], 
--		CreatedDate = Sweden.CreatedDate, 
--		LastUpdatedBy = Sweden.LastUpdatedBy, 
--		[Address] = Sweden.[Address] 
--	FROM
--		DataIntensiveSweden.[dbo].Customer AS Sweden
--	WHERE 
--		Sweden.Id = @lastCustomerId

--DELETE FROM DataIntensiveSweden.[dbo].Customer where Id = 1
--select * from DataIntensiveSweden.[dbo].Customer
--select * from DataIntensiveFinland.[dbo].Customer
--select * from DataIntensiveNorway.[dbo].Customer

--DELETE FROM DataIntensiveGlobal.[dbo].Customer where Id = 1
--select * from DataIntensiveSweden.[dbo].Customer
--select * from DataIntensiveFinland.[dbo].Customer
--select * from DataIntensiveNorway.[dbo].Customer
--select * from DataIntensiveNorway.[dbo].[Order]
--select * from DataIntensiveNorway.[dbo].OrderItem



--UPDATE  DataIntensiveSweden.[dbo].Customer SET Firstname = 'asdfasdf', Password = 'asdfasdfasdfasdf' WHERE Id = 1
--select * from DataIntensiveSweden.[dbo].Customer
--select * from DataIntensiveFinland.[dbo].Customer
--select * from DataIntensiveNorway.[dbo].Customer
--select * from DataIntensiveGlobal.[dbo].Customer


--INSERT INTO DataIntensiveFinland.[dbo].Customer (Firstname, Lastname, Email, [Password], CreatedDate, LastUpdatedBy, [Address]) VALUES ('sss', 'Snosssw', 'jon.snow@esssmail.com','IKnowNsssothing', GETDATE(), GETDATE(), 'Castle Black, Room 1') 
--select * from DataIntensiveFinland.[dbo].Book inner join DataIntensiveFinland.[dbo].BookDetail  on DataIntensiveFinland.[dbo].BookDetail.Id = DataIntensiveFinland.[dbo].Book.BookDetailId
--select * from DataIntensiveFinland.[dbo].BookDetail 