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
        document.getElementById("dev_info").style.display = ""
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

function toggle_view_degrees() {
    const state = document.getElementById("ef_view_degree").checked;
    const studentList = document.getElementById("university-list");
  
    if (state) {
      // Show degrees
      document.getElementById("degree_feature_key").style.display = "";
      studentList.classList.remove("force_white_student"); // Remove white-text class from student list
    } else {
      // Hide degrees
      document.getElementById("degree_feature_key").style.display = "none";
      studentList.classList.add("force_white_student"); // Add white-text class to student list
    }
    console.log(state);
  }

function toggle_view_predicted() {
    const state = document.getElementById("ef_view_predicted").checked;
    const atarScores = document.getElementsByClassName("atar_score");

    if (state) {
      // Show Predicteds
      for (let i = 0; i < atarScores.length; i++) {
        atarScores[i].style.display = "";
        }
    } else {
      // Hide Predicteds
      for (let i = 0; i < atarScores.length; i++) {
        atarScores[i].style.display = "none";
      }
    }
    console.log(state);
}


// onload shit

if (window.innerWidth < 1000) {
    document.getElementById("experimental_features").style.display = "none"
    document.getElementById("ef_view_predicted").checked = false
    document.getElementById("ef_view_degree").checked = false
}

toggle_view_degrees()
toggle_view_predicted()