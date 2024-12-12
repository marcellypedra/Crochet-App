# System My Yarn.com Projects
## Author: Marcelly Pedra | 20040674
### Programe: Msc in Information Systems
### Module:	2425_TMD1 - Programming for Information Systems

### Description: 
Website where the user can track their crochet projects.
Users can create an account;
Users can create, update e delete projects.

* Documentation:
   https://drive.google.com/drive/folders/1YNTVuR12VdAW1-lMuSQWXsh91LgQ4WgP?usp=drive_link


## Prepare System to run locally
1. git clone https://github.com/marcellypedra/Crochet-App.git

2. Configure inbound port 3000 in your machine

3. Make the script executable by giving it the correct permissions.

```chmod +x mysql.sh local.sh```

4. update the file ```mysql.sh```with your password and username

5. run ```mysql.sh``` to create and configurate MySQL database

6. Update file ```db.js``` with your MySQL password;

7. run  ```local.sh``` to install all necessary apps for create API.

8. Update your ```package.json``` file with script for test "mocha test/unittest.test.js"

8. Deploy the system running:
```node server.js nohup &``

9. Run unit tests with the following command:
```npm test``

## Main Features (CRUD Operations Details):

### CREATE

Create User's account (implemented)
Create projects (Implemented)
Add materials (Implemented)

 
### READ 
User's Login (Implemented)
View Projects (implemented)

 
### UPDATE 
Reset user's password (Implemented)
Update project details(Implemented)
Insert pictures (Implemented)
Change projects' status (Implemented)


### DELETE 
Delete materials (Implemented)




