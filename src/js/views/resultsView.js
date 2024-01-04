import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again.";
  _message = "";

  // addHandlerSortByTitle(handler) {
  //   this._parentElement.addEventListener("click", function (e) {
  //     const btn = e.target.closest(".btn--sort-title");

  //     if (!btn) return;

  //     handler();
  //   });
  // }

  addHandlerSortByPublisher() {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--sort-publisher");

      if (!btn) return;
      else console.log("Ingredients CHECKED");
    });
  }

  _generateMarkup() {
    return `
    <div class="sort_by--info">
      <button class="btn--inline btn--sort-publisher">
        <h5>Sort By Publisher</h5>
      </button>
      <button class="btn--inline btn--sort-title">
        <h5>Sort By Title</h5>
      </button>
    </div>
    ${this._data.map((result) => previewView.render(result, false)).join("")}
    `;
  }

  // _generateMarkup() {
  //   return this._data.map(this._generateMarkupPreview).join("");
  // }

  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);

  //   return `
  //   <li class="preview">
  //           <a class="preview__link ${
  //             result.id === id ? "preview__link--active" : ""
  //           }" href="#${result.id}">
  //             <figure class="preview__fig">
  //               <img src="${result.image}" alt="${result.title}" />
  //             </figure>
  //             <div class="preview__data">
  //               <h4 class="preview__title">${result.title}</h4>
  //               <p class="preview__publisher">${result.publisher}</p>
  //             </div>
  //           </a>
  //         </li>`;
  // }
}

export default new ResultsView();
