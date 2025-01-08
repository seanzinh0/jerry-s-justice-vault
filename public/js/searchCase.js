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
                const {caseName, court, dateFiled, doc, snippet} = lawCase;
                
                const attorney = lawCase.attorney && lawCase.attorney.trim() !== "" ? lawCase.attorney : 'N/A';
                console.log(attorney);

                result += `<div class="case">
                    <div class="case-name">
                        <h4>${caseName}</h3>
                        <p>Attorney: ${attorney}</p>
                        <p>Date Filed: ${dateFiled}</p>
                    </div>
                    <div class="case-desc">
                        <h4>Court: ${court}</h4>
                        <p>Snippet: ${snippet}</p>
                    </div>
                    <button><a href=${doc}>Case Document</a></button>
                </div>`
            });
            similarCases.innerHTML = result;
        }
    });
});