import React from "react";
import { Form, Upload, Row, Col, Button } from "antd";
import { FileImageFilled, CloseCircleFilled } from "@ant-design/icons";

import { BranchsContext } from "../../../../containers/Branchs";

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
            <>
              <img
                src={
                  typeof logo === "string" ? logo : URL.createObjectURL(logo)
                }
                alt="logo"
                width={"50px"}
              />
            </>
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
