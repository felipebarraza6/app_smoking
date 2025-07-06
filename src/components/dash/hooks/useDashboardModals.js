import { useState, useCallback } from "react";
import api from "../../../api/endpoints";
import dayjs from "dayjs";

export const useDashboardModals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetailVisible, setPaymentDetailVisible] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptType, setReceiptType] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);

  const handleCardClick = useCallback(async (type, indicator = null) => {
    setModalType(type);
    setModalVisible(true);
    setModalLoading(true);
    setSelectedPaymentType(indicator); // Para pagos específicos por tipo

    try {
      // Aquí podrías agregar lógica para obtener datos específicos del modal
      // Por ahora, solo abrimos el modal
      console.log(
        `Opening modal for ${type}`,
        indicator ? `with indicator: ${indicator}` : ""
      );

      // Simular carga de datos
      setTimeout(() => {
        setModalData([]);
        setModalLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching modal data:", error);
      setModalData([]);
      setModalLoading(false);
    }
  }, []);

  const handleModalPageChange = useCallback(
    async (page) => {
      if (!modalType) return;

      setModalLoading(true);
      try {
        const params = {
          type: modalType.type,
          indicator: modalType.indicator,
          page: page,
        };

        const response = await api.dashboard.detail(params);
        setModalData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching modal data:", error);
      } finally {
        setModalLoading(false);
      }
    },
    [modalType]
  );

  const handleRowClick = useCallback(async (record) => {
    setSelectedOrder(record);
    setDetailVisible(true);
  }, []);

  const fetchOrderById = useCallback(async (orderId) => {
    try {
      const response = await api.orders.detail(orderId);
      return response;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setModalType("");
    setModalData([]);
    setSelectedPaymentType(null);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailVisible(false);
    setSelectedOrder(null);
  }, []);

  const closePaymentDetailModal = useCallback(() => {
    setPaymentDetailVisible(false);
    setSelectedPayment(null);
  }, []);

  const closeReceiptModal = useCallback(() => {
    setReceiptVisible(false);
    setReceiptType(null);
  }, []);

  return {
    // Estados
    modalVisible,
    modalType,
    modalData,
    modalLoading,
    selectedOrder,
    detailVisible,
    selectedPayment,
    paymentDetailVisible,
    receiptVisible,
    receiptType,
    selectedPaymentType,

    // Funciones
    handleCardClick,
    handleModalPageChange,
    handleRowClick,
    fetchOrderById,
    handleModalClose,
    closeDetailModal,
    closePaymentDetailModal,
    closeReceiptModal,
    setModalVisible,
    setDetailVisible,
    setPaymentDetailVisible,
    setReceiptVisible,
    setReceiptType,
    setSelectedPayment,
  };
};
