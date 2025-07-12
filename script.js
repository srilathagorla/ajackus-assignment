
// Employee list (loaded from mockData.js)
let employees = [];

// Pagination variables
const perPageSelect = document.getElementById("perPage");
let currentPage = 1;
let perPage = parseInt(perPageSelect.value);

// When the window loads, initialize employees and render
window.onload = function () {
  employees = [...mockEmployees]; // Load 50 dummy employees
  renderEmployees(employees);     // Display them in the UI
};

// Render employee cards to the grid
function renderEmployees(list) {
  const container = document.getElementById("employeeList");
  container.innerHTML = "";

  // Paginate the list
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const paginated = list.slice(start, end);

  // Create and append each employee card
  paginated.forEach((emp) => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.innerHTML = `
      <h4>${emp.firstName} ${emp.lastName}</h4>
      <p><strong>Email:</strong> ${emp.email}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Role:</strong> ${emp.role}</p>
      <button onclick="editEmployee(${emp.id})">Edit</button>
      <button onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    container.appendChild(card);
  });
}

// Search employees by name or email
function applySearch() {
  const term = document.getElementById("search").value.toLowerCase();
  const filtered = employees.filter(
    (e) =>
      e.firstName.toLowerCase().includes(term) ||
      e.lastName.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term)
  );
  renderEmployees(filtered);
}

// Apply filters: first name, department, role
function applyFilters() {
  const name = document.getElementById("filterFirstName").value.toLowerCase();
  const dept = document.getElementById("filterDepartment").value.toLowerCase();
  const role = document.getElementById("filterRole").value.toLowerCase();

  const filtered = employees.filter((e) =>
    (name ? e.firstName.toLowerCase().includes(name) : true) &&
    (dept ? e.department.toLowerCase().includes(dept) : true) &&
    (role ? e.role.toLowerCase().includes(role) : true)
  );

  renderEmployees(filtered);
}

// Reset filter inputs and re-render all employees
function resetFilters() {
  document.getElementById("filterFirstName").value = "";
  document.getElementById("filterDepartment").value = "";
  document.getElementById("filterRole").value = "";
  renderEmployees(employees);
}

// Sort employees by selected field (First Name or Department)
function sortEmployees() {
  const sortBy = document.getElementById("sort").value;
  const sorted = [...employees].sort((a, b) =>
    a[sortBy].localeCompare(b[sortBy])
  );
  renderEmployees(sorted);
}

// Update how many employees are shown per page
function updatePagination() {
  perPage = parseInt(perPageSelect.value);
  currentPage = 1;
  renderEmployees(employees);
}

// Show the Add/Edit employee form popup
function openForm() {
  document.getElementById("formPopup").style.display = "flex";
  document.getElementById("employeeForm").reset();
  document.getElementById("empId").value = "";
  document.getElementById("formTitle").textContent = "Add Employee";
}

// Hide the Add/Edit form popup
function closeForm() {
  document.getElementById("formPopup").style.display = "none";
}

// Save the employee from form data (add or edit)
function saveEmployee(event) {
  event.preventDefault();

  // Extract form data
  const id = document.getElementById("empId").value;
  const newEmp = {
    id: id ? parseInt(id) : Date.now(), // Unique ID for new employee
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    department: document.getElementById("department").value,
    role: document.getElementById("role").value.trim(),
  };

  // Email validation
  if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(newEmp.email)) {
    alert("Invalid email format.");
    return;
  }

  // Update existing employee or add new one
  if (id) {
    const index = employees.findIndex((e) => e.id === parseInt(id));
    employees[index] = newEmp;
  } else {
    employees.push(newEmp);
  }

  closeForm();
  renderEmployees(employees);
}

// Pre-fill the form and open it for editing an employee
function editEmployee(id) {
  const emp = employees.find((e) => e.id === id);
  document.getElementById("empId").value = emp.id;
  document.getElementById("firstName").value = emp.firstName;
  document.getElementById("lastName").value = emp.lastName;
  document.getElementById("email").value = emp.email;
  document.getElementById("department").value = emp.department;
  document.getElementById("role").value = emp.role;
  document.getElementById("formTitle").textContent = "Edit Employee";
  openForm();
}

// Delete an employee with confirmation
function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees = employees.filter((e) => e.id !== id);
    renderEmployees(employees);
  }
}