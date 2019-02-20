
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

  renderTable();

});

// This function fetches information from the database, and displays it
function renderTable() {

  $("#trainInfo").empty();
  $("#time").empty();

  // Get a reference to the database service
  var database = firebase.database().ref();

  // Enable logging across page refreshes
  firebase.database.enableLogging(true, true);

  // Firebase's built-in "once" function returns all the information in
  // the associated database as it is in that moment. It does not listen for 
  // any new changes to the database
  database.once("value")

    // The snapshot contains all the data from the database, which
    //can be divided into children snapshots for each train
    .then(function (snapshot) {

      snapshot.forEach(function(childSnapshot) {
        // Every train has a unique key associated with it
        var key = childSnapshot.key;

        // childData will be the actual contents of the child
        var trainName = childSnapshot.child("name").val();
        var destination = childSnapshot.child("destination").val();

        // The time of the train's first departure for that day 
        var first = childSnapshot.child("first").val();

        // How often the train appears at the station
        var frequency = childSnapshot.child("frequency").val();

        console.log(key);
        console.log(trainName);
        console.log(destination);
        console.log(firstFormatted);
        console.log(frequency);

        // moment.js is an npm package that neatly formats time displays
        var firstFormatted = moment(first, 'h:mm a');
        var timeDifference = moment().diff(moment(firstFormatted), "minutes");
        var remainder = timeDifference % frequency;
        var minutesAway = frequency - remainder;

        // The associated train's next time of arrival
        var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

        // Create a new HTML table row
        var tr = $("<tr>");

        // Create new HTML tables columns for the relevant data
        var trainNameTd = $("<td>").text(trainName);
        var destinationTd = $("<td>").text(destination);
        var frequencyTd = $("<td>").text(frequency);
        var nextArrivalTd = $("<td>").text(nextArrival);
        var minutesAwayTd = $("<td>").text(minutesAway);

        // Append the columns to the row
        tr.append(trainNameTd);
        tr.append(destinationTd);
        tr.append(frequencyTd);
        tr.append(nextArrivalTd);
        tr.append(minutesAwayTd);

        // Append the row to the table
        $("#trainInfo").append(tr);

      });
    });

  var currentTime = moment().format('h:mm a');
  $("#time").append(currentTime);
  $("#submitBtn").click(handleSubmitClick);
}

// This function adds a new train to the database when the 
// submit button is clicked.
function handleSubmitClick() {

  var trainName = $("#trainName").val();
  var destination = $("#destination").val();
  var first = $("#firstTrain").val();
  var frequency = $("#frequency").val();

  console.log(trainName);

  // Create a new unique key for the new train
  var code = Math.floor(Math.random() * 100000);
  var newKey = "train" + code;

  // Write the new train info to the database
  firebase.database().ref('/' + newKey).set({
    name: trainName,
    destination: destination,
    first: first,
    frequency: frequency
  });

  // Reset the info boxes 
  $("#trainName").empty();
  $("#destination").empty();
  $("#firstTrain").empty();
  $("#frequency").empty();

  // The table must be rendered again to include the new data
  renderTable();

}