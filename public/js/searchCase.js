const form = document.querySelector('#search-form');
const similarCases = document.querySelector('#similar-cases');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('#search-case').value;
    fetch(`http://localhost:3000/api/search?lawCase=${searchInput}`).then(response => response.json()).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            console.log(data)
        }
    })
})