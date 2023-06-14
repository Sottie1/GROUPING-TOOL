function groupNames() {
    var namesInput = document.getElementById("nameInput").value;
    var names = namesInput.split(",");
    var groupSize = parseInt(document.getElementById("groupSizeInput").value);

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

  function displayGroups(groups) {
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    for (var i = 0; i < groups.length; i++) {
      var groupDiv = document.createElement("div");
      groupDiv.className = "card";

      var groupHeading = document.createElement("h3");
      groupHeading.textContent = "Group " + (i + 1);
      groupDiv.appendChild(groupHeading);

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

  function exportPDF() {
    var groups = getGroupsArray();

    var doc = new jsPDF();
    var y = 10;

    for (var i = 0; i < groups.length; i++) {
      doc.setFontSize(16);
      doc.setTextColor("#663de4");
      doc.text("Group " + (i + 1), 10, y);

      y += 10;

      doc.setFontSize(12);
      doc.setTextColor("#001019");

      for (var j = 0; j < groups[i].length; j++) {
        doc.text(groups[i][j], 10, y);
        y += 10;
      }

      y += 10;
    }

    doc.save("groups.pdf");
  }

function exportWord() {
  var groups = groupNamesHelper(names, groupSize);
  var content = generateGroupContent(groups);
  var filename = "groups.docx";

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://1drv.ms/w/s!AoA4ig7H7EN3gVTiiYgsEzRh_7Au?e=g0SrOy", true);
  xhr.responseType = "arraybuffer";

  xhr.onload = function () {
    if (xhr.status === 200) {
      var data = new Uint8Array(xhr.response);
      var doc = new window.docxtemplater().loadZip(new JSZip(data));

      doc.setData({
        groups: content
      });

      try {
        doc.render();
      } catch (error) {
        console.log(error);
        return;
      }

      var out = doc.getZip().generate({
        type: "blob"
      });

      saveAs(out, filename);
    }
  };

  xhr.send();
}

function generateGroupContent(groups) {
  var content = [];

  for (var i = 0; i < groups.length; i++) {
    var group = {
      number: i + 1,
      names: groups[i]
    };

    content.push(group);
  }

  return content;
}
