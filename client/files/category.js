window.onload = function () {
  const params = new URLSearchParams(window.location.search); // Get the URL parameters
  const category = params.get("category"); // Extract the category from the parameters

  const title = document.getElementById("page-title"); // Get the title element to display the category
  const container = document.getElementById("entriesContainer"); // Get the container element to display the entries

  if (!category) {
    // If no category is specified, display a default message
    title.textContent = "Unknown Category";
    container.innerHTML = "<p>No category specified.</p>"; // Display a message if no category is provided
    return;
  }

  title.textContent = `Vets for ${capitalize(category)}`; // Set the title to the specified category

  fetch("/entries") // Fetch all entries from the server
    .then((res) => {
      // Check if the response is ok
      if (!res.ok) throw new Error("Network error");
      return res.json();
    })
    .then((entries) => {
      // Filter entries by the specified category
      const filtered = entries.filter(
        (entry) => entry.category.toLowerCase() === category.toLowerCase()
      );

      if (filtered.length === 0) {
        container.innerHTML = "<p>No entries found for this category.</p>"; // If no entries are found, display a message
        return;
      }
      const list = document.createElement("ul"); // Create a new unordered list to display entries

      filtered.forEach((entry) => {
        /*extract lat and lng from the url*/
        const coordinates = extractCoordinates(entry.url);
        const linkToMap = coordinates
          ? `map.html?lat=${coordinates.lat}&lng=${
              coordinates.lng
            }&name=${encodeURIComponent(entry.name || entry.number)}`
          : entry.url;
        const li = document.createElement("li");
        li.innerHTML = `<strong> Name:</strong> ${
          entry.name || entry.number
        }<br>
                        <strong>Address:</strong>${
                          entry.address || "Not provided"
                        }<br>
                        <strong>Phone: </strong>${entry.number}<br>
                        <a href="${linkToMap}" target="_blank">View on Map</a>
                        <hr>
                    `;

        list.appendChild(li);
      });
      container.innerHTML = ""; // Clear previous content
      container.appendChild(list); // Append the list of entries
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML = "<p>Error loading entries.</p>";
    });
};
function capitalize(str) {
  // Capitalizes the first letter of a string and lowercases the rest
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function extractCoordinates(url) {
  // Extracts latitude and longitude from a URL
  const match = url.match(/mlat=([0-9.]+)&mlon=([0-9.]+)/); // Regular expression to match mlat and mlon parameters
  if (match) {
    return {
      lat: parseFloat(match[1]), // Convert latitude to float
      lng: parseFloat(match[2]),
    };
  }
  return null; // Return null if no coordinates found
}
