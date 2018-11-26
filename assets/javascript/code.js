 
 $(document).ready(function () {

 // Set the configuration for your app
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA5sB0kbY9ooEbWFvp2yMiJ5YXUNumYpzI",
    authDomain: "train-scheduler-ccc85.firebaseapp.com",
    databaseURL: "https://train-scheduler-ccc85.firebaseio.com",
    projectId: "train-scheduler-ccc85",
    storageBucket: "train-scheduler-ccc85.appspot.com",
    messagingSenderId: "738128499409"
  };
  
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database().ref("Trains/XmzhK1huIcrII4GXyYUk");

// Enable logging across page refreshes
firebase.database.enableLogging(true, true);

database.once("value")
  .then(function(snapshot) {
    var data = snapshot.val();

    console.log(data)
  });
});