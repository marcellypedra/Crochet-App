document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("projectModal");
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
function openModal(project, index, category) {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    // Populate modal fields with project data
    document.getElementById("modalProjectName").value = project.name || "";
    document.getElementById("modalProjectDescription").value = project.description || "";
    document.getElementById("modalProjectUrlInput").value = project.url || "";

    // Populate materials list
    const materialsList = document.getElementById("modalProjectMaterials");
    materialsList.innerHTML = ""; // Clear previous materials
    if (project.materials) {
        project.materials.forEach((material) => {
            const li = document.createElement("li");
            li.textContent = material;
            materialsList.appendChild(li);
        });
    }

    // Store project index and category in the modal for later use
    modal.dataset.index = index;
    modal.dataset.category = category;

    // Show the modal
    modal.style.display = "block";
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
    const category = modal.dataset.category;
    if (index === undefined || category === undefined) return;

    const projects = JSON.parse(localStorage.getItem(`${category}Projects`)) || [];
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
    localStorage.setItem(`${category}Projects`, JSON.stringify(projects));

    // Close modal and refresh projects display
    closeModal();
    displayProjects();
}

// Function to delete a project
function deleteProject() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const index = modal.dataset.index;
    const category = modal.dataset.category;
    if (index === undefined || category === undefined) return;

    const projects = JSON.parse(localStorage.getItem(`${category}Projects`)) || [];
    if (!projects[index]) return;

    // Remove the project
    projects.splice(index, 1);

    // Save the updated list back to localStorage
    localStorage.setItem(`${category}Projects`, JSON.stringify(projects));

    // Close modal and refresh projects display
    closeModal();
    displayProjects();
}

// Function to mark a project as closed
function markProjectAsClosed() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const index = modal.dataset.index;
    const category = modal.dataset.category;
    if (index === undefined || category === undefined || category !== "ongoing") return;

    const ongoingProjects = JSON.parse(localStorage.getItem("ongoingProjects")) || [];
    const closedProjects = JSON.parse(localStorage.getItem("closedProjects")) || [];

    const project = ongoingProjects[index];
    if (!project) return;

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