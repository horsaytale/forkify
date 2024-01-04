import View from "./View.js";
import icons from "url:../../img/icons.svg";

class addShoppingList extends View {
  _clickedElement = document.querySelector(".recipe");
  _parentElement = document.querySelector(".shopping__orders");

  addHandlerClick(handler) {
    this._clickedElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--shopping");

      if (!btn) return;
      handler();
    });
  }

  removeHandlerClick() {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".recipe__stuff__icon");
      // console.log(btn, newElement);
      if (!btn) return;
      const newElement = btn.closest(".recipe__stuff");
      newElement.remove();
    });
  }

  _generateMarkup() {
    return `
        <ul class="shopping__list">
        ${this._data.ingredients
          .map((ing) => {
            // let indexIng = this._data.ingredients.findIndex(
            //   (arr) => arr.description === ing.description
            // );

            // const dataID = this._data.id.slice(this._data.id.length - 4);

            return `
                <li class="recipe__stuff">
                            <input value="${ing.quantity ? ing.quantity : ""}">
                            <div class="recipe__stuff__description">
                            ${ing.unit} ${ing.description}
                            </div>
                            <svg class="recipe__stuff__icon">
                                <use href="${icons}#icon-minus-circle"></use>
                            </svg>
                </li>               
                `;
          })
          .join("")}
        </ul>
        `;
  }
}

export default new addShoppingList();
