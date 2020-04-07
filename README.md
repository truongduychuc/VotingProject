# voting_project

### JSON API List.

Server URL: `http://localhost:4000`

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
* Body: 

        {
          username: [string],
          first_name: [string],
          last_name: [string],
          english_name: [string]
        }
