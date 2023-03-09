import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
//import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    //store in the object queries and results
    query: "",
    results: [],
    //default page
    page: 1,
    resultsPerPage: RES_PER_PAGE,    
  },
  bookmarks: [],
};

const createRecipeObject = function(data) {
  const {recipe} = data.data;    
    return {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      imageUrl: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url, 
      title: recipe.title,
      ...(recipe.key && {key: recipe.key}),
    }; 
};

export const loadRecipe = async function(id) {
  try {    
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);  
    
    state.recipe = createRecipeObject(data);          

    if(state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

  } catch(err) {
    //Temp error handling    
    throw err;
  };
};

//Search functionality
export const loadSearchResults = async function(query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);    

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        imageUrl: rec.image_url,        
        publisher: rec.publisher,       
        title: rec.title,
        ...(rec.key && {key: rec.key}),
      }
    });
    //whenever we do a new search, return page 1
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

//pagination of search results
export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;
  //Logic. page 1 - 1 = 0 * 10 = 0(starting point); page 2 -1 = 1 * 10 = 10 (starting point for second page) 
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  //return results from 1 to 10
  return state.search.results.slice(start, end);
};  

//manipulate servings
export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    //newQuantity = oldQuantity * newServings/oldServings
    ing.quantity = (ing.quantity * newServings / state.recipe.servings);
  })
   //update the number of servings
   state.recipe.servings = newServings;
};

// save bookmarks to local storage
const persistBookmarks = function() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

//add bookmarks
export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  //mark cur recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  //save bookmarks to local storage
  persistBookmarks();
};

//remove bookmarks
export const removeBookmark = function(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
   //mark cur recipe as NOTbookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  //save bookmarks to local storage
  persistBookmarks();  
};

//get bookmarks from local storage
const init = function() {
  const storage = localStorage.getItem("bookmarks");
  if(storage) state.bookmarks = JSON.parse(storage);
};

init();

//function for debugging purposes
const clearBookmarks = function() {
  localStorage.clear("bookmarks");
};
//clearBookmarks();

//transform data from addNewRecipe
export const uploadRecipe = async function(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "").map(ing => {
      const ingArr = ing[1].split(",").map(el => el.trim());
      //const ingArr = ing[1].replaceAll(" ", "").split(",");

      if(ingArr.length !== 3) throw new Error("Wrong ingredient format");

      const [quantity, unit, description] = ingArr; 

      return {quantity : quantity ? Number(quantity) : null, unit, description};
    });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);    
  } catch (err) {
    throw err;
  }  
};