// Function to fetch CSV and populate universities
function populateUniversities() {
  return fetch('/data/students.csv')
    .then(response => response.text())
    .then(data => {
      // Parse CSV data
      const rows = data.split('\n').slice(1); // Remove header row
      rows.forEach(row => {
        const [name, university, area, degree, atar] = row.split(',');
        if (name && university) {
          addStudentToUniversity(name.trim(), university.trim(), area.trim(), degree.trim(), atar.trim());
        }
      });
      // Call atar_stats_generate after populating universities
      atar_stats_generate();
      // Hide ATAR scores on load
      toggle_view_predicted();
    })
    .catch(error => console.error('Error fetching CSV:', error));
}

function close_se_box () {
  cont = document.getElementById("se_container")
  cont.style.display = "none"
}

function show_se_box () {
  cont = document.getElementById("se_container")
  cont.style.display = "flex"
}

// Function to add a student to the appropriate university list
function addStudentToUniversity(name, university, area, degree, atar) {
  const universityMap = {
    'UWA': 'uni_uwa',
    'Curtin': 'uni_curtin',
    'Murdoch': 'uni_murdoch',
    'ECU': 'uni_ecu',
    'Notre Dame': 'uni_notre_dame',
    'Out of State': 'uni_out_of_state',
    'Not Going': 'uni_not_going'
  };

  const uniId = universityMap[university] || 'uni_unsure';
  const uniList = document.querySelector(`#${uniId} ul`);

  if (uniList) {
    const li = document.createElement('li');
    li.className = 'student';
    if (area) li.id = area;

    li.textContent = name;

    if (atar) {
      const atarSpan = document.createElement('a');
      atarSpan.className = 'atar_score';
      atarSpan.textContent = atar;
      li.appendChild(atarSpan);
    }

    if (degree) {
      const degreeSpan = document.createElement('a');
      degreeSpan.className = 'degree_name';
      degreeSpan.textContent = degree;
      li.appendChild(degreeSpan);
    }

    uniList.appendChild(li);
  }
}

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
  if (state && close==false) {
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

function atar_stats_generate() {
  // Get the list of all students and their ATAR scores
  const students = Array.from(document.querySelectorAll('.student'));
  const leaderboard = document.getElementById('leaderboard-student-list');

  const totalStudentsUnflitered = students.length;

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
    if (student.atar >= 95) totalAbove95++;
    if (student.atar < 80) totalBelow80++;
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
}

// Function to create the ATAR chart
function createATARChart() {
  // Function to get ATAR scores from the DOM
  const getATARScores = () => {
    const atarElements = document.querySelectorAll('.atar_score');
    return Array.from(atarElements).map(el => parseFloat(el.textContent));
  };

  // Function to create histogram data
  const createHistogramData = (scores) => {
    const bins = Array.from({length: 16}, (_, i) => ({
      range: (70 + i * 2).toString(),
      count: 0
    }));

    scores.forEach(score => {
      const binIndex = Math.min(Math.floor((score - 70) / 2), 14);
      if (binIndex >= 0) bins[binIndex].count++;
    });

    return bins;
  };

  // Function to get the mean ATAR score from the DOM
  const getMeanATAR = () => {
    const meanElement = document.getElementById('stat-mean');
    if (!meanElement) {
      console.error('Element with id "stat-mean" not found');
      return null;
    }
    const meanValue = parseFloat(meanElement.textContent);
    console.log('Mean ATAR value:', meanValue);
    return meanValue;
  };

  const scores = getATARScores();
  const histogramData = createHistogramData(scores);
  const meanATAR = getMeanATAR();

  if (meanATAR === null) {
    console.error('Unable to get mean ATAR score');
    return;
  }

  const ctx = document.getElementById('atarChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: histogramData.map(bin => bin.range),
      datasets: [{
        label: 'Number of Students',
        data: histogramData.map(bin => bin.count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Students'
          }
        },
        x: {
          title: {
            display: true,
            text: 'ATAR Score'
          },
          min: '70',
          max: '100'
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'ATAR Score Distribution'
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              scaleID: 'x',
              value: meanATAR.toString(),
              borderColor: 'rgb(255, 0, 0)',
              borderWidth: 3,
              label: {
                content: `Mean: ${meanATAR.toFixed(2)}`,
                enabled: true,
                position: 'top',
                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                color: 'white',
                font: {
                  weight: 'bold'
                }
              }
            }
          }
        }
      }
    }
  });

  console.log('Chart created with mean line at:', meanATAR);
}

// Modify the onload section
document.addEventListener('DOMContentLoaded', function() {
  populateUniversities()
    .then(() => {
      if (window.innerWidth < 1000) {
        document.getElementById("experimental_features").style.display = "none";
        document.getElementById("ef_view_predicted").checked = false;
        document.getElementById("ef_view_degree").checked = false;
        document.getElementById("ef_view_specific_degree").checked = false;
        document.getElementById("ef_view_leaderboard").checked = false;
        document.getElementById("se_container").style.display = "none";
        document.getElementById("se_list").style.display = "none";
      }

      toggle_view_degrees();
      toggle_view_predicted();
      toggle_view_specific_degree();
      toggle_view_leaderboard();

      // Call the function to create the chart
      createATARChart();
    })
    .catch(error => console.error('Error in initialization:', error));
});

