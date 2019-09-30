// Create a connection with SQL
// Display all of the products in the table

require("dotenv").config();


var keys = require("./key.js");
var mysql = require("mysql");
var inquirer = require("inquirer")


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: keys.my_sql.user,

    // Your password
    password: keys.my_sql.password,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    readProducts();

    // initialize();

});


function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
    })
}



function initialize() {

    inquirer.prompt([
        //The first should ask them the ID of the product they would like to buy.
        {
            name: "id",
            type: "number",
            message: "What is the ID of the product that you would like to buy?",

        },
        {
            //The second message should ask how many units of the product they would like to buy.
            name: "quantity",
            type: "number",
            message: "How many units would you like to buy?",
        }
    ]).then(function (answers) {
        if (answers.id === "POST") {
            // post();
        } else if (
            answers.quantity === "BID"
        ) {
            // bid();
        } else if (answers.Question1 === "EXIT") {
            connection.end(); return;
        }
    });


}

//Using inquirer, ask the user the following:
//The first should ask them the ID of the product they would like to buy.
//The second message should ask how many units of the product they would like to buy.

//Check if store has enough quantities of the item.
//if not, Console log ("Insufficient quantity")
//if yes,  fullfill the customer's order and update the table
//Show customer the total purchase price


// var mysql = require("mysql");
// var inquirer = require("inquirer")



// var connection = mysql.createConnection({
//     host: "localhost",

//     // Your port; if not 3306
//     port: 3306,

//     // Your username
//     user: "root",

//     // Your password
//     password: "password",
//     database: "great_bay_DB"
// });

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId + "\n");

//     initialize();

// });

// function initialize() {
//     inquirer.prompt([
//         {
//             name: "Question1",
//             type: "list",
//             message: "Would you like to [POST] an auction or [BID] on an auction?",
//             choices: ["POST", "BID", "EXIT"]
//         }, {
//             name: "Question2",
//             type: "list",
//             message: "Would you like to [POST] an auction or [BID] on an auction?",
//             choices: ["POST", "BID", "EXIT"]
//         }
//     ]).then(function (answers) {
//         if (answers.Question1 === "POST") {
//             post();
//         } else if (
//             answers.Question1 === "BID"
//         ) {
//             bid();
//         } else if (answers.Question1 === "EXIT") {
//             connection.end(); return;
//         }
//     });
// }




// function post() {
//     console.log("Get ready to submit item..\n");

//     inquirer.prompt([
//         {
//             name: "name",
//             message: "What is the item that you would like to submit?"
//         },
//         {
//             name: "category",
//             message: "What category would you like to place your item in?"
//         }, {
//             name: "price",
//             message: "What would you like your starting bid to be?"
//         }
//     ]).then(function (answers) {

//         var query = connection.query(
//             "INSERT INTO products SET ?",
//             {
//                 name: answers.name,
//                 category: answers.category,
//                 initBidPrice: answers.price
//             },
//             function (err, res) {
//                 if (err) throw err;
//                 console.log("Item successfully posted");
//                 initialize();
//                 // Call updateProduct AFTER the INSERT completes
//             }
//         );
//     });
// }


// function bid() {


//     var query = "SELECT * from products";
//     connection.query(query, function (error, results) {
//         if (error) throw error;
//         var itemArray = [];
//         for (var i of results) {
//             itemArray.push(i.name);
//         }
//         inquirer.prompt([
//             {
//                 type: "list",
//                 message: "Which item to bid?",
//                 choices: itemArray,
//                 name: "item"
//             },
//             {
//                 type: "input",
//                 message: "How much?",
//                 name: "bidPrice"
//             }
//         ]).then(function (answer) {
//             for (var i of results) {
//                 if (i.name === answer.item) {
//                     var dbPrice;
//                     if (i.newBidPrice) {
//                         dbPrice = i.newBidPrice;
//                     } else {
//                         dbPrice = i.initBidPrice;
//                     }
//                     if (parseFloat(answer.bidPrice) > parseFloat(dbPrice)) {
//                         // update database
//                         connection.query(
//                             "UPDATE products SET ? WHERE ?",
//                             [
//                                 {
//                                     newBidPrice: answer.bidPrice
//                                 },
//                                 {
//                                     name: i.name
//                                 }
//                             ],
//                             function (err, res) {
//                                 if (err) throw err;
//                                 console.log("Bid is placed successfully!");
//                                 initialize()
//                             })


//                     } else { console.log("Sorry, bid price is too low. Try again"); initialize(); }

//                 }
//             }
//         });
//     });

// }
