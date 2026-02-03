// Music
const music = document.getElementById("bgMusic");
const btn = document.getElementById("musicBtn");

btn.addEventListener("click", () => {
    music.play();
    btn.style.display = "none";
});

// Slideshow
let slides = document.querySelectorAll(".slide");
let index = 0;

setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}, 3000);

// Typing Effect
const text = document.querySelector(".typing");
const content = text.innerText;
text.innerText = "";

let i = 0;
function type() {
    if (i < content.length) {
        text.innerText += content.charAt(i);
        i++;
        setTimeout(type, 100);
    }
}
type();