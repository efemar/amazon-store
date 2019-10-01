

require("dotenv").config();


var keys = require("./key.js");
var mysql = require("mysql");
var inquirer = require("inquirer")


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: keys.my_sql.user,
    password: keys.my_sql.password,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    //Function that displays the first two questions to user and the updates products
    initialize();

});


function readProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
    })
}



function initialize() {
    readProducts();
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the item that you would like to purchase? [Quit with Q]",

            }
        ]).then(function (answers) {
            var product = answers.id;
            var query = "SELECT * FROM products WHERE item_id=" + product + "";

            if (product === "Q") {
                console.log("Goodbye");
                connection.end();
                return;

            } else {
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    if (res.length < 1) {
                        console.log("That item is not in the inventory");
                        initialize();
                    }
                    else {
                        inquirer.prompt([
                            {
                                name: "quantity",
                                type: "input",
                                message: "How many would you like? [Quit with Q]",

                            }
                        ]).then(function (answers) {
                            var quantity = answers.quantity;
                            if (quantity === "Q") {
                                console.log("Goodbye");
                                connection.end();
                                return;
                            }
                            
                            else if (quantity <= res[0].stock_quantity)   {
                                console.log("Successfully purchased " + quantity + " " + res[0].product_name + "(s)");
                                console.log("Your total price is: " + (quantity * res[0].price) + " dollars")
                                //Need to update table with the new inventory
                                newQuantity = res[0].stock_quantity - quantity;
                                connection.query("UPDATE products SET ? WHERE ?",
                                [
                                  {
                                    stock_quantity: newQuantity
                                  },
                                  {
                                    item_id: product
                                  }
                                ], function (err, res) {
                                    if (err) throw err;
                                    initialize();
                                })
 
                            }
                            else if (quantity >= res[0].stock_quantity) {
                                console.log("Insufficient quantity!");
                                initialize();
                            }
                              
                        })

                    }
                })

            }
        })
    })

};



