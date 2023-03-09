//import icons
import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  //public method of api
  render(data, render = true) {
    //check the empty array
    if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    
    this._data = data;
    const markup = this._generateMarkup();

    if(!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //convert string to a DOM object (virtual DOM in a memory)
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //convert to Array
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    //sellect all current elements on the page to compare with newElements
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    //Do comparison
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];      
      //check if there is change and if the element contain text
      if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
        curEl.textContent = newEl.textContent;
      }
      //change the attributes
      if(!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value)); 
      };     
    })    
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  //Error message
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
      </div>
    `;    
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  //success message
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
      </div>
    `;    
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
};