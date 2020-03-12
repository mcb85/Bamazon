var inquirer = require('inquirer');
var mysql = require('mysql');
pry = require('pryjs');

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Newcoder!9",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Welcome to Bamazon");
  displayAllProducts();

});

function displayAllProducts() {
  var query = "SELECT item_id, product_name, price FROM products";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Product ID: " + res[i].item_id + " \nProduct Name: " + res[i].product_name + "\nPrice: " + "$" + res[i].price +"\n");

    }
    enterProduct();
  })
}



function enterProduct() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Please enter the ID of the product you wish to purchase."
      },
      {
        name: "quantity",
        type: "input",
        message: "Please enter quantity desired for this product."
      }
    ]).then(function (answer) {
      var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";
      connection.query(query, { item_id: answer.id }, function (err, res) {
        for (var i = 0; i < res.length; i++) {
          var id = res[i].item_id;
          console.log("Product ID: " + id + " \nProduct Name: " + res[i].product_name + "\nPrice: " + "$" + res[i].price);
        }
        var checkStock = checkIfInStock(answer.quantity, res[0].stock_quantity);
        if (checkStock === true) {
          connection.query(
            "Update products SET stock_quantity = ? WHERE item_id = ?",
            [
              res[0].stock_quantity - answer.quantity, answer.id
            ],
            function (err, res) {
              if (err) throw err;
            }
          )
          console.log("Amount Due: " + "$" + res[0].price);
          connection.end();
        } else {
          console.log("Insufficient Quantity!");
          connection.end();
        }


      })

    })

}

function checkIfInStock(answerQuantity, stockQuantity) {
  if (stockQuantity - answerQuantity > 0) {
    return true;
  } else {
    return false;
  }
}




