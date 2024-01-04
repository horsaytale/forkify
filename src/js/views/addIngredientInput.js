import View from "./View.js";

class addIngredientInput extends View {
  _parentElement = document.querySelector(".ingredient__data");

  addHandlerClick() {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".add__ingredient-button");

      if (!btn) return;
      const ingredientNodeList = document.querySelectorAll(".ingredient-input");
      console.log(ingredientNodeList + 1);

      const generateIngredientMarkUp = function (nextNumber) {
        return `
        <div class="ingredient-input ingredient-set-${nextNumber}">
                <label>Name</label>
                <input type="text" name="ingredient-${nextNumber}-description" />
                <label>Quantity</label>
                <input type="number" name="ingredient-${nextNumber}-quantity" />
                <label>Unit</label>
                <input type="text" name="ingredient-${nextNumber}-unit" />
        </div>
        `;
      };

      const markup = generateIngredientMarkUp(ingredientNodeList.length + 1);

      document.querySelector(".add__ingredient-button").insertAdjacentHTML("beforebegin", markup);
    });
  }
}
export default new addIngredientInput();
