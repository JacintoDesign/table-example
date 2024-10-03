const spinner = document.getElementById('spinner');
const table = document.getElementById('data-table');
const tableBody = document.getElementById('table-body');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumber = document.getElementById('page-number');

let data = [];
let sortedData = [];
let currentPage = 1;
const rowsPerPage = 10;
let sortDirection = {}; // To keep track of the sort direction for each column

// Fetch data from API
async function fetchData() {
  spinner.style.display = 'flex'; // Show spinner
  pagination.style.display = 'none';
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    const response = await fetch('https://randomuser.me/api/?results=50');
    const json = await response.json();
    data = json.results;
    sortedData = [...data]; // Initially, sortedData is just the fetched data
    displayTable(sortedData);
    updateButtons();
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    spinner.style.display = 'none'; // Hide spinner
    table.style.display = 'table';
    pagination.style.display = 'block';
  }
}

// Display table with pagination
function displayTable(dataToDisplay) {
  tableBody.innerText = ''; // Clear the previous rows
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = dataToDisplay.slice(start, end);

  paginatedItems.forEach(user => {
    const row = 
    `<tr>
      <td data-label="Name">${user.name.first} ${user.name.last}</td>
      <td data-label="Email">${user.email}</td>
      <td data-label="Username">${user.login.username}</td>
      <td data-label="Country">${user.location.country}</td>
    </tr>`;
    tableBody.insertAdjacentHTML('beforeend', row);
  });
}

// Sort table by column index
function sortTable(columnIndex) {
  // Clear all icons
  clearSortIcons();

  if (!sortDirection[columnIndex]) {
    sortDirection[columnIndex] = 'asc'; // Default to ascending on first click
  }

  sortedData = [...data].sort((a, b) => {
    let valA, valB;
    switch (columnIndex) {
      case 0:
        valA = `${a.name.first} ${a.name.last}`;
        valB = `${b.name.first} ${b.name.last}`;
        break;
      case 1:
        valA = a.email;
        valB = b.email;
        break;
      case 2:
        valA = a.login.username;
        valB = b.login.username;
        break;
      case 3:
        valA = a.location.country;
        valB = b.location.country;
        break;
    }

    // If the direction is descending, we reverse the comparison result
    if (sortDirection[columnIndex] === 'desc') {
      return valB.localeCompare(valA);
    } else {
      return valA.localeCompare(valB);
    }
  });

  // Toggle the sort direction for the next click
  sortDirection[columnIndex] = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';

  // Update the sort icon for the current column
  updateSortIcon(columnIndex, sortDirection[columnIndex]);

  // Display sorted data
  displayTable(sortedData);
}

// Clear sort icons from all columns
function clearSortIcons() {
  for (let i = 0; i < 4; i++) {
    const icon = document.getElementById(`icon-${i}`);
    icon.className = 'fas fa-sort';
  }
}

// Update the sort icon based on the column and direction
function updateSortIcon(columnIndex, direction) {
  const icon = document.getElementById(`icon-${columnIndex}`);
  icon.className = direction === 'asc' ? 'fas fa-sort-down' : 'fas fa-sort-up';
}

// Previous Page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayTable(sortedData);
    updateButtons();
  }
}

// Next Page
function nextPage() {
  if (currentPage * rowsPerPage < sortedData.length) {
    currentPage++;
    displayTable(sortedData);
    updateButtons();
  }
}

// Update pagination buttons
function updateButtons() {
  pageNumber.innerText = currentPage;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage * rowsPerPage >= sortedData.length;
}

// Startup
fetchData();

// Dark Mode Functionality -------------------------------- // 
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check if dark mode is preferred or was previously chosen
const isDarkMode = localStorage.getItem('dark-mode') === 'true';

// Set initial mode and update text
if (isDarkMode) {
  body.classList.add('dark-mode');
  themeToggle.innerText = 'Light Mode';
}

// Toggle dark mode and update the text accordingly
themeToggle.addEventListener('click', () => {
  body.style.trasition = 'background-color 0.3s, color 0.3s';
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    themeToggle.innerText = 'Dark Mode';
    localStorage.setItem('dark-mode', 'false');
  } else {
    body.classList.add('dark-mode');
    themeToggle.innerText = 'Light Mode';
    localStorage.setItem('dark-mode', 'true');
  }
});
