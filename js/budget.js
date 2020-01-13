///////////////////////////////////////////////////////////////////////
// Budget Management Basic

// Bubget Controller
var budgetController = (function () {

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      ID = 0;

      // [1, 2, 3, 4, 5], next ID = 6
      // We want ID = last ID + 1
      // Creat new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push new item into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    testing: function () {
      console.log(data);
    }
  };

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

  var setupEventListeners = function () {
    var DOMobject = uiCtrl.getDOMStrings();

    document.querySelector(DOMobject.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };


  // Add data function
  var ctrlAddItem = function () {
    var inputData, newItem;

    // 1. Get the field input data
    inputData = uiCtrl.getInput();

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(inputData.type, inputData.description, inputData.value);

    // 3. Add the item to the UI


    // 4. Display the budget on the UI

    console.log('It works');

  };

  // Init function
  return {
    init: function () {
      console.log('Application init started');
      setupEventListeners();
    }
  }

})(budgetController, UIController);

// Call controller's init();
controller.init();








