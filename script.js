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