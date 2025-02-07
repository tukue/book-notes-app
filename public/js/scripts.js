document.addEventListener('DOMContentLoaded', () => {
  // Handle form submissions
  const bookForm = document.getElementById('bookForm');
  if (bookForm) {
    bookForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(bookForm);
      const data = Object.fromEntries(formData.entries());

      fetch('/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          alert('Book added successfully!');
          window.location.reload();
        } else {
          alert('Failed to add book.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the book.');
      });
    });
  }

  // Handle delete buttons
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const bookId = event.target.getAttribute('data-book-id');

      fetch(`/books/${bookId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          alert('Book deleted successfully!');
          window.location.reload();
        } else {
          alert('Failed to delete book.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the book.');
      });
    });
  });
});