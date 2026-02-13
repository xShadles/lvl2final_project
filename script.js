const apiKey = process.env.API_KEY;

const recipeSearcher = document.getElementById("recipeSearcher");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");
const resultsList = document.getElementById("resultsList");
const favoritesBtn = document.getElementById("favoritesBtn");

//Filters (definitely needs some refactoring)
const veganRecipeFilter = document.getElementById("veganRecipeFilter");
const vegetarianRecipeFilter = document.getElementById("vegetarianRecipeFilter");
const glutenFreeRecipeFilter = document.getElementById("glutenFreeRecipeFilter");

veganRecipeFilter.addEventListener('change',function() {
    if (veganRecipeFilter.checked) {
        veganCheck = (',vegan').trim()
    } else veganCheck = '';
})
let veganCheck = '';

vegetarianRecipeFilter.addEventListener('change',function() {
    if (vegetarianRecipeFilter.checked) {
        vegetarianCheck = (',vegetarian').trim()
    } else vegetarianCheck = '';
})
let vegetarianCheck = '';

glutenFreeRecipeFilter.addEventListener('change',function() {
    if (glutenFreeRecipeFilter.checked) {
        glutenFreeCheck = ('gluten').trim()
    } else glutenFreeCheck = '';
})
let glutenFreeCheck = '';

function checkMark(isTrue) {
    return isTrue ?'✅' : '❌';
}

//Search For Recipes
searchBtn.addEventListener('click', searchRecipes);

recipeSearcher.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchRecipes();
    }
});

function searchRecipes() {
    const query = recipeSearcher.value.trim();
    if(!query) {
        alert('Please enter a search term');
        return;
    }

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&addRecipeNutrition=true&diet=${veganCheck}${vegetarianCheck}&number=20&intolerances=${glutenFreeCheck}`;


    resultsList.innerHTML = '<p>Searching for recipes...</p>';
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        resultsList.innerHTML = '';
        if (!data.results || data.results.length === 0) {
        resultsList.innerHTML = '<div class ="no-results"> No recipes found. Try a different search term!</div>';
        return;
    }

    data.results.forEach(recipe => {
        const title = recipe.title;
        const image = recipe.image;
        const isVegetarian = recipe.vegetarian;
        const isVegan = recipe.vegan;
        const isGlutenFree = recipe.glutenFree;
        const recipeLink = recipe.sourceUrl;
        let calories = '';
        if (recipe.nutrition.nutrients) {
            const nutrients = recipe.nutrition.nutrients;
            const calInfo = nutrients.find(n => n.name === 'Calories');
            if (calInfo) calories = Math.round(calInfo.amount) + ' ' + calInfo.unit;
        };
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
        <button>❤️</button>
        <h3>${title}</h3>
        <img src="${image}" alt="${title}">
        <p><strong>Calories:</strong> ${calories}</p>
        <p><strong>Vegetarian:</strong> ${checkMark(isVegetarian)}</p>
        <p><strong>Vegan:</strong> ${checkMark(isVegan)}</p>
        <p><strong>GlutenFree:</strong> ${checkMark(isGlutenFree)}</p>
        <p><strong><a href ="${recipeLink}">More Information</a></strong></p>
        `;
        resultsList.appendChild(recipeDiv);
    });
})
    .catch(error => {
            console.error('Error fetching recipes:',error);
            resultsList.innerHTML = '<div class="error">Error fetching recipes. Please try again later.</div>';
    });
}


//Random Recipe (checking glutenFree and Vegetarian does not work for some reason)
randomBtn.addEventListener('click',function() {
    
const apiUrl=`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=20&number=20&exclude-tags=${glutenFreeCheck}&includeNutrition=true&include-tags=${veganCheck}${vegetarianCheck}`;
    
    resultsList.innerHTML = '<p>Searching for a random recipe...</p>';
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        resultsList.innerHTML = '';
        if (!data.recipes) {
            resultsList.innerHTML = '<div class="no-results">No recipes found. Try again later!</div>';
            return;
        }
    data.recipes.forEach(recipe => {
        const title = recipe.title;
        const image = recipe.image;
        const isVegetarian = recipe.vegetarian;
        const isVegan = recipe.vegan;
        const isGlutenFree = recipe.glutenFree;
        const recipeLink = recipe.sourceUrl;
        let calories = '';
        if (recipe.nutrition.nutrients) {
            const nutrients = recipe.nutrition.nutrients;
            const calInfo = nutrients.find(n => n.name === 'Calories');
            if (calInfo) calories = Math.round(calInfo.amount) + ' ' + calInfo.unit;
        };
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
        <button>❤️</button>
        <h3>${title}</h3>
        <img src="${image}" alt="${title}">
        <p><strong>Calories:</strong> ${calories}</p>
        <p><strong>Vegetarian:</strong> ${checkMark(isVegetarian)}</p>
        <p><strong>Vegan:</strong> ${checkMark(isVegan)}</p>
        <p><strong>GlutenFree:</strong> ${checkMark(isGlutenFree)}</p>
        <p><strong><a href ="${recipeLink}">More Information</a></strong></p>
        `;
        resultsList.appendChild(recipeDiv);        
    });    
})
    .catch(error => {
        console.error('Error fetching recipes:',error);
        resultsList.innerHTML = '<div class="error">Error fetching recipes. Please try again later.</div>';
    });    
})
