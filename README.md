# Voting Project
original source belongs to Le Quy Dinh & Truong Duy Chuc.
### JSON API List.

Server URL: `http://localhost:4000`  Written by Nodejs.  
Client URL: `http://localhost:4200`  Written by Angular 7.

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
