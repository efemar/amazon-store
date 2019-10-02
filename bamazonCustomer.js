

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
    initialize();

});

//function that displays the database items
function readProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
    })
}


//function that prompts the user to answer which item they want
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
    
           if (answers.id === "Q") {
                quit();
                return;     
            } else {
                promptUserQuantity(answers.id);
             }
        })
    })
};


//function that prompts user to input quantity
function promptUserQuantity(product) { 
var query = "SELECT * FROM products WHERE item_id=" + product + "";
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
            if (answers.quantity === "Q") {
                quit();
                return;
            }

            else if (answers.quantity <= res[0].stock_quantity) {
                updateInventory(answers.quantity, product, res);

            }
            else if (answers.quantity >= res[0].stock_quantity) {
                console.log("Insufficient quantity!");
                initialize();
            }

        })

    }
})

}

//function to update the inventory based on quantity selected
function updateInventory(quantity, product, res) {
    console.log("Successfully purchased " + quantity + " " + res[0].product_name + "(s)");
    console.log("Your total price is: " + (quantity * res[0].price) + " dollars")
    //Need to update table with the new inventory
    newQuantity = res[0].stock_quantity - quantity;
    //console.log(newQuantity);
    //console.log(answers.id);
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

//Function that runs after use inputs "Q"
function quit() {
    console.log("Goodbye");
    connection.end();
}