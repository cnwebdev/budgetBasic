///////////////////////////////////////////////////////////////////////
// Budget Management Basic

// BUDGET CONTROLLER
var budgetController = (function () {

  var x = 23;

  var add = function (a) {
    return x + a;
  }

  return {
    publicTest: function (b) {
      return add(b);
    }
  }
})();

var UIController = (function () {
  // Code 


})();

var consoller = (function (budgetCtrl, UICtrl) {
  // Code
  var addResult = budgetController.publicTest(33);
  console.log(addResult);

})(budgetController, UIController);