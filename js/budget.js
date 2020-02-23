///////////////////////////////////////////////////////////////////////
// CHECKBOOK BALANCE BASIC 
//

// BALANCE CONTROLLER
const balanceController = (function () {

  // Expense function constructor
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  // Income function constructor
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Calculate Total Income or Expense
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

  // Public Accessible Methods 
  return {
    // Add item method
    addItem: function (type, des, val) {
      let obj, id;

      // Create new ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 1;
      };

      // Create new expense or income items
      if (type === 'exp') {
        obj = new Expense(id, des, val);
      } else if (type === 'inc') {
        obj = new Income(id, des, val);
      }

      // Add items to data structure
      data.allItems[type].push(obj);
      return obj;
    },
    deleleItem: function (type, id) {

      const ids = data.allItems[type].map(function (val) {
        return val.id;
      });

      const index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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
    calcPercentage: function () {
      data.allItems.exp.forEach((val) => val.calculatePercentage(data.totals.inc));
    },
    getPercentage: function () {
      const expItemPerc = data.allItems.exp.map((val) => val.getPercentage());
      return expItemPerc;
    },
    getBalance: function () {
      return {
        balance: data.balance,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function () { console.log(data); }
  };

})();

//////////////////////////////////////////////////////////////////////////////
// UI CONTROLLER
//
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
    percTotalLabel: '.budget__expenses--percentage',
    container: '.container',
    percItemLabel: '.item__percentage',
    dateLable: '.budget__title--month'
  };

  // Format number function
  const numberFormat = function (num, type) {
    let numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };

  // Node lopp function
  const elementListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  // Setup public accessible object's methods
  return {

    // Get input data from input selection, input fields 
    getInput: function () {
      return {
        type: document.querySelector(DOMels.inputType).value, // Value will be 'inc' or 'exp'
        description: document.querySelector(DOMels.inputDesc).value, // Description from input field
        value: parseFloat(document.querySelector(DOMels.inputVal).value) // Amount from input field
      };
    },
    addListItem: function (obj, type) {
      let html, temp, element;

      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMels.incList;
        temp = '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="right"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
      } else if (type === 'exp') {
        element = DOMels.expList;
        temp = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div> <div class="right"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with obj.id, obj.description, and obj.value
      html = temp.replace('%id%', obj.id);
      html = html.replace('%description%', obj.description);
      html = html.replace('%value%', numberFormat(obj.value, type));

      // Insert the HTML item on income or expense list
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },
    // Delete UI's income or expense item from list
    deleteUiItem: function (elementId) {
      let element = document.getElementById(elementId);
      element.parentNode.removeChild(element);
    },
    // Reset all input fields to empty, and move focus back to description input field
    resetInput: function () {
      const temp = document.querySelectorAll(DOMels.inputDesc + ', ' + DOMels.inputVal);
      const clrInput = Array.prototype.slice.call(temp);

      clrInput.forEach(function (val, index, array) {
        val.value = '';
      });
      clrInput[0].focus();
    },
    // Display balance, total income and expense
    displayBalance: function (obj) {
      let type;

      obj.balance > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMels.balLabel).textContent = numberFormat(obj.balance, type);
      document.querySelector(DOMels.incLabel).textContent = numberFormat(obj.totalInc, 'inc');
      document.querySelector(DOMels.expLabel).textContent = numberFormat(obj.totalExp, 'exp');

      // check for percentage > 0
      if (obj.percentage > 0) {
        document.querySelector(DOMels.percTotalLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMels.percTotalLabel).textContent = '---';
      }
    },
    // Display expense percentage on item list
    displayPercentage: function (percentage) {
      const expItemNode = document.querySelectorAll(DOMels.percItemLabel);

      elementListForEach(expItemNode, function (val, index) {
        if (percentage[index] > 0) {
          val.textContent = percentage[index] + '%';
        } else {
          val.textContent = '---';
        }
      });

    },
    displayDate: function () {
      let time, zone, date, today, month, year;

      date = new Date();
      // time = date.getTime();
      today = date.getDate();
      year = date.getFullYear();
      month = date.getMonth();
      // zone = date.getTimezoneOffset();

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      date = today + ', ' + months[month] + ', ' + ' ' + year

      document.querySelector(DOMels.dateLable).textContent = date;

    },
    // Change the input select type 'inc' or 'exp'
    changeIncExp: function () {

      let inputIncExp = document.querySelectorAll(DOMels.inputType + ',' + DOMels.inputDesc + ',' + DOMels.inputVal);

      elementListForEach(inputIncExp, function (val, index) {
        val.classList.toggle('red-focus');
      });

      document.querySelector(DOMels.addBtn).classList.toggle('red');
    },

    // return DOM object 
    getDOMels: function () {
      return DOMels;
    }
  }
})();

////////////////////////////////////////////////////////////////////////////
// GLOBAL APP CONTROLLER
// 
const controller = (function (balanceCtrl, UICtrl) {

  // UI Element & Event Data Selection Function
  const eventsData = function () {
    const DOMels = UICtrl.getDOMels();

    document.querySelector(DOMels.addBtn).addEventListener('click', addItemCtrl);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        addItemCtrl();
      }
    });

    document.querySelector(DOMels.container).addEventListener('click', deleteItemCtrl);
    document.querySelector(DOMels.inputType).addEventListener('change', UICtrl.changeIncExp);
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

  const updatePercentage = function () {

    // 1. Calculate Percentages
    balanceCtrl.calcPercentage();

    // 2. Read percentage from the balance controller
    const percentage = balanceCtrl.getPercentage();

    // 3. Update the UI 
    UICtrl.displayPercentage(percentage);
  };

  // Add Item Controller Object
  const addItemCtrl = function () {

    // 1. Get the field input data
    const input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

      // 2. Add the item to the balance controller
      const obj = balanceCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(obj, input.type);

      // 4. Clear input data 
      UICtrl.resetInput();

      // 5. Calculate and update balance
      updateBalance();

      // 6. Calculate and update percentages
      updatePercentage();
    }
  };

  // Delete Item Controller Object
  const deleteItemCtrl = function (event) {
    const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      // inc-n or exp-n
      const splitId = itemId.split('-');
      const type = splitId[0];
      const id = parseInt(splitId[1]);

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
      UICtrl.displayDate();
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

