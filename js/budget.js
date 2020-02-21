///////////////////////////////////////////////////////////////////////
// Budget Management Basic

// Bubget Controller
const budgetController = (function () {

  // Expense function constructor
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Income function constructor
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Data structure for all app data
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      int: 0
    }
  };
  // Add item method
  return {
    addItem: function (type, des, val) {
      let newItem, id;

      // Create new ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 1;
      };

      // Create new expense or income items
      if (type === 'exp') {
        newItem = new Expense(id, des, val);
      } else if (type === 'inc') {
        newItem = new Income(id, des, val);
      }

      // Add items to data structure
      data.allItems[type].push(newItem);

      return newItem;
    },
    testing: function () {
      console.log(data)
    }
  };

})();

// UI Controller
const UIController = (function () {

  // DOM element variables
  const DOMels = {
    inType: '.add__type',
    inDesc: '.add__description',
    inVal: '.add__value',
    addBtn: '.add__btn',
    inContainer: '.income__list',
    exContainer: '.expenses__list'
  };

  // Setup publicly accessible object's methods
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMels.inType).value, // Value will be inc or exp
        description: document.querySelector(DOMels.inDesc).value,
        value: parseFloat(document.querySelector(DOMels.inVal).value)
      };
    },
    addListItem: function (obj, type) {
      let html, temp, element;

      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMels.inContainer;
        temp = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
      } else if (type === 'exp') {
        element = DOMels.exContainer;
        temp = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      html = temp.replace('%id%', obj.id);
      html = html.replace('%description%', obj.description);
      html = html.replace('%value%', obj.value);

      // Insert the HTML item
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },
    resetInput: () => {
      const temp = document.querySelectorAll(DOMels.inDesc + ', ' + DOMels.inVal);
      const clrInput = Array.prototype.slice.call(temp);

      clrInput.forEach(function (val, index, array) {
        val.value = '';
      });
      clrInput[0].focus();
    },
    // return DOM object 
    getDOMels: function () {
      return DOMels;
    }
  }
})();

// Global App Controller
const controller = (function (budgetCtrl, UICtrl) {

  const eventsData = function () {
    const DOMels = UICtrl.getDOMels();

    document.querySelector(DOMels.addBtn).addEventListener('click', addItemCtrl);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        addItemCtrl();
      }
    });
  };

  // Update budget function
  const updateBudget = function () {
    // 1. Calculate the budget


    // 2. Return the budget


    // 3. Display the budget on the UI


  };

  // Add Item Controller Object
  const addItemCtrl = function () {

    // 1. Get the field input data
    const input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

      // 2. Add the item to the budget controller
      const newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear input data 
      UICtrl.resetInput();

      // 5. Calculate and update budget
      updateBudget();

    }
  };

  return {
    init: function () {
      console.log('App loaded!');
      eventsData();
    }
  };

})(budgetController, UIController);

// Call controller's init();
controller.init();




  // Init function





//////////////////////////////////////////////////////////////////////////////////
// TO-DO LIST

/*

UI MODULE
Get input values
Add the new item to UI
Update the UI


DATA MODULE
Add the new item to data structure
Calculate budget


CONTROLLER MODULE
Add event handler


*/