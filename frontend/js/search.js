const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, oldPrice: 18.99 },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.49, oldPrice: 19.99 },
    { title: '1984', author: 'George Orwell', price: 10.99, oldPrice: 15.99 },
    { title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.99, oldPrice: 16.99 },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 13.99, oldPrice: 20.99 },
    { title: 'The Alchemist', author: 'Paulo Coelho', price: 13.99, oldPrice: 18.99 },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', price: 18.99, oldPrice: 24.99 },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.49, oldPrice: 19.99 },
    { title: 'Brave New World', author: 'Aldous Huxley', price: 9.99, oldPrice: 14.99 },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', price: 10.99, oldPrice: 16.99 },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 15.99, oldPrice: 21.99 },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, oldPrice: 18.99 },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', price: 11.49, oldPrice: 15.99 }
];


const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('searchResults');

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q');

searchInput.value = searchQuery;

displayResults(filterBooks(searchInput));

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    displayResults(filterBooks(searchInput));
});

function filterBooks(searchInput) {
    const searchTerm = searchInput.value.toLowerCase();
    console.log(searchTerm);
    
    const filteredBooks = books.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchTerm);
        const authorMatch = book.author.toLowerCase().includes(searchTerm);
        return titleMatch || authorMatch;
    });

    return filteredBooks;
}

function displayResults(books) {
    resultsDiv.innerHTML = '';
    // resultsDiv.classList.add('grid-container');
    
    if (books.length === 0) {
        const noBooksMessage = document.createElement('div');
        noBooksMessage.className = 'no-results';
        noBooksMessage.textContent = 'No books found.';
        resultsDiv.classList.remove('grid-container');
        resultsDiv.appendChild(noBooksMessage);
        return;
    }

    for (let i = 0; i < books.length; i++) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book box';
    
        const iconsDiv = document.createElement('div');
        iconsDiv.className = 'icons';
        iconsDiv.innerHTML = `
            <a href="#" class="fas fa-heart"></a>
            <a href="#" class="fas fa-eye"></a>
        `;
    
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image';
        imageDiv.innerHTML = `
            <img src="image/book-${i + 1}.png" alt="">
        `;
    
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.innerHTML = `
            <h3>${books[i].title}</h3>
            <div class="author">${books[i].author}</div>
            <div class="price">$${books[i].price} <span>$${books[i].oldPrice}</span></div>
            <a href="#" class="btn">add to cart</a>
        `;
    
        bookDiv.appendChild(iconsDiv);
        bookDiv.appendChild(imageDiv);
        bookDiv.appendChild(contentDiv);
    
        resultsDiv.appendChild(bookDiv);
    }

}