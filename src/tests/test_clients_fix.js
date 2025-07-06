// Script de prueba para verificar que los cambios en clientes funcionen
// Ejecutar en la consola del navegador en la página de clientes

// Verificar que el contexto esté disponible
if (typeof window !== "undefined") {
  // Esperar a que la página cargue
  setTimeout(() => {

    // Verificar si hay errores en la consola
    const originalError = console.error;
    const errors = [];
    console.error = (...args) => {
      errors.push(args);
      originalError.apply(console, args);
    };

    // Verificar después de 2 segundos
    setTimeout(() => {

    }, 2000);
  }, 1000);
}

// Función para verificar el estado del contexto
function checkClientsState() {
  // Esta función se puede llamar desde la consola del navegador
  // para verificar el estado actual

}

// Función para simular la carga de datos
function simulateDataLoad() {

  // Simular respuesta de sucursales
  const mockBranchsResponse = {
    results: [
      { id: 1, business_name: "Sucursal Test 1" },
      { id: 2, business_name: "Sucursal Test 2" },
    ],
    count: 2,
  };

  // Verificar que el mapeo funcione
  const optionsBranchs = (mockBranchsResponse.results || []).map((branch) => ({
    value: branch.id,
    label: branch.business_name,
  }));

}

// Exportar funciones para uso en consola
if (typeof window !== "undefined") {
  window.checkClientsState = checkClientsState;
  window.simulateDataLoad = simulateDataLoad;
}
