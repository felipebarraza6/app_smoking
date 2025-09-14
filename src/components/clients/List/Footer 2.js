import React, { useContext, useState } from "react";
import { Tag, Row, Button } from "antd";
import { ClientsContext } from "../../../containers/Clients";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { downloadDataToExcel } from "./reports/clients";
const Footer = () => {
  const { state } = useContext(ClientsContext);
  const [loadingButton, setLoadingButton] = useState(false);
  const gutterRow = [{}, { xs: 24, sm: 16, md: 24, lg: 32 }];

  const getDownloadData = () => {
    downloadDataToExcel(state, setLoadingButton);
  };
  return (
    <Row justify={"space-between"} align={"middle"} gutter={gutterRow}>
      <Tag>Clientes: {state.list.count}</Tag>
      <Button
        loading={loadingButton}
        icon={<CloudDownloadOutlined />}
        onClick={getDownloadData}
        type="primary"
      >
        clientes.xlsx <PiMicrosoftExcelLogoFill />
      </Button>
    </Row>
  );
};

export default Footer;
