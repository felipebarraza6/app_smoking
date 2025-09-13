import React, { useContext, useEffect, useState, useCallback } from "react";
import { Form, Input, Button, Flex, App, Select, Space } from "antd";
import {
  ClearOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  PhoneOutlined,
  MailOutlined,
  ContactsOutlined,
  ArrowLeftOutlined,
  RetweetOutlined,
  IdcardOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { ClientsContext } from "../../../../containers/Clients";
import { AppContext } from "../../../../App";
import { controller } from "../../../../controllers/clients";
import { jobTitles } from "../../../../api/endpoints/clients";
import JobTitleManagementModal from "./modals/JobTitleManagementModal";

const { Option } = Select;

const CreateUpdate = ({ setOpenSecond, client }) => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(ClientsContext);
  const { state: appState } = useContext(AppContext);
  const { notification } = App.useApp();

  // ✅ Debug: Ver información del cliente
  console.log("🔍 CreateUpdate - client:", client);
  console.log("🔍 CreateUpdate - client.branch:", client?.branch);
  console.log("🔍 CreateUpdate - state.branchs:", state.branchs);
  console.log("🔍 CreateUpdate - appState.branches:", appState?.branches);

  // ✅ Estado para cargos dinámicos
  const [jobTitlesList, setJobTitlesList] = useState([]);
  const [loadingJobTitles, setLoadingJobTitles] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);

  // ✅ Estado para modales de gestión
  const [showJobTitleModal, setShowJobTitleModal] = useState(false);

  // ✅ Validación de teléfono actualizada según backend
  const validatePhone = (_, value) => {
    if (!value) return Promise.resolve();

    const phoneRegex = /^\+?1?\d{9,15}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error("Formato: +56912345678"));
    }
    return Promise.resolve();
  };

  // ✅ Validación de RUT chileno
  const validateRUT = (_, value) => {
    if (!value) return Promise.resolve();

    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/;
    if (!rutRegex.test(value)) {
      return Promise.reject(new Error("Formato: 12.345.678-9"));
    }
    return Promise.resolve();
  };

  // ✅ Cargar cargos dinámicos
  const loadJobTitles = useCallback(async () => {
    try {
      setLoadingJobTitles(true);
      const currentBranch =
        client?.branch || state.branchs?.[0] || appState?.branches?.[0];
      const filters = currentBranch
        ? { branch: currentBranch.id, is_active: true }
        : { is_active: true };

      console.log("🔍 loadJobTitles - currentBranch:", currentBranch);
      console.log("🔍 loadJobTitles - currentBranch.id:", currentBranch?.id);
      console.log("🔍 loadJobTitles - filters:", filters);

      const response = await jobTitles.list(filters);
      console.log("🔍 loadJobTitles - response:", response);
      console.log("🔍 loadJobTitles - response.results:", response.results);
      console.log(
        "🔍 loadJobTitles - response.results length:",
        response.results?.length
      );

      setJobTitlesList(response.results || []);
      console.log(
        "🔍 loadJobTitles - jobTitlesList after setState:",
        response.results || []
      );
    } catch (error) {
      console.error("Error loading job titles:", error);
      notification.error({
        message: "Error al cargar cargos",
        description: "No se pudieron cargar los cargos disponibles",
      });
    } finally {
      setLoadingJobTitles(false);
    }
  }, [client?.branch, state.branchs, appState?.branches, notification]);

  // ✅ Función para recargar cargos después de crear/editar
  const handleJobTitleCreated = () => {
    loadJobTitles();
  };

  useEffect(() => {
    // ✅ Cargar cargos al montar el componente
    loadJobTitles();
  }, [loadJobTitles]);

  // ✅ Efecto para establecer valores del formulario cuando hay un contacto para editar
  useEffect(() => {
    if (state.contacts.select_to_edit) {
      console.log("🔍 CONTACT TO EDIT:", state.contacts.select_to_edit);

      // ✅ Mapear campos del backend al frontend
      const editData = {
        first_name: state.contacts.select_to_edit.first_name,
        last_name: state.contacts.select_to_edit.last_name,
        dni: state.contacts.select_to_edit.dni,
        email: state.contacts.select_to_edit.email,
        phone: state.contacts.select_to_edit.phone,
        contact_type: state.contacts.select_to_edit.contact_type,
      };

      console.log("🔍 SETTING FORM VALUES:", editData);
      form.setFieldsValue(editData);
    } else {
      form.resetFields();
      setSelectedJobTitle(null);
    }
  }, [state.contacts.select_to_edit, form]);

  // ✅ Efecto para establecer el job_title cuando se cargan los cargos disponibles
  useEffect(() => {
    if (state.contacts.select_to_edit && jobTitlesList.length > 0) {
      console.log(
        "🔍 SETTING JOB_TITLE - Contact:",
        state.contacts.select_to_edit
      );
      console.log("🔍 SETTING JOB_TITLE - Available jobs:", jobTitlesList);

      // ✅ Obtener el ID del job_title del contacto
      let jobTitleId = null;

      if (state.contacts.select_to_edit.job_title) {
        if (typeof state.contacts.select_to_edit.job_title === "object") {
          jobTitleId = state.contacts.select_to_edit.job_title.id;
        } else {
          jobTitleId = state.contacts.select_to_edit.job_title;
        }
      }

      console.log("🔍 SETTING JOB_TITLE - Extracted ID:", jobTitleId);

      if (jobTitleId) {
        // ✅ Verificar que el cargo existe en la lista
        const jobTitleExists = jobTitlesList.some(
          (jt) => jt.id === jobTitleId || jt.id === String(jobTitleId)
        );

        console.log("🔍 SETTING JOB_TITLE - Exists in list:", jobTitleExists);

        if (jobTitleExists) {
          // ✅ Establecer el valor usando setTimeout para asegurar timing
          setTimeout(() => {
            form.setFieldValue("job_title", jobTitleId);
            setSelectedJobTitle(jobTitleId);
            console.log("🔍 SETTING JOB_TITLE - Set successfully:", jobTitleId);
            console.log(
              "🔍 SETTING JOB_TITLE - Form value after set:",
              form.getFieldValue("job_title")
            );
          }, 50);
        } else {
          console.log("🔍 SETTING JOB_TITLE - Job title not found in list");
        }
      } else {
        console.log("🔍 SETTING JOB_TITLE - No job title ID found");
      }
    }
  }, [jobTitlesList, state.contacts.select_to_edit, form]);

  const clearOrBack = () => {
    if (state.contacts.select_to_edit) {
      controller.list_table.contacts.select_edit(null, dispatch);
      setOpenSecond(false);
    } else {
      form.resetFields();
    }
  };

  const onFinish = (values) => {
    // ✅ Debug: Ver qué valores se están enviando
    console.log("🔍 FORM VALUES:", values);
    console.log("🔍 JOB_TITLE VALUE:", values.job_title);
    console.log("🔍 JOB_TITLE TYPE:", typeof values.job_title);

    // ✅ Debug: Ver el estado del formulario
    console.log("🔍 FORM STATE:", form.getFieldsValue());
    console.log("🔍 FORM JOB_TITLE:", form.getFieldValue("job_title"));

    // ✅ Obtener sucursal: primero del cliente, luego del contexto
    const currentBranch =
      client?.branch || state.branchs?.[0] || appState?.branches?.[0];

    console.log("🔍 Using branch from client.branch:", client?.branch);
    console.log("🔍 Using branch from state.branchs:", state.branchs);
    console.log("🔍 Using branch from appState.branches:", appState?.branches);
    console.log("🔍 Final currentBranch:", currentBranch);

    if (!currentBranch) {
      notification.error({
        message: "Error de sucursal",
        description: "No se pudo determinar la sucursal actual",
      });
      return;
    }

    if (state.contacts.select_to_edit) {
      // Actualizar contacto existente
      const updateData = {
        ...values,
        id: state.contacts.select_to_edit.id,
        client: client.id,
        branch: currentBranch.id,
        job_title: values.job_title || null,
      };

      console.log("🔍 UPDATE DATA:", updateData);
      console.log("🔍 UPDATE JOB_TITLE:", updateData.job_title);
      console.log("🔍 UPDATE JOB_TITLE TYPE:", typeof updateData.job_title);
      console.log("🔍 FORM VALUES:", values);

      controller.list_table.contacts.update(
        updateData,
        dispatch,
        notification,
        setOpenSecond
      );

      // ✅ Recargar listas después de actualizar contacto
      loadJobTitles();
    } else {
      // Crear nuevo contacto
      const createData = {
        ...values,
        client: client.id,
        branch: currentBranch.id,
        job_title: values.job_title || null,
      };

      console.log("🔍 CREATE DATA:", createData);
      console.log("🔍 CREATE JOB_TITLE:", createData.job_title);
      console.log("🔍 CREATE JOB_TITLE TYPE:", typeof createData.job_title);

      controller.list_table.contacts.create(
        createData,
        dispatch,
        notification,
        setOpenSecond
      );
      form.resetFields();

      // ✅ Recargar listas después de crear contacto
      loadJobTitles();
    }
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={(errorInfo) => {
          console.log("🔍 FORM VALIDATION FAILED:", errorInfo);
          console.log("🔍 FORM ERRORS:", errorInfo.errorFields);
        }}
        layout="vertical"
      >
        {/* ✅ Nombre separado en first_name y last_name */}
        <Form.Item
          name="first_name"
          label="Nombre"
          rules={[{ required: true, message: "Ingresa el nombre" }]}
        >
          <Input placeholder="Nombre" prefix={<ContactsOutlined />} />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Apellido"
          rules={[{ required: true, message: "Ingresa el apellido" }]}
        >
          <Input placeholder="Apellido" prefix={<ContactsOutlined />} />
        </Form.Item>

        {/* ✅ RUT/DNI con validación específica */}
        <Form.Item
          name="dni"
          label="RUT/DNI"
          rules={[{ validator: validateRUT }]}
        >
          <Input
            placeholder="12.345.678-9"
            prefix={<IdcardOutlined />}
            maxLength={12}
          />
        </Form.Item>

        {/* ✅ Teléfono con validación del backend */}
        <Form.Item
          name="phone"
          label="Teléfono"
          rules={[{ validator: validatePhone }]}
        >
          <Input
            placeholder="+56912345678"
            prefix={<PhoneOutlined />}
            maxLength={15}
          />
        </Form.Item>

        {/* ✅ Email sin cambios */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: "email", message: "Ingresa un email válido" },
            { required: true, message: "El email es obligatorio" },
          ]}
        >
          <Input placeholder="email@ejemplo.com" prefix={<MailOutlined />} />
        </Form.Item>

        {/* ✅ Cargo Dinámico con Gestión */}
        <Form.Item name="job_title" label="Cargo">
          <Space.Compact style={{ width: "100%" }}>
            <Select
              placeholder="Seleccionar cargo"
              loading={loadingJobTitles}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ flex: 1 }}
              value={selectedJobTitle || form.getFieldValue("job_title")}
              onChange={(value) => {
                console.log("🔍 JOB_TITLE SELECT CHANGED:", value);
                console.log("🔍 JOB_TITLE SELECT TYPE:", typeof value);
                setSelectedJobTitle(value);
                form.setFieldValue("job_title", value);
              }}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <div
                    style={{ padding: "8px", borderTop: "1px solid #f0f0f0" }}
                  >
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() => setShowJobTitleModal(true)}
                      style={{ width: "100%" }}
                    >
                      + Crear nuevo cargo
                    </Button>
                  </div>
                </div>
              )}
            >
              {console.log("🔍 RENDER - jobTitlesList:", jobTitlesList)}
              {console.log(
                "🔍 RENDER - current form job_title:",
                form.getFieldValue("job_title")
              )}
              {console.log(
                "🔍 RENDER - contact to edit job_title:",
                state.contacts.select_to_edit?.job_title
              )}
              {jobTitlesList.map((jobTitle) => (
                <Option key={jobTitle.id} value={jobTitle.id}>
                  {jobTitle.display_name || jobTitle.name}
                  {jobTitle.created_by_branch_name && (
                    <span style={{ color: "#999", fontSize: "12px" }}>
                      {" "}
                      ({jobTitle.created_by_branch_name})
                    </span>
                  )}
                </Option>
              ))}
            </Select>
            <Button
              type="text"
              icon={<BuildOutlined />}
              onClick={() => setShowJobTitleModal(true)}
              title="Gestionar cargos"
              size="middle"
            />
          </Space.Compact>
        </Form.Item>

        {/* ✅ NUEVO: Tipo de contacto (obligatorio) */}
        <Form.Item
          name="contact_type"
          label="Tipo de Contacto"
          rules={[
            { required: true, message: "Selecciona el tipo de contacto" },
          ]}
        >
          <Select placeholder="Selecciona tipo de contacto">
            <Option value="PRIMARY">Contacto Principal</Option>
            <Option value="SECONDARY">Contacto Secundario</Option>
            <Option value="BILLING">Contacto de Facturación</Option>
            <Option value="TECHNICAL">Contacto Técnico</Option>
            <Option value="ADMINISTRATIVE">Contacto Administrativo</Option>
            <Option value="DECISION_MAKER">Tomador de Decisiones</Option>
          </Select>
        </Form.Item>

        {/* ✅ Botones sin cambios */}
        <Form.Item>
          <Flex gap={"small"}>
            <Button
              type="primary"
              htmlType="submit"
              icon={
                state.contacts.select_to_edit ? (
                  <RetweetOutlined />
                ) : (
                  <PlusCircleOutlined />
                )
              }
            >
              {state.contacts.select_to_edit ? "Actualizar" : "Crear"}
            </Button>
            <Button
              type="default"
              onClick={clearOrBack}
              icon={
                state.contacts.select_to_edit ? (
                  <ArrowLeftOutlined />
                ) : (
                  <ClearOutlined />
                )
              }
            >
              {state.contacts.select_to_edit ? "Volver" : "Limpiar"}
            </Button>
          </Flex>
        </Form.Item>
      </Form>

      {/* ✅ Modales de Gestión */}
      <JobTitleManagementModal
        visible={showJobTitleModal}
        onClose={() => {
          console.log(
            "🔍 Closing JobTitleModal, appState.branches:",
            appState?.branches
          );
          console.log("🔍 appState.branches[0]:", appState?.branches?.[0]);
          setShowJobTitleModal(false);
        }}
        onJobTitleCreated={handleJobTitleCreated}
        currentBranch={
          client?.branch || state.branchs?.[0] || appState?.branches?.[0]
        }
      />
    </>
  );
};

export default CreateUpdate;
