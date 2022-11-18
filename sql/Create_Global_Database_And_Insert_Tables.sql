DROP DATABASE DataIntensiveGlobal

BEGIN
   CREATE DATABASE DataIntensiveGlobal
END
GO
  USE DataIntensiveGlobal
GO

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





