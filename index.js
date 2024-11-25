function groupNames() {
  const namesInput = document.getElementById("nameInput").value;
  const groupSizeInput = document.getElementById("groupSizeInput").value;
  const groupDescription = document.getElementById("groupDescriptionInput").value.trim();
  let groupSize = parseInt(groupSizeInput);

  if (!groupSize || groupSize <= 0) {
    showModal("Please enter a valid number for group size.");
    return;
  }

  const names = namesInput
    .split("\n")
    .map(name => name.trim())
    .filter(Boolean);

  if (names.length === 0) {
    showModal("Please provide a list of names.");
    return;
  }

  if (!groupDescription) {
    showModal("Please enter a description for the groups.");
    return;
  }

  const groups = createGroups(names, groupSize);
  displayGroups(groups, groupDescription);
}



function createGroups(names, groupSize) {
  shuffleArray(names);

  const groups = [];
  const numGroups = Math.ceil(names.length / groupSize);

  for (let i = 0; i < numGroups; i++) {
    const startIdx = i * groupSize;
    const group = names.slice(startIdx, startIdx + groupSize);

    if (group.length > 0) { // Prevent adding empty groups
      groups.push(group);
    }
  }

  return balanceGroups(groups);
}

function balanceGroups(groups) {
  if (groups.length <= 1) return groups;

  const lastGroup = groups[groups.length - 1];
  const secondLastGroup = groups[groups.length - 2];

  if (lastGroup.length < Math.ceil(groups[0].length / 2)) {
    secondLastGroup.push(...lastGroup);
    groups.pop();
  }

  return groups;
}

function shuffleArray(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

function displayGroups(groups, groupDescription) {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = ""; // Clear previous output

  // Add a main title for all groups
  const mainTitle = document.createElement("h2");
  mainTitle.textContent = groupDescription; // Big title for all groups
  mainTitle.className = "main-title"; // Optional: Add a CSS class for styling
  outputDiv.appendChild(mainTitle);

  // Display each group
  groups.forEach((group, index) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "card";

    const groupHeading = document.createElement("h3");
    groupHeading.textContent = `Group ${index + 1}`; // Individual group titles
    groupDiv.appendChild(groupHeading);

    const groupList = document.createElement("ul");
    group.forEach(name => {
      const nameItem = document.createElement("li");
      nameItem.textContent = name;
      groupList.appendChild(nameItem);
    });

    groupDiv.appendChild(groupList);
    outputDiv.appendChild(groupDiv);
  });
}

function searchName() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const namesInput = document.getElementById("nameInput");
  const names = namesInput.value.split("\n").map(name => name.trim());

  if (!searchInput) {
    showModal("Please enter a name to search.");
    return;
  }

  let found = false;
  let start = 0;

  // Loop through names to find the match and calculate position
  for (let i = 0; i < names.length; i++) {
    const currentName = names[i].toLowerCase();
    if (currentName.includes(searchInput)) {
      found = true;

      // Calculate start and end indices for highlighting
      const end = start + names[i].length;

      // Set focus and highlight the matched name
      namesInput.focus();
      namesInput.setSelectionRange(start, end);

      // Break after the first match
      break;
    }

    // Update the starting index to the next name
    start += names[i].length + 1; // +1 accounts for the newline character
  }

  if (!found) {
    showModal("Name not found in the list.");
  }
}


function printGroups() {
  const outputDiv = document.getElementById("output");
  const printContent = outputDiv.innerHTML;

  // Open a new window for printing
  const printWindow = window.open('', '_blank');
  printWindow.document.open();

  // Add centered styling to the printed content
  printWindow.document.write(`
    <html>
      <head>
        <title>Groups</title>
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
          }
          .main-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .card {
            display: inline-block;
            text-align: left;
            margin: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            width: 300px;
          }
          ul {
            padding-left: 20px;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

// Function to show modal with a message
function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  const modalClose = document.getElementById("modalClose");

  modalMessage.textContent = message;
  modal.style.display = "block";

  modalClose.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}
