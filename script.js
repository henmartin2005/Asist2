// Desactiva todos los checkboxes por defecto
document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.disabled = true;
      cb.addEventListener("change", () => {
        document.getElementById("salvarBtn").disabled = false;
      });
    });
  });
  
  function habilitarEdicion() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = false);
    document.getElementById("salvarBtn").disabled = true;
  }
  
  function guardarCambios() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = true);
    document.getElementById("salvarBtn").disabled = true;
  
    alert("Cambios guardados (aquí puedes conectar con backend o mostrar confirmación)");
  }
  