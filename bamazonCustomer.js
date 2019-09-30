

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

    //Function that displays the content of the products table
    readProducts();

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
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "id",
                type: "number",
                message: "What is the ID of the product that you would like to buy?",

            }, {
                name: "quantity",
                type: "number",
                message: "How many units would you like to buy?",
            }
        ]).then(function (answers) {
            //compare item quantity with the current quantity
            //if item exists, then fullfill the order
            //if the item does not exist, console.log ("Insufficient quantity")
            //Show customer the total purchase price


        })
    })
}
