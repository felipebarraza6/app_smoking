/**
 * Utilidades de validación para el sistema de usuarios y sucursales
 */

/**
 * Valida que un objeto tenga las propiedades requeridas
 * @param {Object} obj - Objeto a validar
 * @param {Array} requiredProps - Array de propiedades requeridas
 * @returns {Object} - { isValid: boolean, missingProps: Array }
 */
export const validateRequiredProps = (obj, requiredProps) => {
  const missingProps = requiredProps.filter(
    (prop) => !obj || obj[prop] === undefined || obj[prop] === null
  );
  return {
    isValid: missingProps.length === 0,
    missingProps,
  };
};

/**
 * Valida que un array sea válido y no esté vacío
 * @param {Array} array - Array a validar
 * @returns {boolean}
 */
export const isValidArray = (array) => {
  return Array.isArray(array) && array.length > 0;
};

/**
 * Valida que un email tenga formato válido
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que un RUT chileno sea válido
 * @param {string} rut - RUT a validar
 * @returns {boolean}
 */
export const isValidRUT = (rut) => {
  if (!rut) return false;

  // Limpiar el RUT de puntos y guión
  const cleanRut = rut.replace(/[.-]/g, "");

  if (cleanRut.length < 2) return false;

  // Separar número y dígito verificador
  const number = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;

  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = 11 - (sum % 11);
  const calculatedDv =
    expectedDv === 11 ? "0" : expectedDv === 10 ? "K" : expectedDv.toString();

  return dv === calculatedDv;
};

/**
 * Valida que un rol de usuario sea válido
 * @param {string} role - Rol a validar
 * @returns {boolean}
 */
export const isValidUserRole = (role) => {
  const validRoles = ["OWNER", "ADMIN", "MANAGER", "EMPLOYEE", "VIEWER"];
  return validRoles.includes(role);
};

/**
 * Valida que una sucursal tenga los datos mínimos requeridos
 * @param {Object} branch - Objeto de sucursal
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validateBranch = (branch) => {
  const errors = [];

  if (!branch) {
    errors.push("La sucursal es requerida");
    return { isValid: false, errors };
  }

  if (!branch.business_name || branch.business_name.trim().length === 0) {
    errors.push("El nombre de la sucursal es requerido");
  }

  if (!branch.phone || branch.phone.trim().length === 0) {
    errors.push("El teléfono es requerido");
  }

  if (!branch.email || !isValidEmail(branch.email)) {
    errors.push("El email es requerido y debe ser válido");
  }

  if (!branch.dni || !isValidRUT(branch.dni)) {
    errors.push("El RUT es requerido y debe ser válido");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida que un usuario tenga los datos mínimos requeridos
 * @param {Object} user - Objeto de usuario
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validateUser = (user) => {
  const errors = [];

  if (!user) {
    errors.push("El usuario es requerido");
    return { isValid: false, errors };
  }

  if (!user.first_name || user.first_name.trim().length === 0) {
    errors.push("El nombre es requerido");
  }

  if (!user.last_name || user.last_name.trim().length === 0) {
    errors.push("El apellido es requerido");
  }

  if (!user.email || !isValidEmail(user.email)) {
    errors.push("El email es requerido y debe ser válido");
  }

  if (!user.dni || !isValidRUT(user.dni)) {
    errors.push("El RUT es requerido y debe ser válido");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida que una invitación a sucursal tenga los datos requeridos
 * @param {Object} invitation - Objeto de invitación
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validateBranchInvitation = (invitation) => {
  const errors = [];

  if (!invitation) {
    errors.push("Los datos de invitación son requeridos");
    return { isValid: false, errors };
  }

  if (!invitation.email || !isValidEmail(invitation.email)) {
    errors.push("El email es requerido y debe ser válido");
  }

  if (!invitation.role || !isValidUserRole(invitation.role)) {
    errors.push("El rol es requerido y debe ser válido");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitiza un string removiendo caracteres peligrosos
 * @param {string} str - String a sanitizar
 * @returns {string}
 */
export const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
};

/**
 * Formatea un RUT chileno
 * @param {string} rut - RUT sin formato
 * @returns {string}
 */
export const formatRUT = (rut) => {
  if (!rut) return "";

  // Remover todos los caracteres no numéricos excepto K
  const cleanRut = rut.replace(/[^0-9Kk]/g, "");

  if (cleanRut.length < 2) return cleanRut;

  // Separar número y dígito verificador
  const number = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  // Formatear número con puntos
  let formattedNumber = "";
  for (let i = number.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formattedNumber = "." + formattedNumber;
    }
    formattedNumber = number[i] + formattedNumber;
  }

  return `${formattedNumber}-${dv}`;
};
