// Scroll morbido al click del bottone
document.getElementById("cta").addEventListener("click", () => {
  document.getElementById("about").scrollIntoView({
    behavior: "smooth",
  });
});

// Animazione comparsa cards
const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", () => {
  const triggerBottom = window.innerHeight * 0.85;

  cards.forEach((card) => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }
  });
});

// Stato iniziale animazioni
cards.forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
});
