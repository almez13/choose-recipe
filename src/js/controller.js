//import everything
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";



import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

//update page without reloading
if (module.hot) {
  module.hot.accept();
};

// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////

const controlRecipes = async function() {
  try{
    //get a hash - from url
    const id = window.location.hash.slice(1);
    //guard from error with no id
    if(!id) return;   

    //call spinner
    recipeView.renderSpinner();

    //Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    //updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    //1. Loading recipe
    //This async function return only promise
    await model.loadRecipe(id);    
    
    //2. Render the recipe
    recipeView.render(model.state.recipe);
    
  } catch(err) {    
    //call to render error in UI
    recipeView.renderError();
  };
};

//search
const controlSearchResults = async function () {
  try {
    //spinner
    resultsView.renderSpinner();
    //get search query
    const query = searchView.getQuery();   
    if (!query) return;    

    //load search results
    await model.loadSearchResults(query);    

    //render results
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //Render initial pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.error(err);
  }
};

//add handlers for pagination
const controlPagination = function(goToPage) {
  //render NEW results    
    resultsView.render(model.getSearchResultsPage(goToPage));

    //Render NEW pagination buttons
    paginationView.render(model.state.search);  
};

//manipulate servings
const controlServings = function(newServings) {
  //Update the recipe servings (in state)    
  model.updateServings(newServings);

  //Update the recipe view
  //recipeView.render(model.state.recipe);  
  //in difference to render, update method only update the related fields but not rerender all the page
  recipeView.update(model.state.recipe);  

};
//add bookmark
const controlAddBookmark = function() {
  //add or remove bookmarks
 if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);  
 else model.removeBookmark(model.state.recipe.id);  
 //update recipe view
 recipeView.update(model.state.recipe);
 //render bookmarks
 bookmarksView.render(model.state.bookmarks);
};

//render bookmarks from storage
const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

//add new recipe
const controlAddRecipe = async function(newRecipe) {
  try {
  //spiner 
  addRecipeView.renderSpinner();
  //Upload new recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);
  //render new recipe
  recipeView.render(model.state.recipe);
  //display a success message
  addRecipeView.renderMessage();
  //render bookmarkView
  bookmarksView.render(model.state.bookmarks);
  //change id to url
  window.history.pushState(null, "", `#${model.state.recipe.id}`);
  //close modal window(the form)
  setTimeout(function() {
    addRecipeView.toggleWindow();
  }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

//when hash is changed the corresponding recipe is rendered
//window.addEventListener("hashchange", showRecipe);
//when we insert an url - the recipe is rendered
//window.addEventListener("load", showRecipe);
//connect controlRecipes function with eventhandler in recipeView.js
const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();


