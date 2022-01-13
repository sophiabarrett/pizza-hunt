// create variable to hold db connection
let db;

// establish a conneciton to IndexedDB database called 'pizza_hunt' and set it to version 1
// indexedDB is a global variable that's part of the browser's window object
// the open() method takes 2 parameters: the name of the db you'd like to create/connect to and the version of the db
const request = indexedDB.open("pizza_hunt", 1);

// this event will emit if the database version changes
request.onupgradeneeded = function (event) {
  // save a reference to the db
  const db = event.target.result;
  // create an object store (table) called 'new_pizza' and
  // set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

// upon a successful request
request.onsuccess = function (event) {
  // when db is successfully created with its object store
  db = event.target.result;

  // check if app is online, if yes then send all local db data to api
  if (navigator.online) {
    uploadPizza();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new pizza
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access the object store for 'new_pizza'
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add record to your store with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // upon a successful getAll execution, run this function
  getAll.onsuccess = function() {
    // if there was data in indexedDb's store, send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);