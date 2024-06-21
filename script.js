const searchBar = document.getElementById("search-bar");
    const studentList = document.getElementById("university-list").getElementsByTagName("li");

    searchBar.addEventListener("keyup", function() {
      const searchTerm = searchBar.value.toLowerCase();
      for (let i = 0; i < studentList.length; i++) {
        const studentText = studentList[i].textContent.toLowerCase();
        if (studentText.indexOf(searchTerm) !== -1) {
          studentList[i].style.display = "block";
        } else {
          studentList[i].style.display = "none";
        }
      }
    });

    let currentFilter = ""; // Store the currently applied filter

function filterStudents(faculty) {
  const studentList = document.getElementById("university-list");
  const students = studentList.querySelectorAll("li li"); // Get all student list items

  // Reset filter if clicking the same button again or no faculty provided
  if (!faculty || faculty === currentFilter) {
    currentFilter = "";
    students.forEach(student => student.style.display = ""); // Show all students
    document.querySelector(`.key li[onclick*="${faculty}"]`).style.backgroundColor = ""; // Reset button color
    return;
  }

  currentFilter = faculty;

  // Set clicked button color (red) and reset others (white)
  document.querySelectorAll(".key li").forEach(button => button.style.backgroundColor = button === document.querySelector(`.key li[onclick*="${faculty}"]`) ? "rgb(211, 210, 210)" : "");

  // Empty search bar
  document.getElementById("search-bar").value = "";

  students.forEach(student => {
    student.style.display = student.id.includes(faculty) ? "" : "none";
  });
}
