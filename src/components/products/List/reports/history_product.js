import * as XLSX from "xlsx";

export const downloadDataToExcel = async (state, setLoadingButton) => {
  try {
    setLoadingButton(true); // Set loading to true when the operation starts

    const allData = state.history_product;

    // Dividir los datos en lotes más pequeños
    const filteredData = allData.map((item) => ({
      Fecha:
        item.created.slice(0, 10) + " " + item.created.slice(11, 16) + " hrs",
      Cantidad: item.quantity,
      Usuario: item.user.email,
      Tipo: item.is_sale_order ? "Orden/Venta" : "Gestión de inventario",
    }));
    filteredData.push({
      Fecha: "Total",
      Cantidad: allData.reduce((total, item) => total + item.quantity, 0),
      Usuario: "",
      Tipo: "",
    });

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
      XLSX.writeFile(workbook, `listado_${state.name.toLowerCase()}.xlsx`);
      setLoadingButton(false); // Set loading to false when the operation ends
    }, 1500);
  } catch (error) {

    setLoadingButton(false); // Set loading to false in case of error
  }
};
