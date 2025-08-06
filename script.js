// script.js
const doctoresData = {
  "Castillo": ["Cirurgias", "Instalaciones", "Reparaciones"],
  "Cesar": ["Rott Canals", "Preparaciones", "Instalaciones", "Cavities", "Reparaciones"],
  "Ingrid": ["Rott Canals", "Preparaciones", "Instalaciones", "Cavities", "Reparaciones"],
  "Conde": ["Rott Canals", "Preparaciones", "Instalaciones", "Cavities", "Reparaciones"],
  "Yaima": ["Rott Canals", "Preparaciones", "Instalaciones", "Cavities", "Reparaciones"],
  "Niurviz": ["Rott Canals", "Preparaciones", "Instalaciones", "Cavities", "Reparaciones"],
  "Mario": ["Rott Canals", "Preparaciones", "Instalaciones", "Cavities", "Reparaciones"],
  "Josue Romero": ["Diseño", "Reparaciones"],
  "Samael Romero": ["Diseno", "Reparaciones"],
  "Decire Gonzalez": ["Rott Canals", "Preparaciones", "Instalaciones", "Cavities", "Reparaciones"]
};

const doctorSelect = document.getElementById("doctor");
const procedimientosContainer = document.getElementById("procedimientos");
const fechaInput = document.getElementById("fecha");
const salvarBtn = document.getElementById("salvar");
const editarBtn = document.getElementById("editar");
const enviarBtn = document.getElementById("enviar");
const resumenContainer = document.getElementById("resumen");

let currentFecha = "";
let bloqueado = false;
let datosGuardados = {};
let modoEdicion = false;

const limpiarBtn = document.createElement("button");
limpiarBtn.textContent = "Limpiar";
limpiarBtn.id = "limpiar";
limpiarBtn.addEventListener("click", () => {
  datosGuardados = {};
  guardarEnLocalStorage(currentFecha);
  location.reload();
});
document.querySelector(".botones").appendChild(limpiarBtn);

const eliminarBtn = document.createElement("button");
eliminarBtn.textContent = "Eliminar";
eliminarBtn.id = "eliminar";
eliminarBtn.addEventListener("click", () => {
  const marcados = document.querySelectorAll(".edit-check:checked");
  const doctorMarcados = document.querySelectorAll(".delete-doctor:checked");

  // eliminar procedimientos marcados
  marcados.forEach(chk => {
    const doctor = chk.dataset.doctor;
    const proc = chk.value;
    if (datosGuardados[doctor]) {
      datosGuardados[doctor] = datosGuardados[doctor].filter(p => p !== proc);
    }
  });

  // eliminar doctores marcados
  doctorMarcados.forEach(chk => {
    const doctor = chk.dataset.doctor;
    delete datosGuardados[doctor];
  });

  // eliminar doctores sin procedimientos
  for (let doc in datosGuardados) {
    if (datosGuardados[doc].length === 0) {
      delete datosGuardados[doc];
    }
  }

  guardarEnLocalStorage(currentFecha);
  location.reload();
});
document.querySelector(".botones").appendChild(eliminarBtn);

window.onload = () => {
  const hoy = new Date().toISOString().split("T")[0];
  fechaInput.value = hoy;
  currentFecha = hoy;

  for (let doctor in doctoresData) {
    const opt = document.createElement("option");
    opt.value = doctor;
    opt.text = doctor;
    doctorSelect.appendChild(opt);
  }

  cargarDesdeLocalStorage(hoy);
};

fechaInput.addEventListener("change", () => {
  currentFecha = fechaInput.value;
  cargarDesdeLocalStorage(currentFecha);
});

doctorSelect.addEventListener("change", () => {
  mostrarProcedimientos(doctorSelect.value);
  salvarBtn.disabled = false;
});

salvarBtn.addEventListener("click", () => {
  const doctor = doctorSelect.value;
  const checks = document.querySelectorAll(`input[name="${doctor}"]:checked`);
  const seleccionados = Array.from(checks).map(chk => chk.value);

  if (!datosGuardados[doctor]) {
    datosGuardados[doctor] = [];
  }
  datosGuardados[doctor] = seleccionados;
  guardarEnLocalStorage(currentFecha);
  location.reload();
});

editarBtn.addEventListener("click", () => {
  if (bloqueado) return alert("Este formulario ya fue enviado y no puede modificarse.");
  habilitarFormulario(true);
  salvarBtn.disabled = false;
  modoEdicion = true;
  actualizarResumen();
});

enviarBtn.addEventListener("click", () => {
  guardarEnLocalStorage(currentFecha, true);
  bloquearFormulario();
  alert("Formulario enviado y bloqueado.");
  location.reload();
});

function mostrarProcedimientos(doctor) {
  procedimientosContainer.innerHTML = "";
  if (!doctor || !doctoresData[doctor]) return;

  doctoresData[doctor].forEach(proc => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="${doctor}" value="${proc}"> ${proc}`;
    procedimientosContainer.appendChild(label);
  });
}

function actualizarResumen() {
  resumenContainer.innerHTML = "";
  for (let doctor in datosGuardados) {
    const box = document.createElement("div");
    box.className = "resumen-box";
    const procList = datosGuardados[doctor];

    let contenido = "";
    if (modoEdicion) {
      contenido = `<label><input type='checkbox' class='delete-doctor' data-doctor='${doctor}'> <strong>${doctor}</strong></label><br>`;
      contenido += procList.map(proc => {
        return `<label><input type='checkbox' class='edit-check' data-doctor='${doctor}' value='${proc}'> ${proc}</label>`;
      }).join("<br>");
    } else {
      contenido = `<strong>${doctor}</strong>: ${procList.join(", ")}`;
    }

    box.innerHTML = `<div class='resumen-procedimientos'>${contenido}</div>`;
    resumenContainer.appendChild(box);
  }
}

function guardarEnLocalStorage(fecha, bloquear = false) {
  const datos = {
    procedimientos: datosGuardados,
    bloqueado: bloquear
  };
  localStorage.setItem(`asistencia-${fecha}`, JSON.stringify(datos));
}

function cargarDesdeLocalStorage(fecha) {
  const datos = JSON.parse(localStorage.getItem(`asistencia-${fecha}`));
  datosGuardados = {};
  procedimientosContainer.innerHTML = "";
  resumenContainer.innerHTML = "";
  modoEdicion = false;

  if (!datos) {
    habilitarFormulario(true);
    salvarBtn.disabled = true;
    bloqueado = false;
    return;
  }

  datosGuardados = datos.procedimientos || {};
  actualizarResumen();

  bloqueado = datos.bloqueado;
  habilitarFormulario(!bloqueado);
  salvarBtn.disabled = true;
}

function habilitarFormulario(habilitar) {
  doctorSelect.disabled = !habilitar;
  const checkboxes = procedimientosContainer.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(cb => cb.disabled = !habilitar);
}

function bloquearFormulario() {
  habilitarFormulario(false);
  doctorSelect.disabled = true;
  salvarBtn.disabled = true;
  modoEdicion = false;
}
