const regex = /^https:\/\/([^.]+\.)+[^.]+(\/.*)*$/

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const htmlLiAnchor = "<li><a></a></li>"

const inputUrlElement = document.getElementById("input-url");
const buttonElement = document.getElementById('button-create');
const deleteButtonElement = document.getElementById('button-delete');

buttonElement.addEventListener('click', () => {
    let inputValue = inputUrlElement.value;
    let htmlContent;

    if (regex.test(inputValue)) {
        htmlContent =
            `<li>
              <a href="${inputValue}" target="_blank">${genRandCharSet()}</a> - ${inputValue} - <span class="click-count">Clicks: 0</span> 
              <button class="button button--edit-save" type="button">Edit</button>
            </li>`;
        document.getElementById('list-url').insertAdjacentHTML("beforeend", htmlContent);
        increaseClickCount(document.querySelector('li:last-child a'), document.querySelector('li:last-child span'));
        editShortenUrl(document.querySelector('li:last-child'), inputValue);
    } else {
        htmlContent = "<p class='error-message'>Please enter a valid url</p>"
        document.getElementById('list-url').insertAdjacentHTML("afterend", htmlContent);
    }
})

deleteButtonElement.addEventListener('click', () => {
    let urlValue = inputUrlElement.value;
    let liElements = document.querySelectorAll('li');

    if (liElements.length > 0) {
        for (let i = 0; i < liElements.length; i++) {
            let outputElements = liElements[i].textContent.split("-");
            let shortUrl = outputElements[0].trim();
            let fullUrl = outputElements[1].trim();

            if (urlValue && (urlValue !== fullUrl && urlValue !== shortUrl)) {
                continue;
            }

            liElements[i].remove();
        }
    } else {
        alert("There are not URL items yet to remove!");
    }

})

function genRandCharSet() {
    let charSet = "localhost/"
    for(let i = 0; i < 5; i++) {
        let idx = Math.floor(Math.random() * characters.length);
        charSet += characters[idx];
    }
    return charSet;
}

function increaseClickCount(urlElement, clickCountElement) {
    urlElement.addEventListener('click', () => {
        let countElements = clickCountElement.innerText.split(": ");
        countElements[1]++;
        clickCountElement.innerText = countElements.join(": ");
    })
}

function deleteElement(liElementsToRemove, urlValue) {
    if (liElementsToRemove.length > 0) {
        for (let i = 0; i < liElementsToRemove.length; i++) {
            let outputElements = liElementsToRemove[i].textContent.split("-");
            let shortUrl = outputElements[0];
            let fullUrl = outputElements[1];

            if (urlValue && (urlValue !== fullUrl && urlValue !== shortUrl)) {
                continue;
            }

            liElementsToRemove[i].remove();
        }
    } else {
        alert("There are not URL items yet to remove!");
    }
}

function editShortenUrl(liElement, url) {
    const editButton = liElement.querySelector('button');

    editButton.addEventListener("click", () => {

        if (editButton.textContent === "Edit") {
            /*1. Change te text in the Button to 'Save' */
            editButton.textContent = "Save";

            /*2. Select the item to remove, which is the anchor element inside the li */
            const anchorItem = liElement.querySelector('a');
            const anchorItemText = anchorItem.textContent.split("/")[1];
            anchorItem.remove();

            /*3. Create the new input item to add in place of the removed anchor element */
            const editItem = document.createElement('input');
            editItem.setAttribute('type', 'text');
            editItem.setAttribute('value', anchorItemText );
            editItem.setAttribute('class', 'input-text input-text--edit');

            /*4. Add the input element as first child of the li element */
            liElement.prepend(editItem);

        } else if(editButton.textContent === "Save") {
            /*1. Change the text in the button to 'Edit' */
            editButton.textContent = "Edit";

            /*2. Create the new anchor element */
            const newAnchorElement = document.createElement('a');
            newAnchorElement.setAttribute('href', url);
            newAnchorElement.setAttribute('target', '_blank');

            /*3. Select the input element before removing it, in order to define the text inside the new anchor element */
            const inputElement = liElement.querySelector('input');
            if(inputElement.value) {
                newAnchorElement.textContent = `localhost/${inputElement.value}`;
            } else {
                newAnchorElement.textContent = `localhost/${inputElement.getAttribute("value")}`;
            }

            /*4. Remove the input element and then add the new anchor element as first child of the li item */
            inputElement.remove();
            increaseClickCount(newAnchorElement,  liElement.querySelector('span'));
            liElement.prepend(newAnchorElement);

        }
    })
}




