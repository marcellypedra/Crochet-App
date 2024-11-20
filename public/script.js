    // Add Header Section with Dynamic Content
    const currentFile = window.location.pathname.split("/").pop();
    const pageContent = {
        "index.html": {
            title: "Welcome to Your Yarn.com!",
        },
        "user.html": {
            title: "Your Yarn.com"
        },
        "Nproject.html": {
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
            <li class="navitem"><a class="nav-link" href="Nproject.html">My Projects</a></li>
            <li class="navitem"><a class="nav-link" href="material.html">My Material list</a></li>
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

function openPage(pageName) {
    window.location.href = pageName;
}
// Fetch data from the JSON file and populate the dropdown
async function loadDropdownFromJSON() {
    try {
        // Fetch the JSON file
        const response = await fetch("yarn.json");
        const data = await response.json();

        // Get the datalist element
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
    // Get the input field and the list
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

//Function to save the new Project to a list in My Projects

function addtoProjectList() {
    const projectName = document.getElementById("pname").value.trim();
    const porjectDescription = document.getElementById("descr").value.trim();
    const materialList = Array.from(document.querySelectorAll("selectedMaterialList li span"))
          .map(span => span.textContent)
}

//Create a project object

const project = {
    name: projectName,
    description: projectDescription,
    materials: materialList
};



        











