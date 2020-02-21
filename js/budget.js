///////////////////////////////////////////////////////////////////////
// Checkbook Balance Basic

// Balance Controller
const balanceController = (function () {

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

  const calcTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (val) {
      sum += val.value;
    });
    data.totals[type] = sum;
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
    },
    balance: 0,
    percentage: -1
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
    deleleItem: function (type, id) {
      console.log(type, id);

      // 
      const ids = data.allItems[type].map((val) => {
        return val.id;
      });
      console.log(ids);

      const index = ids.indexOf(id);
      console.log(index);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
      console.log(data);
    },
    calcBalance: function () {

      // Calculate total income and expenses
      calcTotal('exp');
      calcTotal('inc');

      // Calculate the balance: income - expenses
      data.balance = data.totals.inc - data.totals.exp;

      // Calculate the percentage expense 
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBalance: function () {
      return {
        balance: data.balance,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputVal: '.add__value',
    addBtn: '.add__btn',
    incList: '.income__list',
    expList: '.expenses__list',
    balLabel: '.budget__value',
    incLabel: '.budget__income--value',
    expLabel: '.budget__expenses--value',
    perLabel: '.budget__expenses--percentage',
    container: '.container'
  };

  // Setup publicly accessible object's methods
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMels.inputType).value, // Value will be inc or exp
        description: document.querySelector(DOMels.inputDesc).value,
        value: parseFloat(document.querySelector(DOMels.inputVal).value)
      };
    },
    addListItem: function (obj, type) {
      let html, temp, element;

      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMels.incList;
        temp = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
      } else if (type === 'exp') {
        element = DOMels.expList;
        temp = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      html = temp.replace('%id%', obj.id);
      html = html.replace('%description%', obj.description);
      html = html.replace('%value%', obj.value);

      // Insert the HTML item
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },
    deleteUiItem: function (elementId) {
      let element = document.getElementById(elementId);
      element.parentNode.removeChild(element);
    },
    resetInput: () => {
      const temp = document.querySelectorAll(DOMels.inputDesc + ', ' + DOMels.inputVal);
      const clrInput = Array.prototype.slice.call(temp);

      clrInput.forEach(function (val, index, array) {
        val.value = '';
      });
      clrInput[0].focus();
    },
    displayBalance: function (data) {
      document.querySelector(DOMels.balLabel).textContent = data.balance;
      document.querySelector(DOMels.incLabel).textContent = data.totalInc;
      document.querySelector(DOMels.expLabel).textContent = data.totalExp;

      // check for percentage > 0
      if (data.percentage > 0) {
        document.querySelector(DOMels.perLabel).textContent = data.percentage + '%';
      } else {
        document.querySelector(DOMels.perLabel).textContent = '---';
      }
    },
    // return DOM object 
    getDOMels: function () {
      return DOMels;
    }
  }
})();

// Global App Controller
const controller = (function (balanceCtrl, UICtrl) {

  const eventsData = function () {
    const DOMels = UICtrl.getDOMels();

    document.querySelector(DOMels.addBtn).addEventListener('click', addItemCtrl);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        addItemCtrl();
      }
    });

    document.querySelector(DOMels.container).addEventListener('click', deleteItemCtrl);
  };

  // Update balance function
  const updateBalance = function () {

    // 1. Calculate the balance
    balanceCtrl.calcBalance();

    // 2. Return the budget
    const balance = balanceCtrl.getBalance();

    // 3. Display the balance on the UI
    UICtrl.displayBalance(balance);

  };

  // Add Item Controller Object
  const addItemCtrl = function () {

    // 1. Get the field input data
    const input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

      // 2. Add the item to the balance controller
      const newItem = balanceCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear input data 
      UICtrl.resetInput();

      // 5. Calculate and update balance
      updateBalance();
    }
  };

  // Delete Item Controller Object
  const deleteItemCtrl = function (event) {
    const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);

    if (itemId) {
      // inc-n or exp-n
      const splitId = itemId.split('-');
      const type = splitId[0];
      const id = parseInt(splitId[1]);
      console.log(type);
      console.log(id);

      // 1. Delete the item from the data structure
      balanceCtrl.deleleItem(type, id);

      // 2. Delete the item from the UI
      UICtrl.deleteUiItem(itemId);

      // 3. Update the balance 
      updateBalance();
    }
  };

  return {
    init: function () {
      console.log('App loaded!');
      UICtrl.displayBalance({
        balance: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      eventsData();
    }
  };

})(balanceController, UIController);

// Call controller's init();
controller.init();

