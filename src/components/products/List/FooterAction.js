import React, { useContext, useState } from "react";
import { Button, Row, Card, Tag } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { ProductsContext } from "../../../containers/Products";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { downloadDataToExcel } from "./reports/products";

const FooterAction = () => {
  const { state } = useContext(ProductsContext);
  const [loadingButton, setLoadingButton] = useState(false);

  const getDownloadData = () => {
    downloadDataToExcel(state, setLoadingButton);
  };

  const gutterRow = [{}, { xs: 24, sm: 16, md: 24, lg: 32 }];
  return (
    <Row justify={"space-between"} align={"middle"} gutter={gutterRow}>
      <Tag>Productos: {state.list.count}</Tag>
      <Button
        loading={loadingButton}
        icon={<CloudDownloadOutlined />}
        onClick={getDownloadData}
        type="primary"
      >
        productos.xlsx <PiMicrosoftExcelLogoFill />
      </Button>
    </Row>
  );
};

export default FooterAction;
