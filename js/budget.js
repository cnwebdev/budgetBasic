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

  return {
    addItem: function (type, des, val) {
      let newItem, id;

      // Create new ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      };

      // Create new expense or income items
      if (type === 'exp') {
        newItem = new Expense(id, des, val);
        console.log(newItem);
      } else if (type === 'inc') {
        newItem = new Income(id, des, val);
        console.log(newItem);
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
    inBtn: '.add__btn',
    inContainer: '.income__list',
    exContainer: '.expenses__list'
  };


  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMels.inType).value, // Value will be inc or exp
        description: document.querySelector(DOMels.inDesc).value,
        value: document.querySelector(DOMels.inVal).value
      };
    },
    addListItem: function (obj, type) {
      let html, newHtml, element;

      // Create HTML string with placeholder text

      if (type === 'inc') {
        element = DOMels.inContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
      } else if (type === 'exp') {
        element = DOMels.exContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div>    <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML item
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    getDOMels: function () {
      return DOMels;
    }
  }
})();

// Global App Controller
const controller = (function (budgetCtrl, UICtrl) {

  const eventsData = function () {
    const DOMels = UICtrl.getDOMels();

    document.querySelector(DOMels.inBtn).addEventListener('click', addItemCtrl);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        addItemCtrl();
      }
    });
  };

  // Add Item Controller Object
  const addItemCtrl = function () {

    // 1. Get the field input data
    const input = UICtrl.getInput();

    // 2. Add the item to the budget controller
    const newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Calculate the budget

    // 5. Display the budget on the UI
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