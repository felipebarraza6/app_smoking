// Script de prueba completo para el flujo de clientes
// Ejecutar en la consola del navegador en la página de clientes

// Función para verificar el estado del contexto
function checkClientsState() {

  // Intentar acceder al contexto desde el DOM
  const clientsContainer =
    document.querySelector('[data-testid="clients-container"]') ||
    document.querySelector(".ant-table") ||
    document.querySelector('[class*="clients"]');

  if (clientsContainer) {

  } else {

  }

  // Verificar errores en la consola
  const errors = [];
  const originalError = console.error;
  console.error = (...args) => {
    errors.push(args);
    originalError.apply(console, args);
  };

  setTimeout(() => {

    console.error = originalError;
  }, 2000);
}

// Función para simular la respuesta del backend
function simulateBackendResponse() {

  const mockResponse = {
    results: [
      {
        id: 1,
        name: "Cliente Test 1",
        dni: "12345678-9",
        phone_number: "912345678",
        email: "cliente1@test.com",
        branch: {
          id: 1,
          business_name: "Sucursal Test 1",
        },
      },
      {
        id: 2,
        name: "Cliente Test 2",
        dni: "98765432-1",
        phone_number: "987654321",
        email: "cliente2@test.com",
        branch: {
          id: 2,
          business_name: "Sucursal Test 2",
        },
      },
    ],
    count: 2,
    branchs: [
      {
        id: 1,
        business_name: "Sucursal Test 1",
      },
      {
        id: 2,
        business_name: "Sucursal Test 2",
      },
    ],
  };

  // Verificar que el mapeo funcione
  const branchsArray = Array.isArray(mockResponse.branchs)
    ? mockResponse.branchs
    : [];
  const optionsBranchs = branchsArray.map((branch) => ({
    value: branch.id,
    label: branch.business_name,
  }));

  return mockResponse;
}

// Función para verificar la estructura de datos
function validateDataStructure(data) {

  const isValid = {
    results: Array.isArray(data.results),
    count: typeof data.count === "number",
    branchs: Array.isArray(data.branchs),
  };

  if (isValid.branchs && data.branchs.length > 0) {

  }

  return isValid;
}

// Función para verificar el renderizado
function checkRendering() {

  // Verificar si hay filtros
  const filters = document.querySelectorAll(
    'select, input[placeholder*="Sucursal"], input[placeholder*="Nombre"], input[placeholder*="Rut"]'
  );

  // Verificar si hay tabla
  const table = document.querySelector(".ant-table");

  // Verificar si hay formulario
  const form = document.querySelector("form");

  // Verificar si hay errores visibles
  const errorMessages = document.querySelectorAll(
    ".ant-message-error, .ant-notification-error"
  );

}

// Función principal de prueba
function runCompleteTest() {

  // 1. Verificar estado
  checkClientsState();

  // 2. Simular respuesta
  const mockData = simulateBackendResponse();

  // 3. Validar estructura
  validateDataStructure(mockData);

  // 4. Verificar renderizado
  setTimeout(() => {
    checkRendering();

  }, 1000);
}

// Exportar funciones para uso en consola
if (typeof window !== "undefined") {
  window.checkClientsState = checkClientsState;
  window.simulateBackendResponse = simulateBackendResponse;
  window.validateDataStructure = validateDataStructure;
  window.checkRendering = checkRendering;
  window.runCompleteTest = runCompleteTest;

  // Ejecutar prueba automáticamente después de 2 segundos
  setTimeout(runCompleteTest, 2000);
}
