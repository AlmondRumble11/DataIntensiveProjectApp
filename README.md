# DataIntensiveProjectApp

# Introduction
Course project for CS31A0820 Data-Intensive Systems

The application is a basic prototype eCommerce website where customers can buy books and download them in PDF format. The website is available in three different countries: Finland, Sweden, and Norway. On every page the toolbar is located at the top of the page, and it consists of four main pages: My Location, Home, All Books, Login, Register, Profile, and Checkout. The users can also logout from the toolbar and change the language between English, Finnish, Swedish, and Norwegian. 
In the My Location page the users can choose which country’s website they want to use. They have the option to use their own location or choose the page manually. The home page consists of recently added books. The All Books page has a search functionality which can be used to search books by their title. The Profile page has the user’s details and the books they own. Users can download the PDF files of their owned books from the Profile page. The login, register and checkout pages are self-explanatory. Admin users can add new books from the Profile page by clicking the ‘Add new book’ button.

## Technologies used
- ReactJs is used for the client
- ExpressJs is used for the server
- SQL server is used for the database 
## Project plan
Link to project plan can be found here: https://drive.google.com/file/d/12JRgGJCR-jTZ7S1MGIQ27ZBT6Usq832l/view?usp=sharing 


# Prerequisite

1. SQL Server 2022 Developer (https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (image below)

- If that does not include SQL Server Management Studio (SSMS) you can download it using the link below:
    - Download link: https://aka.ms/ssmsfullsetup
    - Documentation: https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16

![image](https://user-images.githubusercontent.com/54431988/208126570-bada551d-804f-4490-a2b8-b1d68b17cfbc.png)

2. Node.Js (https://nodejs.org/en/download/current/)
3. IDE if want to develop


# Local installation

Clone or fork the repository

Run the following command in powershell or command prompt

```
git clone https://github.com/AlmondRumble11/DataIntensiveProjectApp.git
```

## Application installation and run the application

### Database

1. Open SQL management studio

![image](https://user-images.githubusercontent.com/54431988/208125725-c98e3b19-4727-4102-96cc-ef8bb5a68be4.png)

2. Connect to your local server using Windows Authentication (example shown below)
![image](https://user-images.githubusercontent.com/54431988/208117396-d28695d5-7443-42fb-af97-377a4f59f472.png)
3. File --> Open --> File and go to the sql folder of the cloned application (<Root>\DataIntensiveProjectApp\sql) (example shown below)
    
![image](https://user-images.githubusercontent.com/54431988/208122938-c1df754f-04d4-4521-9da7-75ca9793121e.png)

4. Once the file has been opened run the script using F5 or press excute button

![image](https://user-images.githubusercontent.com/54431988/208125859-a738d557-df97-40df-94ec-649b1f003073.png)

### Client

Go to client folder (<Root>\DataIntensiveProjectApp\client)
Install dependencies
```
npm install
```
Run the client
```
npm start
```


### Server

1. Go to server folder (<Root>\DataIntensiveProjectApp\server)
2. Install dependencies
```
npm install
```
3. Before running the server add .env file under the server folder (<Root>\DataIntensiveProjectApp\server)
Picture of how to create new file using Visual Studio Code:
    
![image](https://user-images.githubusercontent.com/54431988/208129747-a7c90d36-325f-4624-9531-7beda591b1e4.png)
    
.env file should contain following information so the application can access the created database
```
DB_USER=AdminUser
DB_PASSWORD="admin"
ACCESS_SECRET=slöf19823--!sd-.&¤¤
ADMIN_PWD=Password1234!
DB_SERVER=localhost
```
File structure should then look like this:

![image](https://user-images.githubusercontent.com/54431988/208122525-a73a588e-a798-4ee0-aae7-9744d2143eb5.png)

4. Run the server
```
npm start
```

# Existing users
There is an admin user that can add new books to database

Login information for admin user

Email
```
admin@admin.com
```
Password
```
Password1234!
```

# Problems
## Cannot connect to database
ConnectionError: Failed to connect to localhost:1433 - Could not connect (sequence)

If following error occurs go to open windows search by pressing Windows key on the keyboard (picture below) or open the Start menu

![image](https://user-images.githubusercontent.com/54431988/208123606-fb43d6ff-a092-45ed-bf0b-d1e34977abab.png)

Type 
```
Sql server 2019 configuration manager 
```
    
to open configuration manager and go the SQL Server Network Configuration --> Protocols for MSSQLSERVER and set TCP/IP status to Enabled (example shown below)

![image](https://user-images.githubusercontent.com/54431988/208127894-c9a54433-4bf0-4231-8e3b-2504caf91eef.png)



