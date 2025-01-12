
async function handleBookmarkFeature(caseCard) {
    const userID = localStorage.getItem('id');
    if (!userID) {
        console.error("User ID not found in localStorage");
        return;
    }

    // Get the data from the specific caseCard where the bookmark was clicked
    const attorneyElement = caseCard.querySelector('.case-name p:nth-child(2)');
    const caseNameElement = caseCard.querySelector('.case-name h4');
    const courtElement = caseCard.querySelector('.case-desc h4');
    const dateFiledElement = caseCard.querySelector('.case-name p:nth-child(3)');
    const snippetElement = caseCard.querySelector('.case-desc p');
    const docElement = caseCard.querySelector('.bookmark-wrapper button a');

    // Add null checks for each selector
    let attorney = attorneyElement ? attorneyElement.textContent : '';
    let caseName = caseNameElement ? caseNameElement.textContent : '';
    let court = courtElement ? courtElement.textContent : '';
    let dateFiled = dateFiledElement ? dateFiledElement.textContent : '';
    let snippet = snippetElement ? snippetElement.textContent.replace('Snippet:', '') : '';
    let doc = docElement ? docElement.href : '';

    attorney = attorney.split(" ")[1] || attorney;
    court = court.split(" ")[1] || court;
    dateFiled = dateFiled.split(" ")[2] || dateFiled;
    snippet = snippet.replace("Snippet:", '');

    try {
        const response = await fetch(`/api/insertLegalCase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                attorney: attorney,
                caseName: caseName,
                court: court,
                dateFiled: dateFiled,
                doc: doc,
                snippet: snippet,
            })
        });


    } catch (e) {
        console.warn("Couldn't process bookmark ", e);
    }
}


export default handleBookmarkFeature;

