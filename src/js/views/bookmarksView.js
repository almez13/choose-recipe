import View from "./view.js";
import previewView from "./previewView.js";

//import icons
import icons from "url:../../img/icons.svg";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet!";
  _message = "";
  //render the bookmark from storage
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  };

  _generateMarkup() {    
    return this._data.map(bookmark => previewView.render(bookmark, false)).join("");
  }  
};

export default new BookmarksView();