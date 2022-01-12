// create variable to hold db connection
let db;

// establish a conneciton to IndexedDB database called 'pizza_hunt' and set it to version 1
// indexedDB is a global variable that's part of the browser's window object
// the open() method takes 2 parameters: the name of the db you'd like to create/connect to and the version of the db
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes
request.onupgradeneeded = function(event) {
    // save a reference to the db
    const db = event.target.result;
    // create an object store (table) called 'new_pizza' and
    // set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
}

// upon a successful request
request.onsuccess = function(event) {
    // when db is successfully created with its object store
    db = event.target.result;

    // check if app is online, if yes then send all local db data to api
    if (navigator.online) {
        // uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
}