import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeViews.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import addIngredientInput from "./views/addIngredientInput.js";
import addShoppingList from "./views/addShoppingList.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

//Come from parcel
if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  // try {
  const id = window.location.hash.slice(1);
  console.log(id);

  if (!id) return;
  recipeView.renderSpinner();

  //0] Update results view to mark selected search result
  // resultsView.render(model.getSearchResultsPage());  ==> this will re-render the whole search results page
  if (model.state.search.results.length !== 0) resultsView.update(model.getSearchResultsPage());

  //1) Render bookmarks
  bookmarksView.update(model.state.bookmarks);

  //2) Loading Recipe
  await model.loadRecipe(id);
  console.log("state recipe", model.state.recipe);

  //3) Rendering Recipe
  recipeView.render(model.state.recipe);
  // const recipeView=new recipeView(model.state.recipe)
  // } catch (err) {
  //   recipeView.renderError();
  // }
};

const controlSearchResults = async function () {
  try {
    //1] Get search query
    // const query = document.querySelector(".search__field").value; [OPTIONAL]
    //[NOTE] Due to the fact that DOM elements are not "supposed" to be here according to the architecture, it is being created in a separate file under searchView.js, THOUGH, it is not required to do this
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    //2] Load search query
    await model.loadSearchResults(query);

    //3] Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4] Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
controlSearchResults();

const controlPagination = function (goToPage) {
  //3] Render NEW results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4] Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //[1] Update the recipe view - render the same code again to overwrite the old servings with new Servings
  // recipeView.render(model.state.recipe);

  //[2] [ OPTIONAL ]Instead, use the below to avoid re-rendering the whole code again
  //create a new method called 'update'
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe view
    recipeView.render(model.state.recipe);

    //SUCCESS MESSAGE
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    //this will change the URL without reloading the page
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // window.history.back() ==> auto go back to last page

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error("🔺", err);
    addRecipeView.renderError(err.message);
  }
};

let sortIncrease = true;

const controlSortByInc = function (name = true) {
  const fullData = model.state.search.results;
  let dataRender = [];
  if (name) {
    dataRender = fullData.sort(function (a, b) {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
  } else {
    dataRender = fullData.sort(function (a, b) {
      if (a.publisher < b.publisher) return -1;
      if (a.publisher > b.publisher) return 1;
      return 0;
    });
  }

  model.state.search.results = dataRender;
  resultsView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);

  sortIncrease = false;
};
const controlSortByDec = function (name = true) {
  const fullData = model.state.search.results;
  let dataRender = [];

  if (name) {
    dataRender = fullData.sort(function (a, b) {
      if (a.title > b.title) return -1;
      if (a.title < b.title) return 1;
      return 0;
    });
  } else {
    dataRender = fullData.sort(function (a, b) {
      if (a.publisher > b.publisher) return -1;
      if (a.publisher < b.publisher) return 1;
      return 0;
    });
  }

  model.state.search.results = dataRender;
  resultsView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);

  sortIncrease = true;
};

const controlAddShoppingList = function () {
  addShoppingList.render(model.state.recipe, true, false);
};

// console.log("recipeee", model.state.recipe);
// console.log("recipeee", model.state.recipe.ingredients);

const newFeature = function () {
  console.log("Welcome to the Application!");
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addIngredientInput.addHandlerClick();
  addShoppingList.addHandlerClick(controlAddShoppingList);
  addShoppingList.removeHandlerClick();
  newFeature();
};
init();

// sortIncrease
//   ? resultsView.addHandlerSortByTitle(controlSortByInc)
//   : resultsView.addHandlerSortByTitle(controlSortByDec);

document.querySelector(".results").addEventListener("click", function (e) {
  const btn = e.target.closest(".btn--sort-title");

  if (!btn) return;
  model.state.search.page = 1;

  if (sortIncrease) controlSortByInc();
  else controlSortByDec();
});

document.querySelector(".results").addEventListener("click", function (e) {
  const btn = e.target.closest(".btn--sort-publisher");

  if (!btn) return;
  model.state.search.page = 1;

  if (sortIncrease) controlSortByInc(false);
  else controlSortByDec(false);
});

// resultsView.addHandlerSortByPublisher();
// ["hashchange", "load"].forEach((ev) => window.addEventListener(ev, controlRecipes));
// window.addEventListener("hashchange", showRecipe);
// window.addEventListener("load", showRecipe);

// document.querySelector(".search").addEventListener("submit", function (e) {
//   e.preventDefault();
//   controlSearchResults();
// });

// FOR DEVELOPMENT - TESTING
// const clearBookmarks = function () {
//   localStorage.clear("bookmarks");
// };
// clearBookmarks();
