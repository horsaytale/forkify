import View from "./View.js";
import icons from "url:../../img/icons.svg";
import { getIterator } from "core-js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded ;)";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  //refer this keyword to the topic 'this'
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  /**
   * To extract data from form that user submitted
   * @param {function} handler
   * @function FormData This extract data but must be in [...new FormData(this)] format
   * @function Object.fromEntries() This transform array into Object
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener("click", function (e) {
      // e.preventDefault();
      const btn = e.target.closest(".upload__btn");

      if (!btn) return;
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      console.log("data", data);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
