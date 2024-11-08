document.addEventListener("DOMContentLoaded", function() { // # HEADER and FOOTER
    const currentFile = window.location.pathname.split("/").pop();
    const headerHTML = `
            <section class="header">
            <div class="btnNavDiv">
                <a href="index.html"><img src="img/yarn.png" alt="Logo" class="logo" id="logo"></a>
                <nav id="menu" class="navbar navbar-expand-lg navbar-light">
                    <a id="nome" class="navbar-brand" href="#"></a>
                            <ul class="nav-list navbar-nav ml-auto">
                            <li class="nav-item"><a class="nav-link" href="project.html">My Projects</a></li>
                            <li class="nav-item"><a class="nav-link" href="material.html">My Material list</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
                <h3>${currentFile === "index.html" ? "Welcome to Your Yarn.com!" : "Your Yarn.com"}</h3>
                               
            </div>
            </section> `;
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
