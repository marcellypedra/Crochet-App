    // Add Header Section with Dynamic Content
    const currentFile = window.location.pathname.split("/").pop();
    const pageContent = {
        "index.html": {
            title: "Welcome to Your Yarn.com!",
        },
        "user.html": {
            title: "Your Yarn.com"
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
            <li class="navitem"><a class="nav-link" href="Newproject.html">Create New Project</a></li>
            <li class="navitem"><a class="nav-link" href="Myproject.html">My Projects</a></li>
            </ul>
        </nav>
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

// Call the function to load the dropdown on page load
document.addEventListener("DOMContentLoaded", loadDropdownFromJSON);

// Function to add selected items to a separate list
function addtoSelectMaterial() {
    const input = document.getElementById("material");
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

// Create and save the project
async function addtoProjectList() {
    const projectName = document.getElementById("pname").value.trim();
    const projectDescription = document.getElementById("descr").value.trim();
    const projectUrlPattern = document.getElementById("urlpattern").value.trim();

    const materials = Array.from(document.querySelectorAll("#selectedMaterialList li"))
    .map(li => {
        const mainTextNode = li.firstChild; // Get the first text node
        return mainTextNode ? mainTextNode.textContent.trim() : "";
    })
    .filter(material => material !== ""); // Ensure no empty entries

    if (!projectName) {
        alert("Please enter a project name.");
        return;
    }

    const project = {
        name: projectName,
        description: projectDescription,
        url: projectUrlPattern,
        materials: materials
    };
// Retrieve existing projects or initialize empty array
    const savedProjects = JSON.parse(localStorage.getItem("ongoingProjects")) || [];

// Add the new project
    savedProjects.push(project);

// Save updated list back to localStorage
    localStorage.setItem("ongoingProjects", JSON.stringify(savedProjects));

    console.log("Saved Projects:", savedProjects);

    window.location.href = "Myproject.html";

}

// Load and display the ongoing projects
document.addEventListener("DOMContentLoaded", () => {
    const ongoingProjectsContainer = document.getElementById("ongoingProjects");
    const modal = document.getElementById("projectModal");
    const closeModalButton = modal.querySelector(".close-button");

    const modalProjectName = document.getElementById("modalProjectName");
    const modalProjectDescription = document.getElementById("modalProjectDescription");
    const modalProjectUrlInput = document.getElementById("modalProjectUrlInput");
    const modalProjectMaterials = document.getElementById("modalProjectMaterials");
    const materialDropdown = document.getElementById("materialDropdown");
    const addMaterialButton = document.getElementById("addMaterialButton");
    const saveChangesButton = document.getElementById("saveChangesButton");
    const projectPictureInput = document.getElementById("projectPicture");
    const modalProjectImage = document.getElementById("modalProjectImage");

    let savedProjects = JSON.parse(localStorage.getItem("ongoingProject")) || [];
    
    function displayProjects() {
        const ongoingProjectsContainer = document.getElementById("ongoingProjects");

        let savedProjects = JSON.parse(localStorage.getItem("ongoingProjects")) || [];

        ongoingProjectsContainer.innerHTML = "";
        if (savedProjects.length === 0) {
            ongoingProjectsContainer.textContent = "No ongoing projects.";
        } else {
            savedProjects.forEach((project, index) => {
                const projectLink = document.createElement("a");
                projectLink.textContent = project.name;
                projectLink.href = "#";
                projectLink.onclick = (e) => {
                    e.preventDefault();
                    openModal(project, index);
                };
                ongoingProjectsContainer.appendChild(projectLink);
            });
        }
    }
    
    // Open modal and populate fields
    function openModal(project,index) {
        modalProjectName.value = project.name;
        modalProjectDescription.value = project.description;
        modalProjectUrlInput.value = project.url;

        modalProjectMaterials.innerHTML = "";
        project.materials.forEach((material) => {
            const listItem = document.createElement("li");
            listItem.textContent = material;

            // Add a delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Remove";
            deleteButton.onclick = () => {
                modalProjectMaterials.removeChild(listItem);
            };
            listItem.appendChild(deleteButton);

            modalProjectMaterials.appendChild(listItem);
        });

        // Display project image if exists
        if (project.image) {
            modalProjectImage.src = project.image;
            modalProjectImage.style.display = "block";
        } else {
            modalProjectImage.style.display = "none";
        }

        // Handle image input change
        projectPictureInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    modalProjectImage.src = event.target.result;
                    modalProjectImage.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        };


        saveChangesButton.onclick = () => saveProject(index);
        modal.style.display = "block";

        loadMaterialsDropdown(); // Load materials into dropdown when modal opens
    }

    function saveProject(index) {
        const updatedProject = {
            name: modalProjectName.value,
            description: modalProjectDescription.value,
            url: modalProjectUrlInput.value,
            materials: Array.from(modalProjectMaterials.children).map((li) => li.firstChild.textContent),
            image: modalProjectImage.src || null,
        
        };

        let savedProjects = JSON.parse(localStorage.getItem("ongoingProjects")) || [];

        if (index >= 0) {
            savedProjects[index] = updatedProject; //updated existing project
        }else {
            savedProjects.push(updatedProject); //Add new project
        }

        localStorage.setItem("ongoingProjects", JSON.stringify(savedProjects));
        
        displayProjects();

        modal.style.display = "none";
    }

    // Add material from dropdown
    addMaterialButton.onclick = () => {
        const selectedMaterial = materialDropdown.value;
        if (selectedMaterial) {
            const listItem = document.createElement("li");
            listItem.textContent = selectedMaterial;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Remove";
            deleteButton.onclick = () => {
                modalProjectMaterials.removeChild(listItem);
            };
            listItem.appendChild(deleteButton);

            modalProjectMaterials.appendChild(listItem);
        } else {
            alert("Please select a material to add.");
        }
    };

    closeModalButton.onclick = () => {
        modal.style.display = "none";
    };

    // Populate materials dropdown
    async function loadMaterialsDropdown() {
        try {
            const response = await fetch("yarn.json"); // JSON file with materials
            const materials = await response.json();
            materialDropdown.innerHTML = `
                <option value="" disabled selected>Select a material</option>
            `;
            materials.forEach((material) => {
                const option = document.createElement("option");
                option.value = material.name;
                option.textContent = material.name;
                materialDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading materials:", error);
        }
    }

    displayProjects();
});

   


    






        











