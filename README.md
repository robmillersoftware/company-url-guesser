# Company Name to URL Selector
## Description
This is a simple app that invoked Google's Custom Search Engine API to retrieve company domain names. It works about as simply as possible in that it relies on Google to determine the best match and just returns the first hit. This works pretty well for most companies provided there are no misspellings. 

## Warning
If you want to run this app on your local machine you will need to change the window.serverUrl property in public/index.html to http://localhost:5000. Unfortunately, I didn't have enough time to make the project able to handle multiple deployments due to my infamiliarity with Facebook's create-react-app project.

## Requirements
Node.js

## Commands
- **npm start** this command will get the project to a production-ready state and start the express server. This is automatically run by Heroku  
- **npm test** this command will run the Jest unit tests
- **npm run dev** this command will run the webpack and express servers

## Future Enhancements
- Implement some fuzzy logic on the backend to handle misspellings and to go deeper in the search results.
- Make a less goofy UI
- Add some more unit tests
- Add a watch to the express server
- Make index.html handle deployment to either local or heroku
