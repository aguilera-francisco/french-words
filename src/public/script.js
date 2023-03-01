//require("dotenv").config();
const btnBuscar = document.getElementById("btnBuscar");
const btnEliminar = document.getElementById("btnEliminar");

btnEliminar.style.display = "none";
const input = document.getElementById("input");
const URL = `/info`;
function buildMeanings(meanings) {
    let textHtml = "";
    for (meaning of meanings) {
        textHtml += `<p> <strong>${meaning.meaning}</strong> - <em>${meaning.type}</em></p>`;
    }
    return textHtml;
}
function showError() {
    const panel = document.getElementById("panel");
    panel.innerHTML = `<h3>Palabra No Encontrada</h3>
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
    panel.innerHTML = `<h3>${word}</h3>
        <label><em>${card.fromType}</em></label>
        <hr>
        <h5>Significados</h5>
        ${txtHtml}
        `;
    panel.classList.add("card");
    panel.classList.add("pt-2");
    panel.classList.add("mt-3");
    btnEliminar.style.display = "";
}

async function click() {
    const word = document.getElementById("input").value.toLowerCase();
    if (word != "") {
        console.log("antes del fetch");
        const response = await fetch(`${URL}/${word}`);
        console.log(response);
        const result = await response.json();
        console.log(result);
        if (result.ok) {
            const card = result.result;
            console.log(card);
            buildCard(card);
        } else {
            showError();
        }
    }
}
btnBuscar.addEventListener("click", () => {
    click();
});

btnEliminar.addEventListener("click", () => {
    const input = document.getElementById("input");
    input.value = "";
    const panel = document.getElementById("panel");
    panel.innerHTML = ``;
    panel.classList.remove("card");
    panel.classList.remove("pt-2");
    btnEliminar.style.display = "none";
});
input.addEventListener("keydown", (event) => {
    const panel = document.getElementById("panel");
    panel.classList.add("card");
    panel.innerHTML = `${event.code}`;
    if (event.code === "Enter") {
        click();
    }
});
