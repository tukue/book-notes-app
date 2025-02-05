# Book Notes Capstone Project

## Objectives
- Revise how to integrate public APIs into web projects.
- Gain more experience using Express/Node.js for server-side programming.
- Demonstrate ability to Create Read Update and Delete data in a PostgreSQL Database to persist data.

## Example Ideas
- Use the Open Library Covers API to fetch book covers.
- Create a database to store books you have read.
- Have a way to add new data about books, update previous reviews and delete entries.
- Display this information from your database 
- Be able to sort your book entries by rating and recency.

## Requirements
1. **Database Persistence**
   - Persist data using a PostgreSQL database.
   - Use CRUD methods to manipulate data in the database.

2. **Project Planning**
   - Think through your project, researching the API documentation, project features, what data you will store, and how it will be used in your web application.
   - Draw a database diagram on draw.io and plan out any relationships.
   - Think through the PostgreSQL commands you will need to write to create the schema for your database.

3. **Project Setup**
   - Set up a new Node.js project using Express.js.
   - Include `pg` for working with your localhost PostgreSQL database.
   - Include EJS for templating.
   - Create a frontend in HTML, CSS, and JS.
   - Ensure that the project has a structured directory and file organization.

4. **API Integration**
   - Implement at least a GET endpoint to interact with your chosen API.
   - Use Axios to send HTTP requests to the API and handle responses.

5. **Data Presentation**
   - Design the application to present the book covers from the API and the data in your database in a user-friendly way.
   - Use appropriate HTML, CSS, and a templating engine like EJS.
   - Think about how you would allow the user to sort the data from the database.

6. **Error Handling**
   - Ensure that error handling is in place for both your application and any API requests. You can console log any errors, but you can also give users any user-relevant errors.

## Project Setup

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd book-notes-app