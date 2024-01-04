import icons from "url:../../img/icons.svg";

/**
 * [ PARENT CLASS ]
 * @private _data | _clear
 * @public render(data, render=True) | update(data) | renderSpinner() | renderError(message=this._errorMessage) | renderMessage(message=this._message)
 */
export default class View {
  _data;

  //You can refer this at JSDOC.APP
  /**
   * Render the RECEIVED Object to the DOM
   * @param { Object | Object[] } data Rendered data in form of Object OR an ARRAY of objects (e.g. recipe)
   * @param { boolean } [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   */
  render(data, render = true, clear = true) {
    // !data only works for undefined/null not empty array
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    if (clear) this._clear();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // [ OPTIONAL ]--- NEW METHOD to avoid re-rendering data on update Servings ---
  /**
   * To update data when UPDATE Servings (Avoid re-rendering the whole data from top to bottom) - rather on the part that requires update
   * @param {Object | Object[]} data
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //This will convert the string into real DOM node objects
    //DOM not living on the page, rather it is living in memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    //Put all the DOM node objects under an Array format
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    console.log("newElements", newElements);
    console.log("currentElements", curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //UPDATES CHANGE ON TEXT
      //.isEqualNode() compare two elements on the content
      // newEl.firstChild?.nodeValue.trim() !== "" ==> to ensure that the comparison made between the selected elements must have text content
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
        // console.log(`🔺: ${newEl.firstChild?.nodeValue.trim()}`);
        curEl.textContent = newEl.textContent;
      }

      //UPDATES CHANGE ON ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) => curEl.setAttribute(attr.name, attr.value));
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner = function () {
    const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  };

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
}
