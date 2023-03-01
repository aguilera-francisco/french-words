//require("dotenv").config();
const btnBuscar = document.getElementById("btnBuscar");
const btnEliminar = document.getElementById("btnEliminar");

btnEliminar.style.display = "none";
const input = document.getElementById("input");
const URL = `http://localhost:10000/info`;
function buildMeanings(meanings) {
    let textHtml = "";
    for (meaning of meanings) {
        textHtml += `<p> <strong>${meaning.meaning}</strong> - <em>${meaning.type}</em></p>`;
    }
    return textHtml;
}
async function click() {
    const word = document.getElementById("input").value;
    if (word != "") {
        const response = await fetch(`${URL}/${word}`);
        const result = await response.json();
        //const card = await getWord(word);
        const card = result.result;

        console.log(card);
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
        //función añadir botón eliminar
        // let divInput = document.getElementById('div-input');
        // let btnE = document.createElement('button');
        // btnE =
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
    if (event.code === "Enter") {
        click();
    }
});
