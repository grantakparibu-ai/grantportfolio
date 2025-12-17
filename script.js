// Scroll reveal
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  const trigger = window.innerHeight * 0.85;
  reveals.forEach((el) => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add("active");
    }
  });
});

// CTA scroll
document.getElementById("cta").addEventListener("click", () => {
  document.getElementById("about").scrollIntoView({ behavior: "smooth" });
});
