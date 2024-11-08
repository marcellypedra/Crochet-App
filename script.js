document.addEventListener("DOMContentLoaded", function() { // # HEADER and FOOTER
    const currentFile = window.location.pathname.split("/").pop();
    const headerHTML = `
            <section class="header">
            <div class="btnNavDiv">
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
