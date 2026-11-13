const SearchType = Object.freeze({
    NONE: 0,
    NAME: 1,
    EPISODE: 2,
});

const SortType = Object.freeze({
    NONE: 0,
    SPECIES: 1,
    GENDER: 2,
    NAME_ALPHABETICAL: 3,
    NAME_REVERSE_ALPHABETICAL: 4,
    STATUS_DEAD: 5,
    STATUS_ALIVE: 6,
});

const StatusRank = Object.freeze({
    "Alive": 0,
    "unknown": 1,
    "Dead": 2,
});


const SortSelect = document.getElementById("sort-select");

const SearchSelect = document.getElementById("search-select");

const SmallEntryContainer = document.getElementById("small-entry-container");

let selectedSearchType;

let selectedSortType;

let pageNumber;



// A setter for the search type that ensures that whatever value goes in connects back to a valid enum KVP.
function setSelectedSearchType(toWhat){
    if (Number.isInteger(toWhat) && toWhat >= SearchType.length()){
        console.log("Somehow you managed to get " + toWhat + " instead of a valid value. This is likely on the developer, so have them sort it out.");
        return;
    }
    else {
        selectedSearchType = toWhat;
    }
}

// A setter for the sort type that ensures that whatever value goes in connects back to a valid enum KVP.
function setSelectedSortType(toWhat){
    if (Number.isInteger(toWhat) && toWhat >= SortType.length){
        console.log("Somehow you managed to get " + toWhat + " instead of a valid value. This is likely on the developer, so have them sort it out.");
        return;
    }
    else {
        selectedSortType = toWhat;
    }
}

function buildSmallCharacterEntry(character){
    const SmallEntry = document.createElement("div");
    const CharacterImage = document.createElement("img");
    const CharacterName = document.createElement("h3");
    const SmallDetails = document.createElement("p");

    SmallEntry.classList.add("small-id-entry");
    SmallEntry.dataset.id = character.id;   

    CharacterImage.src = character.image;
    CharacterImage.alt = character.name;

    CharacterName.textContent = character.name;

    SmallDetails.textContent = `${character.status} - ${character.species}`;

    SmallEntry.append(CharacterImage, CharacterName, SmallDetails);
    return SmallEntry;
}


// Sorts the characters based on a paritcular sort type
function sortData(data){
    let sortedArray = [...data];

    switch (selectedSortType){
        case SortType.SPECIES:
            sortedArray.sort((a,b) => a.species.localeCompare(b.species));
            break;
        case SortType.GENDER:
            sortedArray.sort((a,b) => a.gender.localeCompare(b.gender));
            break;
        case SortType.NAME_ALPHABETICAL:
            sortedArray.sort((a,b) => a.name.localeCompare(b.name));
            break;
        case SortType.NAME_REVERSE_ALPHABETICAL:
            sortedArray.sort((a,b) => b.name.localeCompare(a.name));
            break;
        case SortType.STATUS_ALIVE:
             sortedArray.sort((a, b) => StatusRank[b.status] - StatusRank[a.status]);
            break;
        case SortType.STATUS_DEAD:
             sortedArray.sort((a, b) => StatusRank[a.status] - StatusRank[b.status]);
            break;
    }

    return sortedArray;
}

// Adds the rendered characters to the small entry list
function renderCharacters(characterData){
    SmallEntryContainer.innerHTML = "";

    for (const character of characterData){
        SmallEntryContainer.appendChild(buildSmallCharacterEntry(character));
    }
}

async function sortCharacters(){
    let unsortedCharacters = await fetchCharacters();
    let sortedCharacters = sortData(unsortedCharacters);

    renderCharacters(sortedCharacters);
}

// Finds the current listing of characters on a given page
async function fetchCharacters(){
    const data = await fetchAPI("/character");
    return data.results;
}

// Helper method that gets the necessary data from the R & M API depending on the url used
async function fetchAPI(urlEndpoint = ""){
    const BaseApiUrl = "https://rickandmortyapi.com/api";

    // Ternary if-statement to check whether or not the base API URL is even needed
    let url = urlEndpoint.startsWith("http") ? urlEndpoint : BaseApiUrl + urlEndpoint;;

    const response = await fetch(url);

    if (!response.ok){
        throw new Error("Failed API request: " + response.status);
    }

    let data = await response.json();

    return data;
}

// Listens for whenever any of the dropdowns change in to change their respective enum values
SortSelect.addEventListener("change", (event) => {
    setSelectedSortType(Number(event.target.value));
    
    // Ensures that the only time the sort method is called is when it's a nonzero value
    if (selectedSortType > 0){
        sortCharacters();
    }
});

SearchSelect.addEventListener("change", (event) => {
    setSelectedSearchType(event.target.value);
});