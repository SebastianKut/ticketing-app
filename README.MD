# Ticketing app

## Error handling middleware creation

Error handeler is neccessary if we want to make sure that different types of errors in different situations, which will return errors structured in differnt way, can be consumed by our middleware error handeler and then returned to the client in the consistent data structure that is identical for every error.

First we create errorHandeler function. In order for this function to work as an error handeler in express it needs tp accept 4 arguments(error, request, response, next). This way express interprets it as a middleware for handling errors.

After creating that errorhandeler(src/middlewares/error-handeler.ts) it needs to be consumed by express so we wire it up in index.ts
app.use(errorHandeler);

Now everytime we throw an error in the function that handles the route, express uses our error handeler
throw new Error()

We can also create different types of errors by extending an error for example DatabaseConnectionError or RequestValidationError then check for the type of an error in errorHandeler function and based on the type process the data returned by an error, then send error response to the client in the format that will be consistent for all types of errors that happen in our server. This is essentially the main purpose of an Error handeler as each type of errors we create (DatabaseError, ValidationError) can return different data structure that is proocessed and normalized in our error handeler
