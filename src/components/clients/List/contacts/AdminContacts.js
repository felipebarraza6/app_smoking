import React, { useState, useContext, useEffect } from "react";
import { ContactsFilled, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex } from "antd";
import ListContacts from "./List";
import CreateUpdate from "./CreateUpdate";
import { ClientsContext } from "../../../../containers/Clients";
import { controller } from "../../../../controllers/clients";

const AdminContacts = ({ client }) => {
  const contacts = client?.contacts || [];
  const { state, dispatch } = useContext(ClientsContext);
  const [open, setOpen] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);

  const handleDrawer = () => {
    setOpen(!open);
    controller.list_table.contacts.add(dispatch, contacts);
  };

  const handleSecondDrawer = () => {
    controller.list_table.contacts.select_edit(null, dispatch);
    setOpenSecond(!openSecond);
  };

  const titleRender = () => {
    const element = (
      <Flex gap={"small"}>
        <ContactsFilled />
        {client?.name?.toUpperCase() || "Cliente"}
      </Flex>
    );
    return element;
  };

  useEffect(() => {
    controller.list_table.contacts.add(dispatch, contacts);
  }, [client]);

  return (
    <Flex justify="center">
      <Drawer
        title={titleRender()}
        open={open}
        width={500}
        onClose={handleDrawer}
        extra={
          <Button
            children={"Nuevo contacto"}
            type={"primary"}
            icon={<PlusOutlined />}
            onClick={handleSecondDrawer}
          />
        }
        children={
          <>
            <ListContacts
              openSecond={openSecond}
              setOpenSecond={setOpenSecond}
            />
            <Drawer
              open={openSecond}
              onClose={handleSecondDrawer}
              title={
                <Flex gap={"small"}>
                  <UserOutlined />
                  {state.contacts.select_to_edit
                    ? state.contacts.select_to_edit.name?.toUpperCase() ||
                      "Contacto"
                    : "Nuevo contacto"}
                </Flex>
              }
              children={
                <CreateUpdate client={client} setOpenSecond={setOpenSecond} />
              }
            />
          </>
        }
      />
      <Button
        icon={<ContactsFilled />}
        children={` ${contacts.length}`}
        shape="round"
        onClick={handleDrawer}
        type={"primary"}
        size={"small"}
      />
    </Flex>
  );
};

export default AdminContacts;
