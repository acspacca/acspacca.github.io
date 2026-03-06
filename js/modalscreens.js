// Get elements
const modal = document.getElementById("aboutModal");
const btn = document.getElementById("aboutBtn");
const closeBtn = document.querySelector(".close");

// Show modal on logo click
btn.onclick = function() {
  modal.style.display = "block";
}

// Close modal on X click
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close modal if user clicks outside the box
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}