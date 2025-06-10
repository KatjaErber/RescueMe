// Function to add a new entry with AJAX
function addEntryWithAjax() {
  const messages = document.getElementById("messages");
  const nameInput = document.getElementById("nameInput");
  const addressInput = document.getElementById("addressInput");
  const categoryInput = document.getElementById("categoryInput");
  const numberInput = document.getElementById("numberInput");
  const urlInput = document.getElementById("urlInput");
  // Trim the input values to remove leading/trailing whitespace
  const categoryValue = categoryInput.value.trim();
  const nameValue = nameInput.value.trim();
  const addressValue = addressInput.value.trim();
  const numberValue = numberInput.value.trim();
  const urlValue = urlInput.value.trim();
  // Check if all required fields are filled
  if (nameValue && numberValue && categoryValue && urlValue) {
    const entry = {
      name: nameValue,
      address: addressValue,
      number: numberValue,
      category: categoryValue,
      url: urlValue,
    };
    // Clear the input fields after submission
    nameInput.value = "";
    addressInput.value = "";
    categoryInput.value = "";
    numberInput.value = "";
    urlInput.value = "";

    // Send the category name to the server using AJAX
    fetch("/add-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    }) // Send the entry data to the server
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }) // Handle the response from the server
      .then((data) => {
        messages.textContent = data.message;
        console.log("Entry added:", data);
        renderEntry(data.entry);
      })
      .catch((error) => {
        console.error("TError:", error);
        messages.textContent = "Error: " + error.message;
      });
  } else {
    // If any required field is empty, show an alert
    alert("Please fill in the required fields.");
  }
}
// Function to delete an entry with AJAX
function deleteEntryWithAjax(tr) {
  const entryId = tr.getAttribute("id");
  const messages = document.getElementById("messages");
  // Send a DELETE request to the server
  fetch(`/entries/${entryId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      messages.textContent = data.message;
      tr.remove(); // Remove the row from the table
    })
    .catch((error) => {
      console.error("Delete error", error);
      messages.textContent = "Error: " + error.message;
    });
}
// Function to edit an entry with AJAX
function editEntryWithAjax(
  tdId, // Pass the ID cell to identify the entry
  nameInput,
  addressInput,
  numberInput,
  categoryInput,
  urlInput
) {
  const messages = document.getElementById("messages"); // Get the messages element

  const entry = {
    // Create an entry object with the updated values
    ID: tdId.textContent.trim(),
    name: nameInput.value,
    address: addressInput.value,
    number: numberInput.value,
    category: categoryInput.value,
    url: urlInput.value,
  };

  fetch(`/entries`, {
    // Send a PUT request to update the entry
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  })
    .then((response) => {
      if (!response.ok) {
        // Check if the response is ok
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      messages.textContent = data.message;
      console.log("Entry updated:", data);
    })
    .catch((error) => {
      console.error("Update error:", error);
      messages.textContent = "Error: " + error.message;
    });
}

function renderEntry(entry) {
  // Function to render an entry in the table
  const tr = document.createElement("tr"); // Create a new table row
  tr.className = "bordered-cell"; // Add a class for styling
  tr.setAttribute("id", entry.ID); // Set the ID attribute for the row

  const tdID = document.createElement("td"); // Create a table cell for the ID
  tdID.textContent = entry.ID; // Set the text content to the entry ID
  tdID.className = "bordered-cell"; // Add a class for styling
  tr.appendChild(tdID); // Append the ID cell to the row

  const nameInput = document.createElement("input"); // Create an input field for the name
  nameInput.type = "text"; // Set the input type to text
  nameInput.value = entry.name; // Set the initial value to the entry name

  const tdName = document.createElement("td"); // Create a table cell for the name
  tdName.appendChild(nameInput); // Append the input field to the cell
  tdName.className = "bordered-cell"; // Add a class for styling
  tr.appendChild(tdName); // Append the name cell to the row

  const addressInput = document.createElement("input"); // Create an input field for the address
  addressInput.value = entry.address; // Set the initial value to the entry address

  const tdAddress = document.createElement("td"); // Create a table cell for the address
  tdAddress.appendChild(addressInput); // Append the input field to the cell
  tdAddress.className = "bordered-cell"; // Add a class for styling
  tr.appendChild(tdAddress); // Append the address cell to the row

  const numberInput = document.createElement("input"); // Create an input field for the number
  numberInput.type = "text"; // Set the input type to text
  numberInput.value = entry.number; // Set the initial value to the entry number

  const tdNumber = document.createElement("td"); // Create a table cell for the number
  tdNumber.appendChild(numberInput); // Append the input field to the cell
  tdNumber.className = "bordered-cell"; // Add a class for styling
  tr.appendChild(tdNumber); // Append the number cell to the row

  const categoryInput = document.createElement("input"); // Create an input field for the category
  categoryInput.type = "text"; // Set the input type to text
  categoryInput.value = entry.category; // Set the initial value to the entry category

  const tdCategory = document.createElement("td"); // Create a table cell for the category
  tdCategory.appendChild(categoryInput); // Append the input field to the cell
  tr.appendChild(tdCategory); // Append the category cell to the row

  const urlInput = document.createElement("input"); // Create an input field for the URL
  urlInput.type = "text"; // Set the input type to text
  urlInput.value = entry.url; // Set the initial value to the entry URL

  const tdUrl = document.createElement("td");
  tdUrl.appendChild(urlInput);
  tdUrl.className = "bordered-cell";
  tr.appendChild(tdUrl);

  const editButton = document.createElement("button"); // Create a button for editing the entry
  editButton.textContent = "Edit"; // Set the button text to "Edit"
  editButton.onclick = function () {
    // Define the onclick function for the button
    editEntryWithAjax(
      // Pass the necessary parameters to the edit function
      tdID, // Pass the ID cell
      nameInput,
      addressInput,
      numberInput,
      categoryInput,
      urlInput
    );
  };

  const tdEdit = document.createElement("td"); // Create a table cell for the edit button
  tdEdit.appendChild(editButton); // Append the button to the cell
  tdEdit.className = "bordered-cell"; // Add a class for styling
  tr.appendChild(tdEdit); // Append the edit cell to the row

  const deleteButton = document.createElement("button"); // Create a button for deleting the entry
  deleteButton.textContent = "Delete"; // Set the button text to "Delete"
  deleteButton.onclick = function () {
    // Define the onclick function for the delete button
    deleteEntryWithAjax(tr); // Call the delete function with the current row
    tr.remove(); // Remove the row from the table
  };

  const tdDelete = document.createElement("td"); // Create a table cell for the delete button
  tdDelete.appendChild(deleteButton);
  tdDelete.className = "bordered-cell";
  tr.appendChild(tdDelete);

  document.getElementById("entriesTable").appendChild(tr);
}

function fetchEntries() {
  // Function to fetch entries from the server
  const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object
  xhr.onload = function () {
    // Define the onload function to handle the response
    const bodyElement = document.querySelector("body"); // Get the body element
    if (xhr.status === 200) {
      const entries = JSON.parse(xhr.responseText);
      entries.forEach((entry) => {
        renderEntry(entry);
      });
    } else {
      bodyElement.append(
        "Daten konnten nicht geladen werden, Status " +
          xhr.status +
          " - " +
          xhr.statusText
      );
    }
  };
  xhr.open("GET", "/entries"); // Open a GET request to the /entries endpoint
  xhr.send(); // Send the request
}

// Function to check if the user is authenticated
function checkAuthentication() {
  const token = localStorage.getItem("token"); // Get the token from local storage
  if (!token) {
    // No token found, redirect to login
    window.location.href = "login.html";
  } else {
    // Token is valid, proceed to load entries
    fetchEntries(); // Call a function to load entries data
  }
}

function clearSession() {
  // Function to clear the session and redirect to login
  localStorage.removeItem("token"); // Remove the token from local storage
  window.location.href = "index.html"; // Redirect to the login page
}

// Fetch categories on page load
window.onload = checkAuthentication; // Call the function to check authentication when the page loads
