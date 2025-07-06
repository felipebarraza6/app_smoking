import React, { useState } from "react";
import { Modal, Table, Button, Flex, Typography } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { columns } from "./columns/modal_history";
import { CloudDownloadOutlined, AlertOutlined } from "@ant-design/icons";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { downloadDataToExcel } from "./reports/history_product";
const { Text } = Typography;

const ModalHistory = ({ product }) => {
  const [modalHistory, setModalHistory] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const footerTable = () => {
    const createReport = async () => {
      await downloadDataToExcel(product, setLoadingButton);
    };
    return (
      <Flex justify="end">
        <Button
          icon={<CloudDownloadOutlined />}
          type="primary"
          loading={loadingButton}
          onClick={createReport}
        >
          historial_{product.name.toLowerCase()}.xlsx{" "}
          <PiMicrosoftExcelLogoFill />
        </Button>
      </Flex>
    );
  };

  return (
    <>
      <Modal
        title={`Historial  ${product.name}(${product.quantity} ${product.type_medition})`}
        open={modalHistory}
        width={1000}
        footer={null}
        onCancel={() => setModalHistory(false)}
      >
        {product.quantity < product.quantity_altert && (
          <Text>
            La cantidad de este producto es menor a la cantidad de alerta
          </Text>
        )}
        <Table
          bordered
          size="small"
          dataSource={product.history_product}
          columns={columns}
          rowKey={"id"}
          footer={footerTable}
        />
      </Modal>
      <Button
        size="small"
        type="primary"
        danger={product.quantity < product.quantity_altert}
        onClick={() => setModalHistory(true)}
        icon={<HistoryOutlined />}
      >
        {product.quantity} ({product.type_medition.toUpperCase()}){" "}
        {product.quantity < product.quantity_altert ? <AlertOutlined /> : null}
      </Button>
    </>
  );
};

export default ModalHistory;
