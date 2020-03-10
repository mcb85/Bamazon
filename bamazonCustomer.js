var inquirer = require ('inquirer');
var mysql = require ('mysql');

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",

    password: "Newcoder!9",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    enterId();
  });

  function enterId() {
    inquirer
      .prompt({
        name: "id",
        type: "input",
        message: "Please enter the ID of the product you wish to purchase."
      })
      .then(function(answer) {
        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";
        connection.query(query, {item_id: answer.id }, function(err, res){
        for (var i = 0; i < res.length; i++) {
            console.log(" Product ID: " + res[i].item_id + " /nProduct Name: " + res[i].product_name + " || Price: " + res[i].price);
           console.log ("Quantity Available: " + res[i].stock_quantity); 
          }
        }) 
        enterQuantity();
  })
}

function enterQuantity() {
  inquirer.prompt({
    name: "quantity",
    type: "input",
    message: "Please enter quantity desired for this product."
  })
  .then(function(answer){
    var query = "SELECT stock_quantity FROM products WHERE ?";
    connection.query(query, {stock_quantity: answer.quantity}, function(err, res){
      for (var i = 0; i < res.length; i++) {
        console.log("Quantity Remaining: " + res[i].stock_quantity);
      }

    })
  })
}