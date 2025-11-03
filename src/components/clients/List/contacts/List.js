import React, { useContext } from "react";
import {
  List,
  Button,
  Flex,
  Typography,
  Popconfirm,
  App,
  Tag,
  Card,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  MailFilled,
  PhoneFilled,
  ContactsFilled,
  BuildFilled,
} from "@ant-design/icons";
import { ClientsContext } from "../../../../containers/Clients";
import { controller } from "../../../../controllers/clients";
const { Text, Paragraph } = Typography;

const ListContacts = ({ openSecond, setOpenSecond }) => {
  const { notification } = App.useApp();

  const { state, dispatch } = useContext(ClientsContext);
  const contacts = state.contacts.list;

  const selectToEdit = (contact) => {
    controller.list_table.contacts.select_edit(contact, dispatch);
    setOpenSecond(true);
  };

  const renderItem = (item) => {
    return (
      <Card
        size="small"
        hoverable
        style={{ margin: "10px" }}
        title={item.name.toUpperCase()}
        extra={
          <Flex gap={"small"}>
            <Button
              type="primary"
              onClick={() => selectToEdit(item)}
              size="small"
              shape="round"
              icon={<EditOutlined />}
            />
            <Popconfirm
              title="¿Estas seguro de eliminar este contacto?"
              onConfirm={() =>
                controller.list_table.contacts.delete(
                  item,
                  dispatch,
                  notification
                )
              }
              okText="Si"
              cancelText="No"
            >
              <Button
                type="primary"
                shape="round"
                size="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Flex>
        }
      >
        <List.Item.Meta
          description={
            <Flex gap={"small"} justify="start" wrap vertical>
              {item.email && (
                <Text type="secondary">
                  <Tag>
                    <MailFilled />
                  </Tag>{" "}
                  {item.email.toLowerCase()}
                </Text>
              )}
              {item.phone_number && (
                <Text italic>
                  <Tag>
                    <PhoneFilled />
                  </Tag>{" "}
                  +56 9 {item.phone_number}
                </Text>
              )}
              {item.job_title && (
                <Text strong>
                  <Tag>
                    <BuildFilled />
                  </Tag>{" "}
                  {item.job_title.toUpperCase()}
                </Text>
              )}
            </Flex>
          }
        />
      </Card>
    );
  };

  return (
    <List
      dataSource={contacts}
      extra={<ContactsFilled />}
      renderItem={renderItem}
      size="small"
    />
  );
};

export default ListContacts;
