document.addEventListener('DOMContentLoaded', () => {
  // Handle form submissions
  const bookForm = document.getElementById('bookForm');
  if (bookForm) {
    bookForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(bookForm);
      const data = Object.fromEntries(formData.entries());

      // Fetch the book cover URL from Open Library API
      const coverUrl = await fetchBookCover(data.title);
      data.coverUrl = coverUrl;

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

  // Fetch book cover from Open Library Covers API
  async function fetchBookCover(title) {
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.docs && data.docs.length > 0) {
          const coverId = data.docs[0].cover_i;
          if (coverId) {
            return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
          }
        }
      }
      return null;
    } catch (err) {
      console.error('Error fetching book cover', err);
      return null;
    }
  }
});