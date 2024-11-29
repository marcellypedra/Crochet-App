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
function openModal(project, project_type) {

    const modal = document.getElementById("projectModal");
    console.log("Project data:", project); 

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

    const materials = Array.isArray(project.materials)
    ? project.materials
    : typeof project.materials === "string"
    ? JSON.parse(project.materials) // Parse if it's a JSON string
    : [];

     // Ensure materials is an array
    if (Array.isArray(project.materials) && project.materials.length > 0) {
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

    // Restrict file input to ongoing projects
    const pictureInput = document.getElementById("projectPicture");
    if (project_type === "ongoing") {
        pictureInput.style.display = "block";
    } else {
        pictureInput.style.display = "none";
    }  

    // Store project id and category in the modal for later use
    modal.dataset.id = project.id;
    modal.dataset.project_type = project_type;

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
    if (project_type === "ongoing") {
        // Enable editing
        enableModalInputs();
        document.getElementById("markAsClosedButton").style.display = "block";
        document.getElementById("deleteProjectButton").style.display = "block";
    } else if (project_type === "closed"){
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

    const projectId = modal.dataset.id;
    const project_type = modal.dataset.project_type;
    
    // Create a FormData object to handle the file and other data
    const formData = new FormData();
    formData.append("name", document.getElementById("modalProjectName").value.trim());
    formData.append("description", document.getElementById("modalProjectDescription").value.trim());
    formData.append("url", document.getElementById("modalProjectUrlInput").value.trim());
    formData.append(
        "materials",
        JSON.stringify(
            Array.from(document.getElementById("modalProjectMaterials").children).map(
                (li) => li.textContent.trim()
            )
        )
    );

    // Append the image file if provided
    const pictureInput = document.getElementById("projectPicture");
    if (pictureInput.files.length > 0) {
        formData.append("image", pictureInput.files[0]);
    }
        
    try {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: "PATCH",
            body: formData, // Send the FormData object
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
        const response = await fetch(`/api/projects/${projectId}`, {method: "DELETE" });

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
        const response = await fetch(`/api/projects/${projectId}/close`, {
            method: "PATCH", 
            headers: {"Content-Type": "application/json" },
        });
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
    
