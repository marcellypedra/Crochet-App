    // Add Header Section with Dynamic Content
    const currentFile = window.location.pathname.split("/").pop();
    const pageContent = {
        "index.html": {
            title: "Welcome to Your Yarn.com!",
        },
         "Newproject.html": {
            title: "Your Yarn.com projects",
        },
        "Myproject.html": {
            title: "Your Yarn.com projects",
        }
    };

    const { title = ""} = pageContent[currentFile] || {};
document.addEventListener("DOMContentLoaded", function() { // # HEADER and FOOTER
    const currentFile = window.location.pathname.split("/").pop();
    const headerHTML = `
<div class="header">
    <div class="headercontainer">
        <div class="headercontent">
            <div class="headertext">
                <h3 id="header-title">${title}</h3>
            </div>  
    </div>
        <div class="logocontainer">  
        <a href="#" onclick="openPage('index')"><img src="img/logo.jpeg" alt="MyYarn" class="logo" id="logo" style="height: 50px; width: 160px;"></a>
        </div>
        <nav class="headermenu">
            <ul class=navlist> 
            <li class="navitem"><a class="nav-link" href="index.html">Home</a></li>
             ${
                  currentFile !== "index.html"
                    ? `
                        <li class="navitem"><a class="nav-link" href="Newproject.html">Create New Project</a></li>
                        <li class="navitem"><a class="nav-link" href="Myproject.html">My Projects</a></li>
                      `
                    : ""
                }
            </ul>
        </nav>
    </div>
</div>

<link rel="stylesheet" href="style.css">
`;
    const footerHTML = `
        <section class="footer">
            <div>
                <p>&copy; ${new Date().getFullYear()} My Website. All rights reserved.</p>
            </div>
            <div>
                <p>Marcelly Pedra</p> 
                <a href="mailto:20040674@mydbs.ie" target="_blank">20040674@mydbs.ie</a>
            </div>
        </section>`;
        
    
    // Insert content
    const headerContainer = document.getElementById("showHeader");
    if (headerContainer) headerContainer.innerHTML = headerHTML;

    const footerContainer = document.getElementById("showFooter");
    if (footerContainer) footerContainer.innerHTML = footerHTML;

     // Load dropdown and display projects only when necessary
    if (document.getElementById("supplies")) {
        loadDropdownFromJSON();
    }
    
    if(document.getElementById("ongoingProjects") || document.getElementById("closedProjects")) {
        displayProjects();
    }
     
});

//Navigate to a page
function openPage(pageName) {
    window.location.href = pageName;
}


// Fetch data from the JSON file and populate the dropdown
async function loadDropdownFromJSON() {
    try {
        // Fetch the JSON file
        const response = await fetch("yarn.json");
        const data = await response.json();
        const dropdown = document.getElementById("supplies");

        dropdown.innerHTML = '<option value="">Select a material</option>';

        // Loop through the JSON data and create options
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name; // Use 'value' for datalist
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading JSON data:", error);
    }
}

async function displayProjects() {
    const ongoingContainer = document.getElementById("ongoingProjects");
    const closedContainer = document.getElementById("closedProjects");
     
    try {
        const response = await fetch("/api/projects");
        const{ ongoingProjects, closedProjects } = await response.json();
    
          // Clear existing content
        if (ongoingContainer) ongoingContainer.innerHTML = "";
        if (closedContainer) closedContainer.innerHTML = "";

        // Populate ongoing projects
        ongoingProjects.forEach((project) => {
            const projectLink = document.createElement("a");
            projectLink.textContent = project.name;
            projectLink.href = "#";
            projectLink.className = "project-link";
            projectLink.dataset.id = project.id; //store project ID data in a dataset for later use
            projectLink.onclick = () => openModal(project, "ongoing");
            ongoingContainer.appendChild(projectLink);
        });

         // Populate closed projects
        closedProjects.forEach((project, index) => {
            const projectLink = document.createElement("a");
            projectLink.textContent = project.name;
            projectLink.href = "#";
            projectLink.className = "project-link";
            projectLink.dataset.id = project.id; //store project ID data in a dataset for later use
            projectLink.onclick = () => openModal(project, "closed");
            closedContainer.appendChild(projectLink);
        });
    } catch (error) {
        console.error("Error fetching projects:", error)
    }
}

async function addtoProjectList() {
    const projectName = document.getElementById("pname").value.trim();
    const projectDescription = document.getElementById("descr").value.trim();
    const projectUrl = document.getElementById("urlpattern").value.trim();
    const project_type = "ongoing" // default
    const materials = Array.from(document.querySelectorAll("#selectedMaterialList li"))
        .map((li) => li.firstChild.textContent.trim())
        .filter((material) => material !== "");

    if (!projectName) {
        alert("Please enter a project name.");
        return;
    }

    const project = { name: projectName, description: projectDescription, url: projectUrl, project_type, materials };

    try {
        const response = await fetch("/api/projects", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(project),
        });
   
        if (response.ok) {
            // Redirect to My Projects page
            window.location.href = "Myproject.html";
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error("Error saving project:", error);
    }
}

// Function to add selected items to a separate list
function addtoSelectMaterial() {
    const input = document.getElementById("supplies");
    const selectedList = document.getElementById("selectedMaterialList");

    // Add the selected value to the list if it's not already added
    if (input.value && !Array.from(selectedList.children).some(li => li.textContent === input.value)) {
        const listItem = document.createElement("li");
        listItem.textContent = input.value;
        selectedList.appendChild(listItem);

        //Create a delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete";
        deleteButton.style.marginLeft = "10px";
        deleteButton.onclick = function () {
            selectedList.removeChild(listItem);
        };

        //Add the delete button to te list item
        listItem.appendChild(deleteButton);

        // Clear the input field after adding
        input.value = "";

    }
}




    
    
    

   


    






        











