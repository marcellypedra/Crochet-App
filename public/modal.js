document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("projectModal");
    if (modal) {
        modal.style.display = "none";
    }
    const closeButton = modal?.querySelector(".close-button");
    const saveChangesButton = document.getElementById("saveChangesButton");
    const deleteProjectButton = document.getElementById("deleteProjectButton");
    const markAsClosedButton = document.getElementById("markAsClosedButton");

    if (closeButton) closeButton.onclick = closeModal;
    if (saveChangesButton) saveChangesButton.onclick = saveChanges;
    if (deleteProjectButton) deleteProjectButton.onclick = deleteProject;
    if (markAsClosedButton) markAsClosedButton.onclick = markProjectAsClosed;
});

// Function to open the modal
function openModal(project, index, projectType) {
    const modal = document.getElementById("projectModal");
    if (!modal) {
        console.error("Modal element not found")
        return;
    }
    // Populate modal fields with project data
    document.getElementById("modalProjectName").value = project.name || "";
    document.getElementById("modalProjectDescription").value = project.description || "";
    document.getElementById("modalProjectUrlInput").value = project.url || "";

    // Populate materials list
    const materialsList = document.getElementById("modalProjectMaterials");
    materialsList.innerHTML = ""; // Clear previous materials
    if (project.materials && project.materials.length > 0) {
        // Populate the material list
        project.materials.forEach((material) => {
            const listItem = document.createElement("li");
            listItem.textContent = material;

            const deleteButton = document.createElement("button");
                deleteButton.textContent = "Remove";
                deleteButton.onclick = () => {
                    materialsList.removeChild(listItem);
                };
                listItem.appendChild(deleteButton);
                materialsList.appendChild(listItem);
        });
    }

    // Show the project image if available
      const modalProjectImage = document.getElementById("modalProjectImage");
      if (project.image) {
          modalProjectImage.src = project.image;
          modalProjectImage.style.display = "block";
      } else {
          modalProjectImage.style.display = "none";
      }

    // Store project index and category in the modal for later use
    modal.dataset.index = index;
    modal.dataset.projectType = projectType;

    // Show the modal
    modal.style.display = "block";

    loadDropdownFromJSON();

      // Add material from dropdown
     document.getElementById("addMaterialButton").onclick = () => {
        const selectedMaterial = document.getElementById("supplies").value;
        if (selectedMaterial) {
            const listItem = document.createElement("li");
            listItem.textContent = selectedMaterial;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Remove";
            deleteButton.onclick = () => {
                materialsList.removeChild(listItem);
            };
            listItem.appendChild(deleteButton);

            materialsList.appendChild(listItem);
        } else {
            alert("Please select a material to add.");
        } 
    };



    // Handle buttons based on project type
    if (projectType === "ongoing") {
        // Enable editing
        enableModalInputs();
        document.getElementById("markAsClosedButton").style.display = "block";
        document.getElementById("deleteProjectButton").style.display = "block";
    } else if (projectType === "closed"){
        // Disable editing
        disableModalInputs();
        document.getElementById("saveChangesButton").style.display = "none";
        document.getElementById("markAsClosedButton").style.display = "none";
        document.getElementById("deleteProjectButton").style.display = "block";
    }

}

function enableModalInputs() {
    const inputs = document.querySelectorAll("#ProjectModal input, #ProjectModal textarea");
    inputs.forEach(input => {
        input.disabled = false;
        input.readOnly = false;
    });
}

function disableModalInputs() {
    const inputs = document.querySelectorAll("#ProjectModal input, #ProjectModal textarea");
    inputs.forEach(input => {
        input.disabled = true;
        input.readOnly = true;
    });
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("projectModal");
    if (modal) modal.style.display = "none";
}

// Function to save changes to a project
function saveChanges() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const index = modal.dataset.index;
    const projectType = modal.dataset.projectType;
    if (index === undefined || projectType === undefined) return;

    const projects = JSON.parse(localStorage.getItem(`${projectType}Projects`)) || [];
    const project = projects[index];

    if (!project) return;

    
    // Update project details with modal inputs
    project.name = document.getElementById("modalProjectName").value.trim();
    project.description = document.getElementById("modalProjectDescription").value.trim();
    project.url = document.getElementById("modalProjectUrlInput").value.trim();

    // Update materials
    const materialsList = document.getElementById("modalProjectMaterials");
    project.materials = Array.from(materialsList.children).map((li) => li.textContent.trim());

    // Save updated project back to localStorage
    projects[index] = project;
    localStorage.setItem(`${projectType}Projects`, JSON.stringify(projects));

    // Close modal and refresh projects display
    closeModal();
    displayProjects();
}

// Function to delete a project
function deleteProject() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const index = modal.dataset.index;
    const projectType = modal.dataset.projectType;
    if (index === undefined || projectType === undefined) return;

    const projects = JSON.parse(localStorage.getItem(`${projectType}Projects`)) || [];
    if (!projects[index]) return;

    // Remove the project
    projects.splice(index, 1);

    // Save the updated list back to localStorage
    localStorage.setItem(`${projectType}Projects`, JSON.stringify(projects));

    // Close modal and refresh projects display
    closeModal();
    displayProjects();
}

// Function to mark a project as closed
function markProjectAsClosed() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const index = modal.dataset.index;
    const projectType = modal.dataset.projectType;
    if (index === undefined || projectType === undefined || projectType !== "ongoing") return;

    const ongoingProjects = JSON.parse(localStorage.getItem("ongoingProjects")) || [];
    const closedProjects = JSON.parse(localStorage.getItem("closedProjects")) || [];

    const project = ongoingProjects[index];
    if (!project) return;

    project.projectType = "closed";

    // Remove project from ongoing and add to closed
    ongoingProjects.splice(index, 1);
    closedProjects.push(project);

    // Save updated lists back to localStorage
    localStorage.setItem("ongoingProjects", JSON.stringify(ongoingProjects));
    localStorage.setItem("closedProjects", JSON.stringify(closedProjects));

    // Close modal and refresh projects display
    closeModal();
    displayProjects();
}