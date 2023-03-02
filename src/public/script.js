//require("dotenv").config();
const btnBuscar = document.getElementById("btnBuscar");
const btnEliminar = document.getElementById("btnEliminar");
const input = document.getElementById("input");

btnEliminar.style.display = "none";
const URL = `/info`;
function buildMeanings(meanings) {
    let textHtml = "";
    for (meaning of meanings) {
        textHtml += `<p> <strong>${meaning.meaning}</strong> - <em>${meaning.type}</em></p>`;
    }
    return textHtml;
}
function showError(word) {
    const panel = document.getElementById("panel");
    panel.innerHTML = `<h3>No se encontró: ${word}</h3>
        <label><em>Prueba Con Otra</em></label>
        <hr>
        <h5>Toma en cuenta:</h5>
        <p>El idioma: Francés</p>
        <p>Si tiene acentos</p>
        `;
    panel.classList.add("card");
    panel.classList.add("pt-2");
    panel.classList.add("mt-3");
    btnEliminar.style.display = "";
}
function buildCard(card) {
    const txtHtml = buildMeanings(card.meanings);
    const panel = document.getElementById("panel");
    panel.innerHTML = `<h3><strong>${card.word}</strong></h3>
        <label><em>${card.fromType}</em></label>
        <hr>
        <h5><strong>Significados</strong></h5>
        ${txtHtml}
        `;
    panel.classList.add("card");
    panel.classList.add("pt-2");
    panel.classList.add("mt-3");
    btnEliminar.style.display = "";
}
function clean() {
    const panel = document.getElementById("panel");
    panel.innerHTML = ``;
    panel.classList.remove("card");
    panel.classList.remove("pt-2");
    btnEliminar.style.display = "none";
}
async function click() {
    const word = document.getElementById("input").value.toLowerCase();
    if (word != "") {
        //console.log("antes del fetch");
        const panel = document.getElementById("panel");
        panel.classList.add("card");
        panel.innerHTML = `<h6>Buscando... </h6>`;
        const response = await fetch(`${URL}/${word}`);
        //console.log(response);
        const result = await response.json();
        console.log("RESPUESTA", response);
        console.log("RESULTADO", result);
        if (result.result) {
            const card = result.result;
            buildCard(card);
        } else {
            showError(input.value);
        }
    }
}
input.addEventListener("input", () => {
    btnEliminar.style.display = "";
    if (input.value === "") {
        clean();
    }
});
btnBuscar.addEventListener("click", () => {
    click();
    input.focus();
});

btnEliminar.addEventListener("click", () => {
    input.value = "";
    clean();
    input.focus();
});
input.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        click();
    }
});
