// usuario.js
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
const limpiarBtn = document.getElementById("limpiar");
const resumenContainer = document.getElementById("resumen");

const editarBtn = document.createElement("button");
editarBtn.textContent = "Editar Último";
editarBtn.id = "editar";
document.querySelector(".botones").appendChild(editarBtn);

let currentFecha = "";
let datosGuardados = {};
let ultimoDoctorEditado = "";

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

doctorSelect.addEventListener("change", () => {
  mostrarProcedimientos(doctorSelect.value);
});

salvarBtn.addEventListener("click", () => {
  const doctor = doctorSelect.value;
  if (!doctor) return;

  const checks = document.querySelectorAll(`input[name="${doctor}"]:checked`);
  const seleccionados = Array.from(checks).map(chk => chk.value);

  if (!datosGuardados[doctor]) {
    datosGuardados[doctor] = [];
  }

  datosGuardados[doctor] = seleccionados;
  ultimoDoctorEditado = doctor;
  guardarEnLocalStorage(currentFecha);
  actualizarResumen();

  doctorSelect.value = "";
  procedimientosContainer.innerHTML = "";
});

editarBtn.addEventListener("click", () => {
  if (!ultimoDoctorEditado) return alert("Aún no hay procedimiento para editar.");
  doctorSelect.value = ultimoDoctorEditado;
  mostrarProcedimientos(ultimoDoctorEditado);

  // Marcar los procedimientos ya guardados para ese doctor
  const seleccionados = datosGuardados[ultimoDoctorEditado] || [];
  seleccionados.forEach(proc => {
    const checkbox = document.querySelector(`input[name="${ultimoDoctorEditado}"][value="${proc}"]`);
    if (checkbox) checkbox.checked = true;
  });
});

limpiarBtn.addEventListener("click", () => {
  doctorSelect.value = "";
  procedimientosContainer.innerHTML = "";
  resumenContainer.innerHTML = "";
  datosGuardados = {};
  guardarEnLocalStorage(currentFecha);
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
    box.textContent = `${doctor}: ${procList.join(", ")}`;
    resumenContainer.appendChild(box);
  }
}

function guardarEnLocalStorage(fecha) {
  const datos = {
    procedimientos: datosGuardados,
    ultimo: ultimoDoctorEditado
  };
  localStorage.setItem(`asistencia-usuario-${fecha}`, JSON.stringify(datos));
}

function cargarDesdeLocalStorage(fecha) {
  const datos = JSON.parse(localStorage.getItem(`asistencia-usuario-${fecha}`));
  datosGuardados = datos?.procedimientos || {};
  ultimoDoctorEditado = datos?.ultimo || "";
  actualizarResumen();
}