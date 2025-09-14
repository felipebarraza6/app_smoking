import React, { useState, useEffect } from "react";
import { Select, Button, Flex, Form, DatePicker, Modal } from "antd";
import { ReloadOutlined, CalendarOutlined } from "@ant-design/icons";
import api from "../../../../api/endpoints";
import { useBreakpoint } from "../../../../utils/breakpoints";
import dayjs from "dayjs";
import BranchSelector from "../../../common/BranchSelector";

const initialFilterState = {
  branch: null,
  startDate: null,
  endDate: null,
  status: "all",
  delivery: "all",
};

const FilterOrder = ({ filter, setFilter }) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const [showDesdeModal, setShowDesdeModal] = useState(false);
  const [showHastaModal, setShowHastaModal] = useState(false);
  const [tempDesde, setTempDesde] = useState(
    filter.startDate ? dayjs(filter.startDate) : null
  );
  const [tempHasta, setTempHasta] = useState(
    filter.endDate ? dayjs(filter.endDate) : null
  );

  const [form] = Form.useForm();

  const handleDateRangeChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setFilter({
        ...filter,
        startDate: dates[0] ? dates[0].format("YYYY-MM-DD") : null,
        endDate: dates[1] ? dates[1].format("YYYY-MM-DD") : null,
      });
    } else {
      setFilter({ ...filter, startDate: null, endDate: null });
    }
  };

  const filterConfig = [
    {
      key: "status",
      type: "select",
      placeholder: "Estado",
      options: [
        { label: "Todos", value: "all" },
        { label: "Pagados", value: "active" },
        { label: "Pendientes", value: "inactive" },
      ],
      style: { width: isMobile ? "100%" : 120, marginRight: 10 },
      onChange: (value) => setFilter({ ...filter, status: value }),
    },
    {
      key: "delivery",
      type: "select",
      placeholder: "Reparto",
      options: [
        { label: "Todos", value: "all" },
        { label: "Con reparto", value: "active" },
        { label: "Sin reparto", value: "inactive" },
      ],
      style: { width: isMobile ? "100%" : 120 },
      onChange: (value) => setFilter({ ...filter, delivery: value }),
    },
  ];

  return (
    <Flex style={{ width: "100%" }} gap="16px" wrap vertical={isMobile}>
      {/* Selector de fechas */}
      {isMobile ? (
        <Flex style={{ width: "100%", marginBottom: 12 }} vertical>
          <Flex gap={8} style={{ width: "100%" }}>
            <Button
              style={{
                width: "50%",
                borderRadius: 8,
                border: "1.5px solid #444",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onClick={() => setShowDesdeModal(true)}
              icon={<CalendarOutlined />}
            >
              {filter.startDate
                ? ` ${
                    filter.startDate
                      ? dayjs(filter.startDate).format("DD/MM/YYYY")
                      : ""
                  }`
                : "Desde"}
            </Button>
            <Button
              style={{
                width: "50%",
                borderRadius: 8,
                border: "1.5px solid #444",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onClick={() => setShowHastaModal(true)}
              icon={<CalendarOutlined />}
            >
              {filter.endDate
                ? ` ${
                    filter.endDate
                      ? dayjs(filter.endDate).format("DD/MM/YYYY")
                      : ""
                  }`
                : "Hasta"}
            </Button>
          </Flex>
          {/* Modal para seleccionar fecha DESDE */}
          <Modal
            open={showDesdeModal}
            onCancel={() => setShowDesdeModal(false)}
            footer={null}
            width="100vw"
            style={{ top: 40, padding: 0 }}
            bodyStyle={{ padding: "32px 0 0 0" }}
            centered
            closeIcon={
              <span
                style={{
                  fontSize: 28,
                  color: "#fff",
                  background: "#222",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 10,
                  right: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                ×
              </span>
            }
          >
            <DatePicker
              style={{ width: "100%", padding: 16 }}
              value={tempDesde}
              onChange={(val) => {
                setTempDesde(val);
                setShowDesdeModal(false);
                if (val && tempHasta) {
                  setFilter({
                    ...filter,
                    startDate: val ? val.format("YYYY-MM-DD") : null,
                    endDate: tempHasta ? tempHasta.format("YYYY-MM-DD") : null,
                  });
                }
              }}
              format="DD/MM/YYYY"
              autoFocus
              allowClear
              disabledDate={(d) => tempHasta && d > tempHasta}
            />
          </Modal>
          {/* Modal para seleccionar fecha HASTA */}
          <Modal
            open={showHastaModal}
            onCancel={() => setShowHastaModal(false)}
            footer={null}
            width="100vw"
            style={{ top: 40, padding: 0 }}
            bodyStyle={{ padding: "32px 0 0 0" }}
            centered
            closeIcon={
              <span
                style={{
                  fontSize: 28,
                  color: "#fff",
                  background: "#222",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 10,
                  right: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                ×
              </span>
            }
          >
            <DatePicker
              style={{ width: "100%", padding: 16 }}
              value={tempHasta}
              onChange={(val) => {
                setTempHasta(val);
                setShowHastaModal(false);
                if (tempDesde && val) {
                  setFilter({
                    ...filter,
                    startDate: tempDesde
                      ? tempDesde.format("YYYY-MM-DD")
                      : null,
                    endDate: val ? val.format("YYYY-MM-DD") : null,
                  });
                }
              }}
              format="DD/MM/YYYY"
              autoFocus
              allowClear
              disabledDate={(d) => tempDesde && d < tempDesde}
            />
          </Modal>
        </Flex>
      ) : (
        <DatePicker.RangePicker
          style={{ width: 300, marginRight: 10 }}
          value={
            filter.startDate && filter.endDate
              ? [dayjs(filter.startDate), dayjs(filter.endDate)]
              : null
          }
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
        />
      )}

      {/* Otros filtros */}
      <Form
        layout={isMobile ? "vertical" : "inline"}
        style={{ width: "100%" }}
        form={form}
      >
        {/* BranchSelector */}
        <Form.Item style={{ marginRight: 16, marginBottom: 16 }}>
          <BranchSelector
            placeholder="Selecciona sucursal"
            value={filter.branch}
            onChange={(value) => {
              if (!value || value === "all") {
                setFilter({ ...filter, branch: null });
              } else if (Array.isArray(value)) {
                setFilter({ ...filter, branch: value[0] });
              } else {
                setFilter({ ...filter, branch: value });
              }
            }}
            showRole={true}
            style={{ width: isMobile ? "100%" : 200 }}
            mode={undefined}
            hookOptions={{
              includeAllOption: true,
              showRoles: true,
              filterByRole: null,
            }}
          />
        </Form.Item>

        {filterConfig.map((item) => (
          <Form.Item
            key={item.key}
            style={{ marginRight: 16, marginBottom: 16 }}
            name={item.key}
          >
            <Select
              placeholder={item.placeholder}
              options={item.options}
              style={item.style}
              onChange={item.onChange}
            />
          </Form.Item>
        ))}
        <Form.Item>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => {
              form.resetFields();
              setFilter(initialFilterState);
              setTempDesde(null);
              setTempHasta(null);
            }}
          >
            Reiniciar
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default FilterOrder;
