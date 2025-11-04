// Modal de compra de entrada
const modal = document.getElementById("modal-pago");
const btn = document.getElementById("btn-entrada");
const span = document.querySelector(".close-btn");

btn.addEventListener("click", function(event) {
    event.preventDefault();
    modal.style.display = "block";
});

span.addEventListener("click", function() {
    modal.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

