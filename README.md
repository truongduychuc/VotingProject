# Voting Project
original source belongs to Le Quy Dinh & Truong Duy Chuc.

### Step to run the project.

* At `voting_project` folder, run ng serve to run Angular 7 client.
* Run `cd server` to head to `server` folder. At this folder, run `npm run dev` to have server running.
* Access client and server through these URLs:  
-Server URL: `http://localhost:4000`  Written by Nodejs.  
-Client URL: `http://localhost:4200`  Written by Angular 7.


###Server Json API List:  
Concatenate the server url before api url to access them, for instance, `localhost:4000/users/list`.  

**1**. Login  


* Url: `/auth/authenticate`  
* Method: `POST`
* body:

  
        {
          username: [string],  
          password: [string]
        }
    
* param: `{}`

**2**. Create new user
* Url: `/users/register`
* Method: `POST`
* Body: 

        {
          username: [string],
          first_name: [string],
          last_name: [string],
          english_name: [string]
        }
