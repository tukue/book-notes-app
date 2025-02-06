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
   git clone 
   cd book-notes-app  

   Technologies used :

   Let's update the README to include the backend and frontend tech stack details.

### Updated 

README.md


```markdown
# Book Notes Capstone Project

## Overview
The Book Notes application is a web-based project that allows users to manage their book notes. Users can add, view, update, and delete book entries. The application uses PostgreSQL for data persistence and integrates with the Open Library Covers API to fetch book covers.

## Features
- **CRUD Operations:** Create, Read, Update, and Delete book entries.
- **API Integration:** Fetch book covers using the Open Library Covers API.
- **Data Persistence:** Store book data in a PostgreSQL database.
- **User-Friendly Interface:** Use EJS for templating and a clean, responsive design.

## Project Structure
```
.env
.gitignore
config/
  database.js


package.json


public/
  css/
    styles.css
  js/
    scripts.js


README.md


src/
  app.js
  controllers/
    booksController.js
  models/
    bookModel.js
  routes/
    booksRoutes.js
  views/
    book.ejs
    index.ejs
    layout.ejs
```

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL

### Installation
1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd book-notes-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up the database:**
   - Create a PostgreSQL database named `book_notes_db`.
   - Update the [`.env`](.env ) file with your database connection string:

### Running the Application
1. **Start the server:**
   ```sh
   npm start
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

## Usage
- **Add a Book:** Fill out the form with the book's title, author, rating, and notes, then click "Add Book".
- **View Books:** Click "View Books" on the home page to see a list of all books.
- **Update a Book:** Click the "Edit" button next to a book entry, update the details, and save.
- **Delete a Book:** Click the "Delete" button next to a book entry to remove it from the list.

## API Integration
The application integrates with the Open Library Covers API to fetch book covers. This is done using Axios to send HTTP requests and handle responses.

## Error Handling
The application includes error handling for both server-side and client-side operations. Errors are logged to the console, and user-relevant errors are displayed in the UI.

## Technologies Used

### Backend
- **Node.js:** JavaScript runtime for building server-side applications.
- **Express.js:** Web framework for Node.js.
- **PostgreSQL:** Relational database for storing book data.
- **pg:** PostgreSQL client for Node.js.
- **dotenv:** Module for loading environment variables 

### Frontend
- **HTML:** Markup language for creating web pages.
- **CSS:** Stylesheet language for designing web pages.
- **JavaScript:** Programming language for creating interactive web pages.
- **EJS:** Templating engine for generating HTML with embedded JavaScript.
- **Axios:** Promise-based HTTP client for making API requests.



