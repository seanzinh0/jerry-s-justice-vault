const form = document.querySelector('#search-form');
const similarCases = document.querySelector('#similar-cases');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('#search-case').value;
    fetch(`http://localhost:3000/api/search?lawCase=${searchInput}`).then(response => response.json()).then(data => {
        if (data.error) {
            similarCases.innerHTML = data.error;
        } else {
            similarCases.innerHTML = '';
            let result = '';
            data.results.forEach(lawCase  => {
                const {attorney, caseName, court, dateFiled, doc, snippet} = lawCase;
                result += `<div class="case">
                    <h3>${caseName}</h3>
                    <p>Attorney: ${attorney}</p>
                    <p>Court: ${court}</p>
                    <p>Date Filed: ${dateFiled}</p>
                    <p>Snippet: ${snippet}</p>
                    <a href=${doc}>Case Document</a>
                </div>`
            });
            similarCases.innerHTML = result;
        }
    })
})