const btnBuscar = document.getElementById("btnBuscar");
const btnEliminar = document.getElementById("btnEliminar");
const input = document.getElementById("input");
const URL = "http://localhost:8000/info";
function buildMeanings(meanings) {
    let textHtml = "";
    for (meaning of meanings) {
        textHtml += `<p> ${meaning.meaning} - ${meaning.type}</p>`;
    }
    return textHtml;
}
async function click() {
    const word = document.getElementById("input").value;
    if (word != "") {
        const response = await fetch(`${URL}/${word}`);
        const result = await response.json();
        const card = result.result;
        console.log(card);
        console.log(card.word);
        const txtHtml = buildMeanings(card.meanings);
        const panel = document.getElementById("panel");
        panel.innerHTML = `<h3>${word} - ${card.fromType}</h3>
        <hr>
        <h5>Significados</h5>
        ${txtHtml}
        `;
        panel.classList.add("card");
        panel.classList.add("pt-2");
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
    panel.classList.add("card");
});
input.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        click();
    }
});
