# secrets

## Summary

Share your secrets anonyomusly app is a part of Authentication and Security tutorial using passport, mongoose, sessions, cookies, OAuth .

## Installation

To run the application:

 1. Download the GitHub zip file or clone the repository onto your local workstation:
    - [zip file](https://github.com/Amr097/secrets/archive/master.zip)
    - https://github.com/Amr097/secrets.git
    
 2. In your terminal cd to the file location, install these packages 
 `npm i body-parser connect-mongo dotenv ejs express express-session mongodb mongoose mongoose-findorcreate passport passport-facebook passport-google-oauth20 passport-   local-mongoose router session` 
  and run `node index.js` command to start the server at port 3000.
 
 3. The server should now be running at http://localhost:3000/, you may now navigate the app.

 ## Features

### 1. Registration Page

Safely register to the app, the user's password is saved hashed and salted to the database via `passport-local-mongoose` or sign in using either google or facebook for extra safety.
![registration](https://user-images.githubusercontent.com/127849429/232618929-dd714167-93dd-4ece-95ad-e1b8426f2059.png)
![db](https://user-images.githubusercontent.com/127849429/232619042-46f3a805-75a8-4d65-ad33-6c393bbef7c0.png)

### 2. Submit a secret anonymously
![sharesecrets](https://user-images.githubusercontent.com/107508295/181660841-c943ede1-854e-48ad-afad-50880c5a6dc0.PNG)


