import React from "react";
import { Form, Upload, Row, Col, Button } from "antd";
import { FileImageFilled, CloseCircleFilled } from "@ant-design/icons";

import { BranchsContext } from "../../../../containers/Branchs";
import { DEVURL } from "../../../../api/config";

const UploadLogo = ({ form }) => {
  const { state, dispatch } = React.useContext(BranchsContext);

  let logo = state.form.logo;
  const setLogo = (logo) => {
    dispatch({
      type: "change_logo",
      payload: logo,
    });

    form.setFieldsValue({ logo: logo });
  };

  const setClear = () => {
    dispatch({
      type: "clear_logo",
    });
  };

  // Función para construir la URL completa del logo
  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    if (typeof logoPath !== "string") return URL.createObjectURL(logoPath);
    if (logoPath.startsWith("http")) return logoPath;

    // Construir URL completa usando la base URL de la API
    const baseUrl = DEVURL.replace("/api/", "");
    const cleanPath = logoPath.startsWith("/") ? logoPath : `/${logoPath}`;
    return `${baseUrl}${cleanPath}`;
  };

  return (
    <Row justify={"end"} gutter={[0, 10]}>
      <Col span={24}>
        <Upload.Dragger
          accept="image/*"
          listType="picture-card"
          showUploadList={false}
          beforeUpload={(file) => {
            setLogo(file);
            return false;
          }}
        >
          {logo ? (
            <div style={{ textAlign: "center" }}>
              <img
                src={getLogoUrl(logo)}
                alt="logo"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
                onError={(e) => {
                  console.log("Error loading image:", e.target.src);
                  e.target.style.display = "none";
                }}
              />
              <div style={{ fontSize: "12px", color: "#666" }}>
                {typeof logo === "string" ? "Logo actual" : "Nuevo logo"}
              </div>
            </div>
          ) : (
            <Row align={"middle"} justify={"center"}>
              <FileImageFilled
                style={{ fontSize: "30px", marginRight: "10px" }}
              />
              Subir logo
            </Row>
          )}
        </Upload.Dragger>
      </Col>
      <Col>
        {logo && (
          <Button
            icon={<CloseCircleFilled />}
            danger
            onClick={() => setClear(null)}
            size={"small"}
          >
            Eliminar
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default UploadLogo;
