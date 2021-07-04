# Razor Grip Assessment Live Messanger Application
Please visit this link for the demo: https://razor-grip-assessment.herokuapp.com/

This a live messanger application as part of an assessment for a developer role.

## Road Map
The application was built with react and node using Auth0 as authentication.

1. The backend was developed first and the various routes was tested using postman api.
2. The front was then developed and the authentication with Auth0 was applied.
3. Then time was spent fixing bugs and testing each feature I could build even the ones I had to take out eventually.
4. Both mongodb and Auth0 accounts as well as heroku account was setup to deploy the application
5. After the final test the application was then deployed to heroku via the heroku cli

## Challenges
1. The idea for building the block feature did not turn out quite well.
   My initial logic was to build a form which would submit the user to be blocked to a blocked list database and then each time before a user connects it checks to see if one is on the blocked list but i could not figure it out into coding

2. Socket.io events are unique to it, I did not know that at first so I tried to change the.   event names to make it easier to read but then my application was not working, it was after I changed it back then the sockets were working.

## Usage based on socket.io behaivor

When you click on a users email on the left pane a socket connection is activated for that user; what socket calls a room
but this time is specific to that user so you have to stay in that channel to communicate with the user.
