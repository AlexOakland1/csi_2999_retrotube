var menuIcon = document.querySelector(".menu-icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");
var showDescription = document.querySelector(".show-description-icon");
var description = document.querySelector(".description");

menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle("large-container");
}
showDescription.onclick = function(){
    description.classList.toggle("show-description");
    showDescription.classList.toggle("hide-description-icon");
}