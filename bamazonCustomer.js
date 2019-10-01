

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
                        console.log("That item is not in inventory");
                        initialize();
                    }
                    else {
                        inquirer.prompt([
                            {
                                name: "quantity",
                                type: "input",
                                message: "What quantity would you like to purchase? [Quit with Q]",

                            }
                        ]).then(function (answers) {
                            var quantity = answers.quantity;
                            if (quantity === "Q") {
                                console.log("Goodbye");
                                connection.end();
                                return;
                            }
                            if (quantity < res[0].quantity) {
                                console.log("Insufficient quantity!")
                            }
                            else {
                                console.log("Successfully purchased " + product + quantity);
                                console.log("Your total price is: " + (quantity * res[0].price))
                                //Need to update table with the new inventory
                            }
                        })

                    }
                })

            }
        })
    })

};



