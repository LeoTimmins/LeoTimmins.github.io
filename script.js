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

function toggle_view_specific_degree() {
    const state = document.getElementById("ef_view_specific_degree").checked;
    const atarScores = document.getElementsByClassName("degree_name");

    if (state) {
      // Show Degree
      for (let i = 0; i < atarScores.length; i++) {
        atarScores[i].style.display = "";
        }
    } else {
      // Hide Degree
      for (let i = 0; i < atarScores.length; i++) {
        atarScores[i].style.display = "none";
      }
    }
    console.log(state);
}

function toggle_view_leaderboard(close=false) {
  const state = document.getElementById("ef_view_leaderboard").checked;
  const atarScores = document.getElementsByClassName("leaderboard-container");
  if (close) {
    document.getElementById("ef_view_leaderboard").checked = "";
  }
  if (state & close==false) {
    // Show Leaderboard
    for (let i = 0; i < atarScores.length; i++) {
      atarScores[i].style.display = "";
      }
  } else {
    // Hide Leaderboard
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
    document.getElementById("ef_view_specific_degree").checked = false
    document.getElementById("ef_view_leaderboard").checked = false
}

toggle_view_degrees()
toggle_view_predicted()
toggle_view_specific_degree()
toggle_view_leaderboard()


document.addEventListener('DOMContentLoaded', function () {
  // Get the list of all students and their ATAR scores
  const students = Array.from(document.querySelectorAll('.student'));
  const leaderboard = document.getElementById('leaderboard-student-list');

  totalStudentsUnflitered = students.length;


  // Create an array of student objects with name and ATAR
  const studentData = students.map(student => {
    const name = student.childNodes[0].nodeValue.trim();
    const atarElement = student.querySelector('.atar_score');
    const atar = atarElement ? parseFloat(atarElement.textContent.trim()) : null;
    return { name, atar };
  });

  // Filter out students without ATAR scores and sort the array by ATAR in ascending order
  const sortedStudents = studentData
    .filter(student => student.atar !== null)
    .sort((a, b) => b.atar - a.atar);

  // Clear the existing leaderboard list
  leaderboard.innerHTML = '';

  // Variables for Stats
  let totalStudents = sortedStudents.length;
  let totalAbove95 = 0;
  let totalBelow80 = 0;
  let totalAtar = 0.0;

  // Populate the leaderboard with sorted students
  sortedStudents.forEach((student, index) => {
    totalAtar += student.atar;
    if (student.atar >= 95){totalAbove95++}
    if (student.atar < 80){totalBelow80++}
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span class="rank">${index + 1}.</span>
      <span class="name">${student.name}</span>
      <span class="atar">${student.atar.toFixed(2)}</span>
    `;
    leaderboard.appendChild(listItem);
  });

  // Calculate and populate stats
  const statAverage = totalAtar / totalStudents;
  const roundedAverage = roundToNearest05(statAverage);
  document.getElementById("stat-mean").innerHTML = roundedAverage.toFixed(2);
  document.getElementById("stat-above95").innerHTML = totalAbove95;
  document.getElementById("stat-below80").innerHTML = totalBelow80;
  document.getElementById("stat-reported").innerHTML = totalStudents + "/" + totalStudentsUnflitered;

  // Calculate Quartiles
  function calculateQuartile(data, percentile) {
    const index = (percentile / 100) * (data.length + 1);
    if (index % 1 === 0) {
      return data[index - 1];
    } else {
      const lowerIndex = Math.floor(index) - 1;
      const upperIndex = Math.ceil(index) - 1;
      return (data[lowerIndex] + data[upperIndex]) / 2;
    }
  }

  const q1 = calculateQuartile(sortedStudents.map(student => student.atar), 75);
  const q3 = calculateQuartile(sortedStudents.map(student => student.atar), 25);
  const iqr = q3 - q1;
  const roundedIqr = roundToNearest05(iqr);
  document.getElementById("stat-iqr").innerHTML = roundedIqr.toFixed(2);

  // Calculate standard deviation
  const mean = roundedAverage;
  const variance = sortedStudents.map(student => Math.pow(student.atar - mean, 2))
                                 .reduce((acc, val) => acc + val, 0) / totalStudents;
  const stdDev = Math.sqrt(variance);
  const roundedStdDev = roundToNearest05(stdDev);
  document.getElementById("stat-std").innerHTML = roundedStdDev.toFixed(2);

  console.log("STAT MEAN - TOTAL ATAR: " + totalAtar + " - TOTAL STUDENTS: " + totalStudents + " - AVG: " + roundedAverage);
  console.log("STAT IQR - Q1: " + q1 + " - Q3: " + q3 + " - IQR: " + roundedIqr);
  console.log("STAT STD - VARIANCE: " + variance + " - STD DEV: " + roundedStdDev);

  // Function to round to nearest 0.05
  function roundToNearest05(value) {
    return Math.round(value / 0.05) * 0.05;
  }
});