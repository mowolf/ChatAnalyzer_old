//Read File
function readSingleFile(e) {

  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();

  // execude on load of file
  reader.onload = function(e) {
    var contents = e.target.result;

    // get data in right format
    lineArray = createArray(contents);
    var structArray = createStructs(lineArray);
    // log data
    console.log(structArray);

    // display Contents
    displayContents(structArray);
  };
  reader.readAsText(file);
}

function displayContents(contents) {

  // Array with objects name, message, date, time

  // USERS
  // TODO: make carousell for groups
  // for two USERS
  for (var i = 0; i < 2; i++) {
    var messagesCount = "0";
    messagesCount = contents[i].message.length;
    console.log(messagesCount);

    var div = document.createElement('div');
    div.className = 'col-sm';

    div.innerHTML = "<h4>" + contents[i].name + "</h4>" +
                    "<p> Messages sent: <b>" + messagesCount + "</b></p>";
    // get user elemnent
    var users = document.getElementById('users').appendChild(div);
  }
}


// add file listener for chat file
document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);

// struct factory
// https://stackoverflow.com/questions/502366/structs-in-javascript
function makeStruct(names) {
  var names = names.split(' ');
  var count = names.length;
  function constructor() {
    for (var i = 0; i < count; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}

// transform data into arrays of lines
function createArray(contents) {

  // Format for normal message:
  // [09.04.18, 10:19:36] Name: MESSAGE
  // announcments do not have a ":" and should be deleted

  // find index of all individual messsages
  lineArray = [];
  indexArray = [];
  delArray = [];

  for (var i = 0; i < contents.length; i++) {
    // search for [00.00.00, 00:00:00] and note index of "["
    testString = contents.substring(i, i+20 );

    if ( (testString.substring(0,1) == "[")  &&
         (!isNaN(testString.substring(1,3))) &&
         (!isNaN(testString.substring( testString.length - 3  , testString.length -1 )))  &&
         (testString.substring(testString.length - 1) == "]")
       ) {
         // save index
         indexArray.push(i);
       }
  }
  // split messsages


  for (var i = 0; i < indexArray.length; i++) {
    // fill array
    if (i == indexArray.length - 1) {
      lineArray[i] = contents.substring(indexArray[i],contents.length-1);
    } else {
      lineArray[i] = contents.substring(indexArray[i], indexArray[i+1]);
    }
  }

  // remove any lines without ":"
  // e.g. announcments when people get added to groups
  a = 0;
  for (var i = 0; i < lineArray.length; i++)  {
    if (lineArray[i].substring(20,lineArray[i].length).indexOf(":") < 0) {
      // no ":" found. Delete this line
      delArray[a] = i;
      a++;
    }
  }
  // log which lines to remove
  //console.log(delArray);
  for (var i = 0 ; i < a; i++) {
    lineArray.splice(delArray[i]-i,1)
  }

  return lineArray;
}

// transform lineArray into structs
function createStructs(lineArray) {

  var uniqueNames = findNames(lineArray);
  var structArray = [];

  //console.log(lineArray);

  for (i = 0; i < uniqueNames.length; i++) {

    var date = [];
    var time = [];
    var message = [];
    var name = uniqueNames[i];
    var nameLength = name.length;
    var a = 0;

    // log name that is processed
    //console.log(name);

    // splice messages
    for (j = 0; j < lineArray.length; j++) {
      if ( lineArray[j].substring(21, 21 + nameLength).match(name) ) {

        date[a] = lineArray[j].substring(1,9);
        time[a] = lineArray[j].substring(11, 19);
        message[a] = lineArray[j].substring(21 + uniqueNames[i].length);
        a++;
      }
    }
    //console.log(message);
    // save data to struct
    var Item = makeStruct("name date time message");
    var user = new Item(name, date, time, message);
    structArray.push(user);
  }
  // log users

  // return
  return structArray;
}

// find names of the people
function findNames(lineArray) {
  names = [];
  messages = [];
  firstIndex = 21;
  group = false;

  for (var i = 0; i< lineArray.length; i++){
    // second occurence of ":" marks end of NAME
    var secondIndex = lineArray[i].substring(21, lineArray[i].length - 1).indexOf(": ") + 21;

    // log
    //console.log( lineArray[i].substring(21, lineArray[i].length - 1) );
    //console.log( secondIndex );

    names[i] = lineArray[i].substring(firstIndex,secondIndex);
  }

  var uniqueNames = [];
  $.each(names, function(i, el){
    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
  });

  // check if its a group
  //if uniqueNames.length > 3 {
  //  group = true;
  //}

  //console.log(uniqueNames);
  return uniqueNames;
}

// ----- ---- ---- PERSONAL STATS
// count messages per person

// determine most active day(s)

// count words per person

// most used words per person

// most used emoji per person

// activity by time

// activity by day of week

// ---- ---- ---- TOTAL STATS

// average words per message

// average messages per day
