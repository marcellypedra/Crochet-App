    // Add Header Section with Dynamic Content
    const currentFile = window.location.pathname.split("/").pop();
    const pageContent = {
        "index.html": {
            title: "Welcome to Your Yarn.com!",
        },
        "user.html": {
            title: "Your Yarn.com"
        },
        "material.html": {
            title: "Your Yarn.com supplies",
        },
        "project.html": {
            title: "Your Yarn.com projects",
        }
    };

    const { title = "", subtitle = "" } = pageContent[currentFile] || {};
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
            <li class="navitem"><a class="nav-link" href="project.html">My Projects</a></li>
            <li class="navitem"><a class="nav-link" href="material.html">My Material list</a></li>
            </ul>
        </nav>
</div>

<link rel="stylesheet" href="style.css">
`;
    const footerHTML = `
        <section class="footer">
            <div>
                <p>Since ${new Date().getFullYear()} helping you to knit your dreams!</p>
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
// Fetch data from the JSON file and populate the dropdown
async function loadDropdownFromJSON() {
    try {
        // Fetch the JSON file
        const response = await fetch("yarn.json");
        const data = await response.json();

        // Get the dropdown element
        const dropdown = document.getElementById("supplies");

        // Loop through the JSON data and create options
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = item.name;
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
    const dropdown = document.getElementById("supplies");
    const selectedList = document.getElementById("selectedItemsList");

    Array.from(dropdown.selectedOptions).forEach(option => {
        if (!Array.from(selectedList.children).some(li => li.textContent === option.value)) {
            const listItem = document.createElement("li");
            listItem.textContent = option.value;
            selectedList.appendChild(listItem);
        }
    });

    dropdown.selectedIndex = -1;
}







