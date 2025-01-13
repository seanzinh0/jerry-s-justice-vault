import handleBookmarkFeature from './bookmark.js';

const form = document.querySelector('#search-form');
const similarCases = document.querySelector('#similar-cases');
const loadingAnim = document.querySelector('.loading-anim');
const submitBtn = document.querySelector('.submit-btn');
const userSelectedOption = document.querySelector('.sort-container');

loadingAnim.style.display = 'none';
userSelectedOption.style.visibility = 'hidden'

submitBtn.addEventListener('click', () => {
    loadingAnim.style.display = "block";
    userSelectedOption.style.visibility = 'hidden'
    userSelectedOption.value = 'default'
    similarCases.innerHTML = ''
});

userSelectedOption.addEventListener('change', (e) => {
    if (e.target.value === 'A-Z') {
        sortCasesAtoZ();
    } else if (e.target.value === 'Z-A') {
        sortCasesZtoA();
    } else if (e.target.value === 'Attorney') {
        filterAttorney();
    } else if (e.target.value === 'No-Attorney') {
        filterNoAttorney();
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('#search-case').value;

    //hides animation if the user hasn't entered a search
    if(searchInput.trim() === '') {
        loadingAnim.style.display = 'none';
    }

    fetch(`/api/search?lawCase=${searchInput}`).then(response => response.json()).then(data => {
        if (data.error) {
            similarCases.innerHTML = data.error;
        } else {
            loadingAnim.style.display = "none";
            userSelectedOption.style.visibility = 'visible'
            similarCases.innerHTML = '';
            renderCases(data.results); // Render the cases
        }
    });
});

let initialCardsState = []; // Stores the initial unfiltered state of cards for needed for the attorney funtions below

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
            handleBookmarkFeature(caseCard); // Pass caseCard to get the correct information on each card
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

        initialCardsState = [...similarCases.children]; // Update the initial state with the newly rendered cards needed for the attorney funtions below

    });
}
function appendCards(cards) {
    similarCases.innerHTML = '';
    cards.forEach(card => similarCases.appendChild(card));
}


// Sorting function for A to Z
function sortCasesAtoZ() {
    const caseCards = [...similarCases.children];
    const sortedCards = caseCards.sort((a, b) => {
        const caseNameA = a.querySelector('.case-name h4').textContent;
        const caseNameB = b.querySelector('.case-name h4').textContent;
        return caseNameA.localeCompare(caseNameB); // Actually does the sorting A to Z
    });

    appendCards(sortedCards);

}



// Sorting function for Z to A
function sortCasesZtoA() {
    const caseCards = [...similarCases.children];
    const sortedCards = caseCards.sort((a, b) => {
        const caseNameA = a.querySelector('.case-name h4').textContent;
        const caseNameB = b.querySelector('.case-name h4').textContent;
        return caseNameB.localeCompare(caseNameA); // Sort Z to A
    });

    appendCards(sortedCards);

}

// Filter function for cases with attorneys
function filterAttorney() {
    const filteredCards = initialCardsState.filter(card => {
        const attorneyText = card.querySelector('.attorney-name-text').textContent;
        return !attorneyText.includes('N/A'); 
    });

    appendCards(filteredCards);
}

// Filter function for cases with no attorneys
function filterNoAttorney() {
    const filteredCards = initialCardsState.filter(card => {
        const attorneyText = card.querySelector('.attorney-name-text').textContent;
        return attorneyText.includes('N/A'); 
    });

    appendCards(filteredCards);
}