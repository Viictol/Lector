const texto = document.getElementById("texto");
const lector = document.getElementById("lector");

const velocidad = document.getElementById("velocidad");
const valorVelocidad = document.getElementById("valorVelocidad");

const btnIniciar = document.getElementById("btnIniciar");
const btnPausar = document.getElementById("btnPausar");
const btnReiniciar = document.getElementById("btnReiniciar");

const contador = document.getElementById("contador");
const progreso = document.getElementById("progreso");

let palabras = [];
let indice = 0;

let temporizador = null;
let leyendo = false;

valorVelocidad.textContent = velocidad.value;

velocidad.addEventListener("input", () => {
    valorVelocidad.textContent = velocidad.value;
});

function prepararTexto() {

    lector.innerHTML = "";

    palabras = texto.value.match(/\S+|\s+/g) || [];

    palabras.forEach(palabra => {

        const span = document.createElement("span");
        span.textContent = palabra;
        lector.appendChild(span);

    });

    indice = 0;

    actualizarContador();
    actualizarBarra();

}

function obtenerPausa(palabra){

    if(palabra.endsWith("...")) return 900;

    if(palabra.endsWith(".")) return 600;

    if(palabra.endsWith(",")) return 600;

    if(palabra.endsWith(";")) return 250;

    if(palabra.endsWith(":")) return 300;

    if(palabra.endsWith("?")) return 600;

    if(palabra.endsWith("!")) return 600;

    return 0;

}

function mostrarSiguiente(){

    if(!leyendo) return;

    const spans = lector.querySelectorAll("span");

    spans.forEach(span => span.classList.remove("activa"));

    while(indice < spans.length && spans[indice].textContent.trim() === ""){
        indice++;
    }

    if(indice >= spans.length){

        leyendo = false;
        return;

    }

    spans[indice].classList.add("activa");

    spans[indice].scrollIntoView({
        behavior:"smooth",
        block:"center"
    });

    const palabra = spans[indice].textContent;

    indice++;

    actualizarContador();
    actualizarBarra();

    const tiempoBase = 60000 / Number(velocidad.value);

    const pausaExtra = obtenerPausa(palabra);

    temporizador = setTimeout(
        mostrarSiguiente,
        tiempoBase + pausaExtra
    );

}

function iniciarLectura(){

    if(palabras.length === 0){
        prepararTexto();
    }

    leyendo = true;

    clearTimeout(temporizador);

    mostrarSiguiente();

}

function actualizarContador(){

    const total = palabras.filter(p => p.trim() !== "").length;

    let actual = 0;

    for(let i=0;i<indice;i++){

        if(palabras[i].trim() !== ""){
            actual++;
        }

    }

    contador.textContent = actual + " / " + total;

}

function actualizarBarra(){

    const total = palabras.filter(p => p.trim() !== "").length;

    let actual = 0;

    for(let i=0;i<indice;i++){

        if(palabras[i].trim() !== ""){
            actual++;
        }

    }

    const porcentaje = total > 0 ? (actual / total) * 100 : 0;

    progreso.style.width = porcentaje + "%";

}

btnIniciar.addEventListener("click", iniciarLectura);

btnPausar.addEventListener("click", () => {

    leyendo = false;
    clearTimeout(temporizador);

});

btnReiniciar.addEventListener("click", () => {

    leyendo = false;

    clearTimeout(temporizador);

    indice = 0;

    prepararTexto();

});
