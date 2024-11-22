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
async function saveChanges() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const index = modal.dataset.index;
    const projectType = modal.dataset.projectType;
    
    const project = {
        id: modal.dataset.id,
        name: document.getElementById("modalProjectName").value.trim(),
        description: document.getElementById("modalProjectDescription").value.trim(),
        url: document.getElementById("modalProjectUrlInput").value.trim(),
        materials: Array.from(document.getElementById("modalProjectMaterials").children)
            .map((li) => li.textContent.trim()),
    };

    try {
        const response = await fetch(`/api/projects/${project.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
        });

        if (response.ok) {
            closeModal();
            displayProjects();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }

    } catch (error) {
        console.error("Error updating project:", error);
    }

}


// Function to delete a project
async function deleteProject() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const projectId = modal.dataset.id;

    try {
        const response = await fetch(`/api/projects/${porjectId}`, {method: "DELETE" });

        if (response.ok) {
            closeModal();
            displayProjects();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error("Error deleting project:", error);
    }
}

// Function to mark a project as closed
async function markProjectAsClosed() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const projectId = modal.dataset.id;
    
    try {
        const response = await fetch(`/api/projects/${projectId}/close`, {method: "PUT" });

        if (response.ok) {
            closeModal();
            displayProjects();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error("Error closing project:", error);
    }

}
    