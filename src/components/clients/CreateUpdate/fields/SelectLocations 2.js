import React, { useState, useEffect } from "react";
import { Select, Input, Form } from "antd";
import { FaMapMarkedAlt } from "react-icons/fa";
import { chileData } from "../../../../utils/geo";

import { rules } from "../rules_form";
import { FaRegMap } from "react-icons/fa";
import { FaMapSigns } from "react-icons/fa";
import { ClientsContext } from "../../../../containers/Clients";

const SelectLocations = ({ form }) => {
  const { state, dispatch } = React.useContext(ClientsContext);
  const [provinces, setProvinces] = React.useState([]);
  const [communes, setCommunes] = React.useState([]);
  const [address, setAddress] = useState(false);
  const rules_items = rules(state);

  const handleRegionSelect = (select) => {
    const region = chileData.regiones.find(
      (region) => region.nombre === select
    );
    form.resetFields(["province"]);
    form.resetFields(["commune"]);
    setAddress(false);
    dispatch({
      type: "change_form",
      payload: {
        province: true,
      },
    });
    setProvinces(region.provincias);
  };

  const handleProvinceSelect = (province) => {
    const selectedProvince = provinces.find((p) => p.nombre === province);
    form.resetFields(["commune"]);
    setAddress(false);
    dispatch({
      type: "change_form",
      payload: {
        commune: true,
        province: true,
      },
    });
    setCommunes(selectedProvince.comunas);
  };

  const handleCommuneSelect = (commune) => {
    setAddress(true);
  };
  useEffect(() => {
    if (state.select_to_edit !== null) {
    }
  }, [state.select_to_edit]);

  useEffect(() => {
    if (state.select_to_edit !== null) {
      setAddress(true);
      const region = chileData.regiones.find(
        (region) => region.nombre === state.select_to_edit.region
      );
      setProvinces(region.provincias);
      const selectedProvince = region.provincias.find(
        (province) => province.nombre === state.select_to_edit.province
      );
      setCommunes(selectedProvince.comunas);
    } else {
      setAddress(false);
    }
  }, [state.select_to_edit]);

  return (
    <>
      <Form.Item name="region" rules={rules_items.region}>
        <Select
          placeholder="Región"
          style={{ textAlign: "left" }}
          showSearch
          suffixIcon={<FaMapMarkedAlt />}
          onSelect={handleRegionSelect}
          options={chileData.regiones.map((region) => ({
            label: region.nombre,
            value: region.nombre,
          }))}
        />
      </Form.Item>
      {state.form.province && (
        <Form.Item name={"province"} rules={rules_items.province}>
          <Select
            placeholder="Provincia"
            showSearch
            suffixIcon={<FaRegMap />}
            onSelect={handleProvinceSelect}
            options={provinces.map((province) => ({
              label: province.nombre,
              value: province.nombre,
            }))}
          />
        </Form.Item>
      )}
      {state.form.commune && (
        <Form.Item
          name={"commune"}
          style={{ textAlign: "left" }}
          rules={rules_items.commune}
        >
          <Select
            placeholder="Comuna"
            showSearch
            suffixIcon={<FaMapSigns />}
            onSelect={handleCommuneSelect}
            options={communes.map((commune) => ({
              label: commune,
              value: commune,
            }))}
          />
        </Form.Item>
      )}
      {address && (
        <Form.Item name={"address"} rules={rules_items.address}>
          <Input.TextArea placeholder={"Dirección"} />
        </Form.Item>
      )}
    </>
  );
};

export default SelectLocations;
