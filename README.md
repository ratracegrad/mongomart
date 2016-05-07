# mongomart
Ecommerce app Using the MongoDB driver and Express

# Technology Stack
- Mongo
- Express

## Installation
```bash
git clone https://github.com/ratracegrad/mongomart
npm install
node mongomart.js
```

## Populating MongoDB database with items
In the data folder are two json files: cart.json and items.json. You can use these two files
to populate your mongo database with items for your ecommerce site. Here are the steps:

```bash
create a mongo database called mongomart
create a collection called cart
create a collection called item
Import the "item" collection: mongoimport -d mongomart -c item data/items.json
Import the "cart" collection: mongoimport -d mongomart -c cart data/cart.json
```

## Live Demonstration
[You can view this app in production here](https://jb-fanbox.herokuapp.com)

## Screenshot
Here is the home page of the mongomart e-commerce application.
![MongoMart Homepage](/screenshots/homepage.png?raw=true "MongoMart Homepage")

On the left navigation you can select a category. Here is the category page.
![MongoMart Category](/screenshots/category.png?raw=true "MongoMart Category")

You can click on any item to get more details. Here is the details page for a single item.
![MongoMart Single Item](/screenshots/singleItem.png?raw=true "MongoMart Single Item")

Here is the cart page showing items you have added to your cart
![MongoMart Cart](/screenshots/cart.png?raw=true "MongoMart Cart")
