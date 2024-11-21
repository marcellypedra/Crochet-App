// Load and display the ongoing projects
document.addEventListener("DOMContentLoaded", () => {
    const ongoingProjectsContainer = document.getElementById("ongoingProjects");
    const closedProjectsContainer = document.getElementById("closedProjects");
    const modal = document.getElementById("projectModal");
    const closeModalButton = modal.querySelector(".close-button");

    const modalProjectName = document.getElementById("modalProjectName");
    const modalProjectDescription = document.getElementById("modalProjectDescription");
    const modalProjectUrlInput = document.getElementById("modalProjectUrlInput");
    const modalProjectMaterials = document.getElementById("modalProjectMaterials");
    const materialDropdown = document.getElementById("materialDropdown");
    const addMaterialButton = document.getElementById("addMaterialButton");
    const saveChangesButton = document.getElementById("saveChangesButton");
    const markAsClosedButton = document.getElementById("markAsClosedButton");
    const deleteProjectButton = document.getElementById("deleteProjectButton");
    const projectPictureInput = document.getElementById("projectPicture");
    const modalProjectImage = document.getElementById("modalProjectImage");

    let savedProjects = JSON.parse(localStorage.getItem("ongoingProject")) || [];
    let closedProjects = JSON.parse(localStorage.getItem("closedProjects")) || [];

    function displayProjects() {
        //Display ongoing projects
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
                    openModal(project, index, "ongoing");
                };
                ongoingProjectsContainer.appendChild(projectLink);
            });
        }

        // Display Closed Projects
        closedProjectsContainer.innerHTML = "";
        if (closedProjects.length === 0) {
            closedProjectsContainer.textContent = "No closed projects.";
        } else {
            closedProjects.forEach((project, index) => {
                const projectLink = document.createElement("a");
                projectLink.textContent = project.name;
                projectLink.href = "#";
                projectLink.onclick = (e) => {
                    e.preventDefault();
                    openModal(project, index, "closed");
                };
                closedProjectsContainer.appendChild(projectLink);
            });
        }
    }


// Open modal and populate fields
function openModal(project,index, projectType) {
    modalProjectName.value = project.name;
    modalProjectDescription.value = project.description;
    modalProjectUrlInput.value = project.url;

    modalProjectMaterials.innerHTML = "";
    project.materials.forEach((material) => {
        const listItem = document.createElement("li");
        listItem.textContent = material;



        // Add a delete button
        if (projectType === "ongoing") {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Remove";
            deleteButton.onclick = () => {
            modalProjectMaterials.removeChild(listItem);
            };
            listItem.appendChild(deleteButton);
        }

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

   // Configure Buttons
    if (projectType === "ongoing") {
    // Enable editing and show action buttons
       enableModalInputs();
       markAsClosedButton.style.display = "block";
       deleteProjectButton.style.display = "block";

       saveChangesButton.onclick = () => saveProject(index);
       markAsClosedButton.onclick = () => markAsClosed(index);
       deleteProjectButton.onclick = () => deleteProject(index, "ongoing");
    } else if (projectType === "closed") {
    //disable editign and hide buttons

      disableModalInputs();
      markAsClosedButton.style.display = "none";
      deleteProjectButton.style.display = "block";

      deleteProjectButton.onclick = () => deleteProject(index, "closed");
    }

    modal.style.display = "block";

    // Load materials into dropdown when modal opens
    loadMaterialsDropdown();

    

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

function markAsClosed(index) {
    const projectToClose = savedProjects.splice(index, 1)[0]; // Remove from ongoing
    closedProjects.push(projectToClose); // Add to closed
    localStorage.setItem("ongoingProjects", JSON.stringify(savedProjects));
    localStorage.setItem("closedProjects", JSON.stringify(closedProjects));
    displayProjects();
    modal.style.display = "none";
}

function deleteProject(index, projectType) {
    if (projectType === "ongoing") {
        savedProjects.splice(index, 1); // Remove from ongoing
        localStorage.setItem("ongoingProjects", JSON.stringify(savedProjects));
    } else if (projectType === "closed") {
        closedProjects.splice(index, 1); // Remove from closed
        localStorage.setItem("closedProjects", JSON.stringify(closedProjects));
    }
    displayProjects();
    modal.style.display = "none";
}

// Enable Modal Inputs
function enableModalInputs() {
    modalProjectName.disabled = false;
    modalProjectDescription.disabled = false;
    modalProjectUrlInput.disabled = false;
    projectPictureInput.style.display = "block";
    saveChangesButton.style.display = "block";
}

// Disable Modal Inputs
function disableModalInputs() {
    modalProjectName.disabled = true;
    modalProjectDescription.disabled = true;
    modalProjectUrlInput.disabled = true;
    projectPictureInput.style.display = "none";
    saveChangesButton.style.display = "none";
}

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