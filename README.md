# Voting Project
original source belongs to Le Quy Dinh & Truong Duy Chuc.

### Step to run the project.

* At `voting_project` folder, run `npx ng serve` to run Angular 7 client.
* Run `cd server` to head to `server` folder. At this folder, run `npm run dev` to have server running.
* Access client and server through these URLs:  
-Server URL: `http://localhost:4000`  Written by Nodejs.  
-Client URL: `http://localhost:4200`  Written by Angular 7.
* At server folder, you're free to run `npm run test` to have test cases running, remember to set up environment first. ^^

###Server Json API List:  
Concatenate the server url before api url to access them, for instance, `localhost:4000/users/list`.  


######Note:

        []: data types
**1**. Login  

** Request**
* Url: `/auth/authenticate`  
* Method: `POST`
* Body:

        {
          username: [string],  
          password: [string]
        }
    
* Params: `{}`  

** Response **
* Format
        
        {
          "first_name": [string],
          "last_name": [string],
          "english_name": [string],
          "position": [string],
          "token": [string]
        }
        
* Example

        {
          "first_name": "Admin",
          "last_name": "Admin",
          "english_name": "Admin",
          "position": "Admin",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWRfcm9sZSI6MSwiaWF0IjoxNTg2NTI3MjM5LCJleHAiOjE1ODY2MTM2Mzl9.bWVyH7RyEbvTS-jP7JyygxCyI264btXuZCdtdgNCByA"
        }        

**2**. Create new user

** Request**
* Url: `/users/register`
* Method: `POST`
* Body: 

        {
          username: [string],
          first_name: [string],
          last_name: [string],
          english_name: [string]
        }
        
        
** Response **
* Example

        {
          "message": "Created user successfully"
        }

**3**. User list

** Request **
* Url: `/users/list`
* Method: `GET`  
* Body: `{}`
* Query params: 
        
        {
          count: [integer],
          page: [integer],
          col: [string],
          type: [string],
          table: [string],
          search: [string],
        }
        
** Response **
* Format
        
        {
         data: [array<object>],
         total_counts: [integer],
         offset: [integer],
         limit: [integer],
         pages: [integer]
        }        

* Example 

        {
         data: [
           {
            id: 2,
            first_name: "Chuc",
            last_name: "Truong",
            english_name: "Gray",
            email: "gray@example.org",
            ava_url: "uploads/avatars/defaut_ava.jpg",
            role: {
             id: 2,
             name: "Engineer"
            },
            team: {
             id: 1,
             name: "No team"
            }
           }
         ],
         total_counts: 1,
         offset: 0,
         limit: 10,
         pages: 1
        }

**4**. Get current user profile

** Request ** 
* Url: `/users/profile`
* Method: `GET`
* Body: `{}`

** Response **
* Format
        
        {
         user: {
           id: [integer],
           id_role: [integer],
           id_team: [integer],
           is_active: [boolean],
           username: [string],
           email: [string],
           first_name: [string],
           last_name: [string],
           english_name: [string],
           phone: [string],
           address: [string],
           achievement: [string],
           ava_url: [string],
           role: [object],
           team: [object]
         },
         directManager: {
           first_name: [string],
           last_name: [string],
           english_name: [string]
         }
        }


