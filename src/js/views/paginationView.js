import View from "./View.js";
import icons from "url:../../img/icons.svg";
import { getIterator } from "core-js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generatePageNo() {
    return `
    <div class="pagination__page">
      <p>Page ${this._data.page}</p>
    </div>
    `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    console.log(numPages);
    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      ${this._generatePageNo()}
      <div>
      <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        </div>
      `;
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      ${this._generatePageNo()}
      `;
    }
    //Other page
    if (curPage < numPages) {
      return `

      <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      ${this._generatePageNo()}

        <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
              <span>Page ${curPage + 1}</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
        </button>
        
        `;
    }
    //Page 1, and there are NO other pages
    return "";
  }
}

export default new PaginationView();
