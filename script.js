const showPicsButton = document.querySelector('.button')
const paginationContainer = document.querySelector('.pagination');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const url = 'https://pixabay.com/api/?editors_choice=true&key=46861510-78e6e4a0e2cd6077f83d9b926&per_page=10';
let page = 1;
let picsPerPage = 3;
let picsData = [];

async function getpics() {
    try {
        const getData = await getFetch();
        if (getData && getData.hits && getData.hits.length > 0) {
            picsData = getData.hits;
            console.log(picsData);
            page = 1;
            unlockButton();
            getDataLayout(picsData);
        } else {
            throw new Error("No data available");
        }
    } catch (error) {
        showError(error.message);
    }
}

async function getFetch() {
    try {
        const fetchResponse = await fetch(url);
        if (!fetchResponse.ok) {
            throw new Error(`HTTP error, status: ${fetchResponse.status}`);
        }
        return fetchResponse.json();
    } catch (error) {
        console.log(`Fetch error: ${error}`);
        throw error;
    }
}

function getDataLayout(pics) {
    paginationContainer.innerHTML = '';
    const start = (page - 1) * picsPerPage;
    const end = start + picsPerPage;
    const currentPage = pics.slice(start, end);
    currentPage.forEach((pic) => {
        const dataHTML = `  
        <div>  
            <p>id: ${pic.id}</p>  
            <p>tags: ${pic.tags}</p> 
            <p>width: ${pic.imageWidth}</p> 
            <p>height: ${pic.imageHeight}</p>
            <img src="${pic.userImageURL}" alt="User Image"> 
        </div>  
        `;
        paginationContainer.innerHTML += dataHTML;
    });
}

function unlockButton() {
    prevButton.disabled = page === 1;
    nextButton.disabled = page === Math.ceil(picsData.length / picsPerPage);
}

function changePage() {
    if (page < Math.ceil(picsData.length / picsPerPage)) {
        page++;
        unlockButton();
        getDataLayout(picsData);
    }
}

function changePreviousPage() {
    if (page > 1) {
        page--;
        unlockButton();
        getDataLayout(picsData);
    }
}

function showError(error) {
    paginationContainer.innerHTML = `
    <p>Error: ${error}</p>
    `;
}

nextButton.addEventListener('click', changePage);
prevButton.addEventListener('click', changePreviousPage);
showPicsButton.addEventListener('click', getpics)