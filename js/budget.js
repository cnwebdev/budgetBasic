///////////////////////////////////////////////////////////////////////
// Budget Management Basic

// Bubget Controller
var budgetController = (function () {
  // Some Code

})();

// UI Controller
var UIController = (function () {

  // UI Data Object
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  // return object values
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // income or expense
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings: function () {
      return DOMStrings;
    }
  }
})();

// Global App Controller
var controller = (function (budgetCtrl, uiCtrl) {

  var DOMobject = uiCtrl.getDOMStrings();

  // Add data function
  var ctrlAddItem = function () {
    // 1. Get the field input data
    var inputData = uiCtrl.getInput();
    console.log(inputData);

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Display the budget on the UI

    console.log('It works');

  }

  document.querySelector(DOMobject.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keydown', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);








