import { API_URL } from "./config.js";
import { RESULTS_PER_PAGE, KEY } from "./config.js";
// import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";
//[NOTE] ALL API URL comes with key API as to allow for user's uploaded recipe to be displayed on the website
//since the user's content is attached to the API key

// [1] Create a new object format to cater the incoming data
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
    durationArr: [],
  },
  bookmarks: [],
};

/////////////////////////////////// [ REFACTOR ] //////////////////////////////////////
//  Used in loadRecipe and uploadRecipe
const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //if recipe.key does not exist, then nothing happens
    //if recipe.key has value, then 2nd part of operator is executed and return the value
    //then it will spreadout into key: recipe.key
    ...(recipe.key && { key: recipe.key }),
  };
};
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * Render the API data based on the recipe ID and transformed them into an organized format to be loaded on the web
 * @param {string} id Receive an id attached to each recipe
 * @function createRecipeObject(data) Obtain the recipe data extracted from API and transform into a preferred object format
 * @constant state.recipe Save the created preferred object format into state.recipe object
 * @constant state.bookmarks To create new property (bookmarked) for selected current recipe ID in comparison with the bookmarked recipes
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id == id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    //Temp error handling
    console.error(`${err} 🔺🔺🔺🔺`);
    throw err;
  }
};

/**
 * Load the query received from USER to search for all results related to query
 * @param {string} query Receive query from SEARCHVIEW
 * @constant state.search.query Query received will be added into state.search
 * @constant state.search.results Data received from AJAX(query) will be saved in a preferred object format into state.search results array
 * @constant state.search.page Initilize at 1
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(function (rec) {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🔺🔺🔺🔺`);
    throw err;
  }
};

/**
 * Retrieve the amount of search results based on pagination page
 * @param {number} page
 * @default page Page will have default of value 1 (state.search.page) otherwise stated other value
 * @constant state.search.page if page param is values other than 1, state.search.page=page
 * @returns {Array} return an array of search results
 *
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/**
 * Update all the relevant variables as num of servings being updated
 * @param {Number} newServings
 * @constant state.recipe.servings This will be changed to a new value of newServings
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    (ing) => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
    //new Quantity=old Quantity + newServing / oldServing => 2*8/4=4
  );
  state.recipe.servings = newServings;
};

/////////////////////////////////// [ REFACTOR ] //////////////////////////////////////
//  Used in addBookmark and deleteBookmark
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * Add selected recipe to bookmark
 * @param {Object} recipe
 * @constant state.recipe.bookmarked Ensure that the selected recipe to bookmark has a new property of bookmarked = true
 * @constant persistBookmarks It refresh the bookmark content into the most updated content
 */
export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  // if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  state.recipe.bookmarked = true;

  persistBookmarks();
};

/**
 * Delete selected recipe from bookmark
 * @param {string} id
 * @constant state.bookmarks.findIndex This will loop over each bookmarked recipes and compare the ID(s)
 * @constant state.recipe.bookmarked Ensure that the selected recipe to bookmark has a property of bookmarked = false
 * @constant persistBookmarks It refresh the bookmark content into the most updated content
 */
export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as NOT bookmarked
  // if (id === state.recipe.id) state.recipe.bookmarked = false;
  state.recipe.bookmarked = false;

  persistBookmarks();
};

/**
 * Retrieve any saved bookmarks in local storage
 */
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

/**
 * Clear all the bookmark storage (for development purpose)
 */
// const clearBookmarks = function () {
//   localStorage.clear("bookmarks");
// };
// clearBookmarks();
// -> Development Purpose

/**
 * Upload new recipe into the website
 * @param {Object} newRecipe This is obtained from addHandlerUpload under addRecipeView.js in which the data is converted to Object [FormData]
 * @constant ingredients This is converted in an array [[entry[0],entry[1]],[[entry[0],entry[1]],[[entry[0],entry[1]],...]
 * @function createRecipeObject(data) This turned data into preferred object format
 * @function addBookmark(state.recipe) Once new recipe uploaded, will directly put it under bookmar
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe).filter(
      (entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
    );

    if (ingredients.length === 0)
      throw new Error("Please insert at least ONE ingredient for the recipe!");

    const num = +ingredients[ingredients.length - 1][0].split("-")[1];
    const newRange = num + 1;
    let fullIngredients = [];
    let arr = [];

    for (let j = 1; j < newRange; j++) {
      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i][0].includes(`${j}`)) {
          ingredients[i][0].includes("quantity") && ingredients[i].splice(0, 1, "quantity");
          ingredients[i][0].includes("unit") && ingredients[i].splice(0, 1, "unit");
          ingredients[i][0].includes("description") && ingredients[i].splice(0, 1, "description");

          if (
            (ingredients[i][0].includes("description") && +ingredients[i][1]) ||
            (ingredients[i][0].includes("unit") && +ingredients[i][1])
          )
            throw new Error(`Please input a valid ingredient ${ingredients[i][0]}!`);

          if (ingredients[i][0].includes("quantity") && +ingredients[i][1] < 1)
            throw new Error("Please input a non-negative value for the quantity of ingredient!");

          arr.push(ingredients[i]);

          if (i === ingredients.length - 1) {
            fullIngredients.push(Object.fromEntries(arr));
          }
        } else {
          if (arr.length !== 0) fullIngredients.push(Object.fromEntries(arr));
          arr = [];
        }
      }
    }
    console.log("fullIngredients", fullIngredients);

    // const ingredients = Object.entries(newRecipe)
    //   .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
    //   .map((ing) => {
    //     const ingArr = ing[1].split(",").map((el) => el.trim());
    //     // const ingArr = ing[1].replaceAll(' ', '').split(',');
    //     if (ingArr.length !== 3)
    //       throw new Error(
    //         "Wrong ingredient format! Please use the correct format :)"
    //       );

    //     const [quantity, unit, description] = ingArr;
    //     return { quantity: quantity ? +quantity : null, unit, description };
    //   });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: fullIngredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
