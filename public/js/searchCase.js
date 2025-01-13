import handleBookmarkFeature from './bookmark.js';

const form = document.querySelector('#search-form');
const similarCases = document.querySelector('#similar-cases');
const loadingAnim = document.querySelector('.loading-anim');
const submitBtn = document.querySelector('.submit-btn');
const userSelectedOption = document.querySelector('.sort-container');
const searchInput = document.querySelector('#search-case');

loadingAnim.style.display = 'none';

submitBtn.addEventListener('click', () => {  
    if(searchInput.value.trim() !== '') {
        loadingAnim.style.display = "block";
    }
    similarCases.innerHTML = '';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('#search-case').value;

    fetch(`/api/search?lawCase=${searchInput}`).then(response => response.json()).then(data => {
        if (data.error) {
            similarCases.innerHTML = data.error;
        } else {
            loadingAnim.style.display = "none";
            similarCases.innerHTML = '';
            renderCases(data.results); // Render the cases

            // Sorting logic will be handled when user selects an option in the dropdown
            if (userSelectedOption.value === 'A-Z') {
                sortCasesAtoZ();
            } else if (userSelectedOption.value === 'Z-A') {
                sortCasesZtoA();
            } else if (userSelectedOption.value === 'Attorney') {
                filterAttorney(); 
            } else if (userSelectedOption.value === 'No-Attorney') {
                filterNoAttorneys();
            }
        }
    });
});

function renderCases(cases) {
    cases.forEach((lawCase) => {
        const { caseName, court, dateFiled, doc, snippet } = lawCase;
        const attorney = lawCase.attorney && lawCase.attorney.trim() !== "" ? lawCase.attorney : 'N/A';

        const caseCard = document.createElement('div');
        caseCard.classList.add('case');
        caseCard.style.overflow = 'hidden';

        const caseNameSection = document.createElement('div');
        caseNameSection.classList.add('case-name');

        const name = document.createElement('h4');
        name.textContent = caseName;

        const attorneyName = document.createElement('p');
        attorneyName.textContent = `Attorney: ${attorney}`;
        attorneyName.classList.add('attorney-name-text');

        const dateEl = document.createElement('p');
        dateEl.textContent = `Date Filed: ${dateFiled}`;

        const caseDesc = document.createElement('div');
        caseDesc.classList.add('case-desc');

        const courtEL = document.createElement('h4');
        courtEL.textContent = `Court: ${court}`;

        const snippetEl = document.createElement('p');
        snippetEl.textContent = `Snippet: ${snippet}`;

        const bookmarkWrapper = document.createElement('div');
        bookmarkWrapper.classList.add('bookmark-wrapper');

        const bookmarkIcon = document.createElement('i');
        bookmarkIcon.classList.add('fa-regular', 'fa-bookmark');

        const caseBtn = document.createElement('button');

        bookmarkWrapper.appendChild(bookmarkIcon);
        bookmarkWrapper.appendChild(caseBtn);

        bookmarkIcon.addEventListener('click', () => {
            bookmarkIcon.classList.toggle('fa-regular');
            bookmarkIcon.classList.toggle('fa-solid');
            handleBookmarkFeature(caseCard); // Pass caseCard to get the correct context
        });

        const a = document.createElement('a');
        a.href = doc;
        a.textContent = 'Case Docs';
        a.setAttribute('target', '_blank');

        caseNameSection.appendChild(name);
        caseNameSection.appendChild(attorneyName);
        caseNameSection.appendChild(dateEl);

        caseDesc.appendChild(courtEL);
        caseDesc.appendChild(snippetEl);

        caseBtn.appendChild(a);

        caseCard.appendChild(caseNameSection);
        caseCard.appendChild(caseDesc);
        caseCard.appendChild(bookmarkWrapper);

        similarCases.appendChild(caseCard);
    });
}

function appendCards(cards) {
    similarCases.innerHTML = '';
    cards.forEach((card) => {
        similarCases.appendChild(card);
    });
}
// Sorting function for "A to Z"
function sortCasesAtoZ() {
    const caseCards = [...similarCases.children];
    const sortedCards = caseCards.sort((a, b) => {
        const caseNameA = a.querySelector('.case-name h4').textContent;
        const caseNameB = b.querySelector('.case-name h4').textContent;
        return caseNameA.localeCompare(caseNameB); // Sort A to Z
    });

    appendCards(sortedCards)
}

// Sorting function for "Z to A"
function sortCasesZtoA() {
    const caseCards = [...similarCases.children];
    const sortedCards = caseCards.sort((a, b) => {
        const caseNameA = a.querySelector('.case-name h4').textContent;
        const caseNameB = b.querySelector('.case-name h4').textContent;
        return caseNameB.localeCompare(caseNameA); // Sort Z to A
    });
    
    appendCards(sortedCards)
}

// Filter function for cases with attorneys
function filterAttorney() {
    const caseCards = [...similarCases.children];

    // Removes cards that do not have an attorney 
    const filteredCards = caseCards.filter(card => {
        const attorneyText = card.querySelector('.attorney-name-text').textContent;
        return !attorneyText.includes('N/A'); 
    });

    appendCards(filteredCards);
}

function filterNoAttorneys() {
    const caseCards = [...similarCases.children];

    // Removes the cards that do actually have an attorney 
    const filteredCards = caseCards.filter(card => {
        const attorneyText = card.querySelector('.attorney-name-text').textContent;
        return attorneyText.includes('N/A'); 
    });

    appendCards(filteredCards);
}

