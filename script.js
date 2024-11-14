document.addEventListener("DOMContentLoaded", function() { // # HEADER and FOOTER
    const currentFile = window.location.pathname.split("/").pop();
    const headerHTML = `
<div class="header">
    <div class="headercontainer">
        <div class="headercontent">
            <div class="headertext">
                <h3 id="headertitle">${currentFile === "index.html" ? "Welcome to Your Yarn.com!" : "Your Yarn.com"}</h3>
            </div>  
    </div>
        <div class="logocontainer">  
        <a href="#" onclick="openPage('index')"><img src="img/logo.jpeg" alt="MyYarn" class="icons" id="logo"></a>
        </div>
        <nav class="headermenu">
            <ul class=navlist> 
            <li class="navitem"><a class="nav-link" href="project.html">My Projects</a></li>
            <li class="navitem"><a class="nav-link" href="material.html">My Material list</a></li>
            </ul>
        </nav>
</div>
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

// automatic slideshow

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}
