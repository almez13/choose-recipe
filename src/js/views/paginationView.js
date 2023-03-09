import View from "./view.js";
//import icons
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  //add event handler to buttons
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function(e) {
      const btn = e.target.closest(".btn--inline")

      if(!btn) return;
      //get number of the page
      const goToPage = Number(btn.dataset.goto);
      
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    //number of pages
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);    
   
    //Page 1 and there are other pages
    if(curPage === 1 && numPages > 1) {
      return this._generateMarkupBtnNext(curPage);
    }    
    //Last page
    if(curPage === numPages && numPages > 1) {
      return this._generateMarkupBtnPrev(curPage);
    }
    //Otther page
    if (curPage < numPages) {
      return this._generateMarkupBtnPrev(curPage) + this._generateMarkupBtnNext(curPage);      
    }    
    //Page 1 and thre are no other pages
    return "";
  }
  //previous page
  _generateMarkupBtnPrev(curPage) {
    return `
        <button data-goto = "${curPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>${curPage - 1}</span>
        </button>
      `;
  }
  //next page
  _generateMarkupBtnNext(curPage) {
    return `
        <button data-goto = "${curPage + 1}" class="btn--inline pagination__btn--next">
          <span>${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>      
      `;
  }

};

export default new PaginationView();