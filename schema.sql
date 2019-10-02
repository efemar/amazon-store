DROP DATABASE IF EXISTS bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT(8) NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(6,2) ,
  stock_quantity INTEGER(6),
  PRIMARY KEY (item_id)
  );
