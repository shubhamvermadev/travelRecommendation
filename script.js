const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results-container");
const heroContent = document.querySelector(".hero-content");

let travelData = null;

// Load JSON
async function loadData() {
    try {
        const response = await fetch("./travel_recommendation_api.json");

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        travelData = await response.json();

        console.log("Travel Data Loaded:", travelData);
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

loadData();

// Search Button
searchBtn.addEventListener("click", () => {

    if (!travelData) {
        alert("Data is still loading...");
        return;
    }

    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
        alert("Please enter a keyword");
        return;
    }

    let results = [];

    // Beaches
    if (keyword === "beach" || keyword === "beaches") {
        results = travelData.beaches;
    }

    // Temples
    else if (keyword === "temple" || keyword === "temples") {
        results = travelData.temples;
    }

    // Countries / Country
    else if (keyword === "country" || keyword === "countries") {
        travelData.countries.forEach(country => {
            results.push(...country.cities);
        });
    }

    // Specific Country
    else {
        const country = travelData.countries.find(
            country => country.name.toLowerCase() === keyword
        );

        if (country) {
            results = country.cities;
        }
    }

    renderResults(results);
});

// Render Cards
function renderResults(results) {

    // Remove old results first
    resultsContainer.innerHTML = "";

    // Hide home content while searching
    heroContent.style.display = "none";

    // No results
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="result-card">
                <div class="result-card-content">
                    <h3>No Results Found</h3>
                    <p>Try searching for beaches, temples, countries, or a country name.</p>
                </div>
            </div>
        `;
        return;
    }

    let cardsHTML = "";

    results.forEach(item => {
        cardsHTML += `
            <div class="result-card">
                <img src="${item.imageUrl}" alt="${item.name}">

                <div class="result-card-content">
                    <h3>${item.name}</h3>

                    <p>
                        ${item.description}
                    </p>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = cardsHTML;
}

// Clear Button
resetBtn.addEventListener("click", () => {

    searchInput.value = "";

    resultsContainer.innerHTML = "";

    heroContent.style.display = "block";
});

// Enter Key Search Support
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});