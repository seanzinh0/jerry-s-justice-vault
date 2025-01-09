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
            data.results.forEach(lawCase  => {
                const {caseName, court, dateFiled, doc, snippet} = lawCase;              
                const attorney = lawCase.attorney && lawCase.attorney.trim() !== "" ? lawCase.attorney : 'N/A';
                console.log(attorney);

                const caseCard = document.createElement('div');
                caseCard.classList.add('case');
                

                const caseNameSection = document.createElement('div');
                caseNameSection.classList.add('case-name');

                const name = document.createElement('h4')
                name.textContent = caseName

                const attorneyName = document.createElement('p');
                attorneyName.textContent = `Attorney: ${attorney}`;

                const dateEl = document.createElement('p')
                dateEl.textContent = `Date Filed: ${dateFiled}`

                const caseDesc = document.createElement('div');
                caseDesc.classList.add('case-desc');

                const courtEL = document.createElement('h4');
                courtEL.textContent = `Court: ${court}`

                const snippetEl = document.createElement('p');
                snippetEl.textContent = `Snippet: ${snippet}`

                const caseBtn = document.createElement('button');

                const a = document.createElement('a');
                a.href = doc;
                a.textContent = 'Case Document';
                a.setAttribute('target', '_blank');

                caseNameSection.appendChild(name);
                caseNameSection.appendChild(attorneyName);
                caseNameSection.appendChild(dateEl);

                caseDesc.appendChild(courtEL);
                caseDesc.appendChild(snippetEl);

                caseBtn.appendChild(a);

                caseCard.appendChild(caseNameSection);
                caseCard.appendChild(caseDesc);
                caseCard.appendChild(caseBtn);

                similarCases.appendChild(caseCard);
            });
        }
    });
});