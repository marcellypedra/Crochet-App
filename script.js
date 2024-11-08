document.addEventListener("DOMContentLoaded", function() { // # HEADER and FOOTER
    const currentFile = window.location.pathname.split("/").pop();
    const headerHTML = `
            <section class="header">
            <div class="btnNavDiv">
                <a href="index.html"><img src="image/logo.png" alt="Logo" class="logo" id="logo"></a>
                <nav id="menu" class="navbar navbar-expand-lg navbar-light">
                    <a id="nome" class="navbar-brand" href="#"></a>
                    <button id="btnToogle" class="navbar-toggler ml-auto custom-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="nav-container collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="nav-list navbar-nav ml-auto">
                            <li class="nav-item"><a class="nav-link" href="mortgage.html">Mortgage</a></li>
                            <li class="nav-item"><a id="btnSell" class="nav-link" href="#Sell">Sell</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
                <h3>${currentFile === "index.html" ? "Welcome to BM Real Estate!" : "BM Real Estate Announcements"}</h3>
            <div class="searchDiv">
                <input type="text" id="searchInput" placeholder="Search...">
                <input id="searchTerm" type="button" value="Search" onclick="searchTerm()"></li>
            </div>
            </section> `;
    const footerHTML = `
        <section class="footer">
            <div>
                <p>Since ${new Date().getFullYear()} helping you to find your <b>H</b>ome <b>S</b>weet <b>H</b>ome</p>
                <p>&copy; ${new Date().getFullYear()} My Website. All rights reserved.</p>
            </div>
            <div>
                <p>Brenda Lopes</p>
                <a href="mailto:20058225@mydbs.ie" target="_blank">20058225@mydbs.ie</a> 
            </div>
            <div>
                <p>Marcelly Pedra</p> 
                <a href="mailto:20040674@mydbs.ie" target="_blank">20040674@mydbs.ie</a>
            </div>
        </section>`;
        
    /*document.getElementById("showHeader").innerHTML = headerHTML;
    document.getElementById("showFooter").innerHTML = footerHTML;*/

    // Insert content
    const headerContainer = document.getElementById("showHeader");
    if (headerContainer) headerContainer.innerHTML = headerHTML;

    const footerContainer = document.getElementById("showFooter");
    if (footerContainer) footerContainer.innerHTML = footerHTML;
});
