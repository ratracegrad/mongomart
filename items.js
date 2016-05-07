/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";

        /*
        * TODO-lab1A
        *
        * LAB #1A: Implement the getCategories() method.
        *
        * Write an aggregation query on the "item" collection to return the
        * total number of items in each category. The documents in the array
        * output by your aggregation should contain fields for "_id" and "num".
        *
        * HINT: Test your mongodb query in the shell first before implementing
        * it in JavaScript.
        *
        * In addition to the categories created by your aggregation query,
        * include a document for category "All" in the array of categories
        * passed to the callback. The "All" category should contain the total
        * number of items across all categories as its value for "num". The
        * most efficient way to calculate this value is to iterate through
        * the array of categories produced by your aggregation query, summing
        * counts of items in each category.
        *
        * Ensure categories are organized in alphabetical order before passing
        * to the callback.
        *
        */

        var categories = [];
        var total = 0;
        var category = {
            _id: "All",
            num: 9999
        };

        // push our All category into the categories array first - will update the total at the end
        categories.push(category);

        // search the database with aggregate to get all categories unique and total of items for each category
        this.db.collection('item').aggregate([ { $group: { _id: '$category', num: { $sum: 1 } } }, { $sort: { _id: 1 } } ]).toArray(function(err, docs) {
            if (err) {
                throw err;
            }

            //verify lookup worked
            assert.equal(null, err);

            // docs is array of our categories and count so now need to push it into categories array
            docs.forEach(function(item) {
                // format category with item details and push into categories array
                var itemCat = _.clone(category);
                itemCat._id = item._id;
                itemCat.num = item.num;
                total += item.num;
                categories.push(itemCat);
            });

            // now update the total for our all category
            categories[0].num = total;

            //console.log('categories', categories);

            // TODO-lab1A Replace all code above (in this method).

            // TODO Include the following line in the appropriate
            // place within your code to pass the categories array to the
            // callback.
            callback(categories);
        });
    }


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab1B
         *
         * LAB #1B: Implement the getItems() method.
         *
         * Create a query on the "item" collection to select only the items
         * that should be displayed for a particular page of a given category.
         * The category is passed as a parameter to getItems().
         *
         * Use sort(), skip(), and limit() and the method parameters: page and
         * itemsPerPage to identify the appropriate products to display on each
         * page. Pass these items to the callback function.
         *
         * Sort items in ascending order based on the _id field. You must use
         * this sort to answer the final project questions correctly.
         *
         * Note: Since "All" is not listed as the category for any items,
         * you will need to query the "item" collection differently for "All"
         * than you do for other categories.
         *
         */

        /*
        var pageItem = this.createDummyItem();
        var pageItems = [];
        for (var i=0; i<5; i++) {
            pageItems.push(pageItem);
        }
        */

        // not really required but doing it to make sure it does not mess up anything if invalid values are passed in
        var category = category || 'All';
        var page = page || 0;
        var itemsPerPage = itemsPerPage || 5;

        // setup values we will need in our query
        var skip = page * itemsPerPage;
        var limit = itemsPerPage;
        var pageItems = [];

        // account for edge case of category being all
        if (category.toLowerCase() === 'all') {
            this.db.collection('item').find( {} ).skip(skip).limit(limit).sort({ _id: 1 })
                    .toArray(function(err, docs) {
                        if (err) {
                            throw err;
                        }

                        //verify lookup worked
                        assert.equal(null, err);

                        // docs is an array of items in our category to be displayed on the page
                        docs.forEach(function(item) {
                            pageItems.push(item);
                        });

                        //console.log('pageItems for All', pageItems);
                        callback(pageItems);
                    });
        } else { // handle all other categories
            this.db.collection('item').find( {category: category }).skip(skip).limit(limit).sort({ _id: 1 })
                    .toArray(function(err, docs) {
                        if (err) {
                            throw err;
                        }

                        //verify lookup worked
                        assert.equal(null, err);

                        // docs is an array of items in our category to be displayed on the page
                        docs.forEach(function(item) {
                            pageItems.push(item);
                        });

                        //console.log('pageItems for category',category, pageItems);
                        callback(pageItems);
                    });
        }

        // TODO-lab1B Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the items for the selected page
        // to the callback.
        //callback(pageItems);
    }


    this.getNumItems = function(category, callback) {
        "use strict";

        //var numItems = 0; // not used so comment out - using docs.length instead

        // should not be necessary but doing anyway to make sure it does not fail on bad input data
        var category = category || 'All';

        // account for edge case of category is All meaning count everything
        if (category.toLowerCase() === 'all') {
            this.db.collection('item').find({}).toArray(function(err, docs) {
                if (err) {
                    throw err;
                }

                //verify lookup worked
                assert.equal(null, err);

                //console.log('All numItems', docs.length);
                callback(docs.length);
            });
        } else { // search only for specified category
            this.db.collection('item').find({ category: category }).toArray(function(err, docs) {
                if (err) {
                    throw err;
                }

                //verify lookup worked
                assert.equal(null, err);

                //console.log('numItems for category', category, docs.length);
                callback(docs.length);
            });
        }
        /*
         * TODO-lab1C:
         *
         * LAB #1C: Implement the getNumItems method()
         *
         * Write a query that determines the number of items in a category
         * and pass the count to the callback function. The count is used in
         * the mongomart application for pagination. The category is passed
         * as a parameter to this method.
         *
         * See the route handler for the root path (i.e. "/") for an example
         * of a call to the getNumItems() method.
         *
         */

         // TODO Include the following line in the appropriate
         // place within your code to pass the count to the callback.
        //callback(numItems);
    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab2A
         *
         * LAB #2A: Implement searchItems()
         *
         * Using the value of the query parameter passed to searchItems(),
         * perform a text search against the "item" collection.
         *
         * Sort the results in ascending order based on the _id field.
         *
         * Select only the items that should be displayed for a particular
         * page. For example, on the first page, only the first itemsPerPage
         * matching the query should be displayed.
         *
         * Use limit() and skip() and the method parameters: page and
         * itemsPerPage to select the appropriate matching products. Pass these
         * items to the callback function.
         *
         * searchItems() depends on a text index. Before implementing
         * this method, create a SINGLE text index on title, slogan, and
         * description. You should simply do this in the mongo shell.
         *
         */

        //var item = this.createDummyItem();
        //var items = [];
        //for (var i=0; i<5; i++) {
        //    items.push(item);
        //}

        // not required but doing to make sure does not die with bad input data
        var query = query || {};
        var page = page || 0;
        var itemsPerPage = itemsPerPage || 5;

        // setup our variables for our query
        var limit = itemsPerPage;
        var skip = page * itemsPerPage;
        var items = [];

        this.db.collection('item').find({ $text: { $search: query } }).skip(skip).limit(limit).sort({ _id: 1 })
                .toArray(function(err, docs) {
                    if (err) {
                        throw err;
                    }

                    //verify lookup worked
                    assert.equal(null, err);

                    //docs contains array of results
                    docs.forEach(function(item) {
                        items.push(item);
                    });

                    //console.log('search items', items);
                    callback(items);
                })
        // TODO-lab2A Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the items for the selected page
        // of search results to the callback.
        //callback(items);
    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        /*
        * TODO-lab2B
        *
        * LAB #2B: Using the value of the query parameter passed to this
        * method, count the number of items in the "item" collection matching
        * a text search. Pass the count to the callback function.
        *
        * getNumSearchItems() depends on the same text index as searchItems().
        * Before implementing this method, ensure that you've already created
        * a SINGLE text index on title, slogan, and description. You should
        * simply do this in the mongo shell.
        */

        // not necessary but doing to make sure does not die with bad input data
        var query = query || {};

        this.db.collection('item').find({ $text: { $search: query } })
                .toArray(function(err, docs) {
                    if (err) {
                        throw err;
                    }

                    //verify lookup worked
                    assert.equal(null, err);

                    //console.log('getNumSearchItems', docs.length);
                    //docs contains array of results
                    callback(docs.length);
                })
        //callback(numItems);
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        /*
         * TODO-lab3
         *
         * LAB #3: Implement the getItem() method.
         *
         * Using the itemId parameter, query the "item" collection by
         * _id and pass the matching item to the callback function.
         *
         */

        //var item = this.createDummyItem();

        this.db.collection('item').findOne({ _id: itemId }, function(err, doc) {
            if (err) {
                throw err;
            }

            //verify lookup worked
            assert.equal(null, err);

            //console.log('getItem', doc);

            callback(doc);
        })
        // TODO-lab3 Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the matching item
        // to the callback.
        //callback(item);
    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        /*
         * TODO-lab4
         *
         * LAB #4: Implement addReview().
         *
         * Using the itemId parameter, update the appropriate document in the
         * "item" collection with a new review. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields:
         * "name", "comment", "stars", and "date".
         *
         */

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        // TODO replace the following two lines with your code that will
        // update the document with a new review.
        //var doc = this.createDummyItem();
        //doc.reviews = [reviewDoc];

        this.db.collection('item').updateOne({ _id: itemId }, { $push: { reviews: reviewDoc }}, function(err, doc) {
            if (err) {
                throw err;
            }

            //verify lookup worked
            assert.equal(null, err);

            //console.log('doc in addReview', doc);

            callback(doc);
        });
        // TODO Include the following line in the appropriate
        // place within your code to pass the updated doc to the
        // callback.
        //callback(doc);
    }


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
