
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

function renderTable() {

  $("#trainInfo").empty();
  $("#time").empty();

  // Get a reference to the database service
  var database = firebase.database().ref();

  // Enable logging across page refreshes
  firebase.database.enableLogging(true, true);

  database.once("value")
    .then(function (snapshot) {

      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        // childData will be the actual contents of the child
        var trainName = childSnapshot.child("name").val();
        var destination = childSnapshot.child("destination").val();
        var first = childSnapshot.child("first").val();
        var frequency = childSnapshot.child("frequency").val();

        console.log(key);
        console.log(trainName);
        console.log(destination);
        console.log(firstFormatted);
        console.log(frequency);

        var firstFormatted = moment(first, 'h:mm a');
        var timeDifference = moment().diff(moment(firstFormatted), "minutes");
        var remainder = timeDifference % frequency;

        var minutesAway = frequency - remainder;
        var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

        var tr = $("<tr>");

        var trainNameTd = $("<td>").text(trainName);
        var destinationTd = $("<td>").text(destination);
        var frequencyTd = $("<td>").text(frequency);
        var nextArrivalTd = $("<td>").text(nextArrival);
        var minutesAwayTd = $("<td>").text(minutesAway);

        tr.append(trainNameTd);
        tr.append(destinationTd);
        tr.append(frequencyTd);
        tr.append(nextArrivalTd);
        tr.append(minutesAwayTd);

        $("#trainInfo").append(tr);

      });
    });

  var currentTime = moment().format('h:mm a');
  $("#time").append(currentTime);
  $("#submitBtn").click(handleSubmitClick);
}

function handleSubmitClick() {

  var trainName = $("#trainName").val();
  var destination = $("#destination").val();
  var first = $("#firstTrain").val();
  var frequency = $("#frequency").val();

  console.log(trainName);

  var code = Math.floor(Math.random() * 100000);
  var newKey = "train" + code;

  firebase.database().ref('/' + newKey).set({
    name: trainName,
    destination: destination,
    first: first,
    frequency: frequency
  });

  $("#trainName").empty();
  $("#destination").empty();
  $("#firstTrain").empty();
  $("#frequency").empty();

  renderTable();

}