import api from "../../../../api/endpoints";
import * as XLSX from "xlsx";

export const downloadDataToExcel = async (state, setLoadingButton) => {
  setLoadingButton(true); // Set loading to true when the operation starts

  try {
    // Función para obtener los datos de una página específica
    const getDataPage = async (page) => {
      const rq = await api.clients.list(page, state.filters);
      return rq.results;
    };

    const pageSize = 10; // Número de elementos por página
    const totalItems = state.list.count; // Total de elementos
    const totalPages = Math.ceil(totalItems / pageSize); // Total de páginas
    let allData = []; // Array para almacenar todos los datos

    // Obtener los datos de todas las páginas
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const pageData = await getDataPage(currentPage);
      allData = allData.concat(pageData);
    }

    // Dividir los datos en lotes más pequeños
    const filteredData = allData.map((item) => ({
      Nombre: item.name,
      Rut: item.dni,
      "Fecha de creación": item.created,
      "Giro comercial": item.commercial_business,
      Teléfono: item.phone_number,
      Email: item.email,
      Region: item.region,
      Provincia: item.province,
      Comuna: item.commune,
      Dirección: item.address,
      Sucursal: item.branch.business_name,
      Estado: item.is_active ? "Activo" : "Inactivo",
    }));

    // Crear el archivo Excel y descargarlo
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Set column widths based on the length of the title text
    const columnWidths = Object.keys(worksheet).reduce((widths, cell) => {
      const column = cell.replace(/[0-9]/g, "");
      const value = worksheet[cell].v;
      const length = value ? value.toString().length : 10; // Default width if value is empty
      widths[column] = Math.max(widths[column] || 0, length);
      return widths;
    }, {});

    // Apply column widths to the worksheets
    worksheet["!cols"] = Object.keys(columnWidths).map((column) => ({
      wch: columnWidths[column],
    }));

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

    // Agregar un retraso de 3 segundos antes de descargar el archivo
    setTimeout(() => {
      XLSX.writeFile(workbook, `clientes.xlsx`);
      setLoadingButton(false); // Set loading to false when the operation ends
    }, 1500);
  } catch (error) {
    setLoadingButton(false); // Set loading to false in case of error
  }
};
