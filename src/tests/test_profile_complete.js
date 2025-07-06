// Script de prueba completo para el flujo del perfil
// Ejecutar en la consola del navegador en la página de perfil

// Función para verificar el estado del usuario
function checkUserState() {

  // Verificar localStorage
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (userStr) {
    try {
      const user = JSON.parse(userStr);

      console.log("Campos del usuario:", Object.keys(user));
    } catch (error) {

    }
  }

  // Verificar si hay errores en la consola
  const errors = [];
  const originalError = console.error;
  console.error = (...args) => {
    errors.push(args);
    originalError.apply(console, args);
  };

  setTimeout(() => {

    console.error = originalError;
  }, 3000);
}

// Función para verificar las peticiones de red
function checkNetworkRequests() {

  // Interceptar peticiones fetch
  const originalFetch = window.fetch;
  const requests = [];

  window.fetch = (...args) => {
    const url = args[0];
    requests.push({
      url: url,
      timestamp: new Date().toISOString(),
    });

    return originalFetch.apply(window, args);
  };

  setTimeout(() => {

    window.fetch = originalFetch;
  }, 5000);
}

// Función para verificar el renderizado del perfil
function checkProfileRendering() {

  // Verificar elementos del perfil
  const profileElements = {
    title: document.querySelector("h1"),
    infoPersonal: document.querySelector('[class*="InfoPersonal"]'),
    seguridad: document.querySelector('[class*="Seguridad"]'),
    invitaciones: document.querySelector('[class*="InvitationsSection"]'),
    sucursales: document.querySelector('[class*="MyBranchesSection"]'),
  };

  Object.entries(profileElements).forEach(([key, element]) => {

  });

  // Verificar formularios
  const forms = document.querySelectorAll("form");

  // Verificar botones
  const buttons = document.querySelectorAll("button");

  // Verificar mensajes de error
  const errorMessages = document.querySelectorAll(
    ".ant-message-error, .ant-notification-error"
  );

}

// Función para simular datos de prueba
function simulateTestData() {

  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    first_name: "Usuario",
    last_name: "Test",
    dni: "12345678-9",
    type_user: "ADM",
    created: "2024-01-01T00:00:00Z",
  };

  const mockBranches = [
    {
      id: 1,
      branch: {
        id: 1,
        business_name: "Sucursal Test 1",
        address: "Dirección 1",
        commune: "Comuna 1",
        phone: "912345678",
      },
      role: "OWNER",
      accepted_at: "2024-01-01T00:00:00Z",
    },
  ];

  const mockInvitations = [
    {
      id: 1,
      branch: {
        id: 2,
        business_name: "Sucursal Test 2",
        address: "Dirección 2",
        commune: "Comuna 2",
        phone: "987654321",
      },
      role: "EMPLOYEE",
      invited_by_name: "Admin",
      invited_at: "2024-01-01T00:00:00Z",
    },
  ];

  return { mockUser, mockBranches, mockInvitations };
}

// Función para verificar la funcionalidad
function checkFunctionality() {

  // Verificar si los botones están habilitados
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button, index) => {
    const isDisabled = button.disabled;
    const text = button.textContent;

  });

  // Verificar si los inputs están habilitados
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    const isDisabled = input.disabled;
    const placeholder = input.placeholder;

  });
}

// Función principal de prueba
function runProfileTest() {

  // 1. Verificar estado del usuario
  checkUserState();

  // 2. Verificar peticiones de red
  checkNetworkRequests();

  // 3. Simular datos de prueba
  const testData = simulateTestData();

  // 4. Verificar renderizado
  setTimeout(() => {
    checkProfileRendering();
  }, 2000);

  // 5. Verificar funcionalidad
  setTimeout(() => {
    checkFunctionality();

  }, 4000);
}

// Exportar funciones para uso en consola
if (typeof window !== "undefined") {
  window.checkUserState = checkUserState;
  window.checkNetworkRequests = checkNetworkRequests;
  window.checkProfileRendering = checkProfileRendering;
  window.simulateTestData = simulateTestData;
  window.checkFunctionality = checkFunctionality;
  window.runProfileTest = runProfileTest;

  // Ejecutar prueba automáticamente después de 3 segundos
  setTimeout(runProfileTest, 3000);
}
