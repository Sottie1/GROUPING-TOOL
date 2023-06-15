function groupNames() {
  var namesInput = document.getElementById("nameInput").value;
  var groupSizeInput = document.getElementById("groupSizeInput").value;
  var groupSize = parseInt(groupSizeInput);

  if (!groupSize || groupSize <= 0) {
    groupSize = prompt("Please enter the desired number of people per group:");
    if (!groupSize || groupSize <= 0) {
      alert("Invalid group size. Please enter a positive number.");
      return;
    }
  }

  var names = namesInput.split(",");

  var groups = groupNamesHelper(names, groupSize);
  displayGroups(groups);
}


  function groupNamesHelper(names, groupSize) {
    shuffle(names);  // Randomize the order of names

    var numGroups = Math.ceil(names.length / groupSize); // Calculate the number of groups
    var groups = [];
    var startIdx = 0;

    for (var i = 0; i < numGroups; i++) {
      var endIdx = startIdx + groupSize;
      groups.push(names.slice(startIdx, endIdx));
      startIdx = endIdx;
    }

    return groups;
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function displayGroups(groups, groupDescription) {
  var outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  for (var i = 0; i < groups.length; i++) {
    var groupDiv = document.createElement("div");
    groupDiv.className = "card";

    var groupHeading = document.createElement("h3");
    groupHeading.textContent = "Group " + (i + 1);
    groupDiv.appendChild(groupHeading);

    var descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = groupDescription;
    descriptionParagraph.className = "group-description"; // Apply the new CSS class
    groupDiv.appendChild(descriptionParagraph);

    var groupList = document.createElement("ul");

    for (var j = 0; j < groups[i].length; j++) {
      var nameItem = document.createElement("li");
      nameItem.textContent = groups[i][j];
      groupList.appendChild(nameItem);
    }

    groupDiv.appendChild(groupList);
    outputDiv.appendChild(groupDiv);
  }
}

function searchName() {
  var searchInput = document.getElementById("searchInput").value.toLowerCase();
  var namesInput = document.getElementById("nameInput");
  var names = namesInput.value.toLowerCase().split(",");
  
  var found = false;
  var start = 0;
  var end = 0;
  
  for (var i = 0; i < names.length; i++) {
    if (names[i].trim().includes(searchInput)) {
      found = true;
      end = start + names[i].length;
      break;
    }
    start += names[i].length + 1;
  }
  
  if (found) {
    namesInput.focus();
    namesInput.setSelectionRange(start, end);
  }
}



function printGroups() {
  var outputDiv = document.getElementById("output");
  var printContent = outputDiv.innerHTML;
  var printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write('<html><head><title> Groups</title></head><body>');
  printWindow.document.write(printContent);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}
