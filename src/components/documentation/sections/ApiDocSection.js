import React from "react";
import { Typography, Divider } from "antd";
import CodeBlock from "../CodeBlock";

const { Title, Paragraph, Text } = Typography;

function ApiDocSection({ token }) {
  return (
    <>
      <Title level={3}>Documentación API</Title>
      <Paragraph>
        <b>Contexto y arquitectura:</b>
        <br />
        La API está construida sobre <Text strong>Django REST Framework</Text> y
        expone endpoints RESTful bajo <Text code>/api/core/</Text>.<br />
        Utiliza autenticación por <Text code>Token</Text> (tipo header), y los
        recursos principales son: <Text code>pedidos</Text>,{" "}
        <Text code>ventas</Text>, <Text code>pagos</Text>,{" "}
        <Text code>productos</Text>, <Text code>sucursales</Text> y{" "}
        <Text code>usuarios</Text>.<br />
        <br />
        <b>¿Cómo funciona?</b> Cada recurso tiene endpoints para listar, crear,
        actualizar y eliminar. Además, puedes consumir datos en tiempo real vía
        WebSocket en <Text code>/ws/orders/</Text> para actualizaciones
        instantáneas de pedidos.
      </Paragraph>
      <Divider />
      <Title level={4} style={{ marginTop: 24 }}>
        Autenticación (Token)
      </Title>
      <Paragraph>
        Para consumir la API necesitas un <Text code>Token</Text>. Primero,
        obtén tu token autenticándote:
      </Paragraph>
      <CodeBlock
        isDark={false}
        method="POST"
        status={200}
      >{`/api/auth/users/login/
{
  "email": "usuario@dominio.com",
  "password": "tu_clave"
}

Respuesta:
{
  "user": { ... },
  "access_token": "TOKEN_AQUI"
}`}</CodeBlock>
      <Paragraph>
        Usa ese token en el header <Text code>Authorization</Text> para todas
        tus peticiones:
      </Paragraph>
      <CodeBlock
        isDark={false}
        method="GET"
      >{`Authorization: Token TOKEN_AQUI`}</CodeBlock>
      <Title level={4} style={{ marginTop: 24 }}>
        Ver pedidos (GET)
      </Title>
      <Paragraph>Endpoint para listar pedidos:</Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`/api/core/orders/
Headers: Authorization: Token TOKEN_AQUI`}</CodeBlock>
      <Paragraph>
        <b>Ejemplo de respuesta:</b>
      </Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "b1c2...",
      "date": "2024-06-12",
      "client": { "id": 1, "name": "Juan Pérez", ... },
      "total_amount": 12345,
      "is_active": true,
      ...
    },
    ...
  ]
}`}</CodeBlock>
      <Title level={4} style={{ marginTop: 24 }}>
        Filtros útiles
      </Title>
      <Paragraph>
        Puedes filtrar pedidos usando parámetros en la URL:
        <ul>
          <li>
            <Text code>?is_active=true</Text> (solo pedidos activos)
          </li>
          <li>
            <Text code>?client=ID</Text> (por cliente)
          </li>
          <li>
            <Text code>?date__gte=YYYY-MM-DD</Text> (desde fecha)
          </li>
          <li>
            <Text code>?date__lte=YYYY-MM-DD</Text> (hasta fecha)
          </li>
          <li>
            <Text code>?is_pay=true</Text> (solo pagados)
          </li>
        </ul>
        <b>Ejemplo:</b>
      </Paragraph>
      <CodeBlock
        isDark={false}
        method="GET"
      >{`/api/core/orders/?is_active=true&date__gte=2024-06-01&date__lte=2024-06-30`}</CodeBlock>
      <Title level={4} style={{ marginTop: 24 }}>
        Errores comunes
      </Title>
      <Paragraph>Si tu token es inválido o falta, recibirás:</Paragraph>
      <CodeBlock isDark={false} status={401} method="GET">{`{
  "detail": "Credenciales de autenticación no proporcionadas."
}`}</CodeBlock>
      <Paragraph>
        Para más detalles, contacta al administrador o revisa la documentación
        extendida de la API.
      </Paragraph>
      <Divider />
      <Title level={4} style={{ marginTop: 24 }}>
        Tiendas (Stores)
      </Title>
      <Paragraph>Endpoints para listar y crear tiendas:</Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`/api/core/stores/
Headers: Authorization: Token TOKEN_AQUI`}</CodeBlock>
      <CodeBlock isDark={false} method="POST" status={200}>{`/api/core/stores/
{
  "name": "Sucursal Centro",
  "address": "Av. Principal 123"
}`}</CodeBlock>
      <Paragraph>
        <b>Respuesta:</b>
      </Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`[
  {
    "id": 1,
    "name": "Sucursal Centro",
    "address": "Av. Principal 123"
  },
  ...
]`}</CodeBlock>
      <Divider />
      <Title level={4} style={{ marginTop: 24 }}>
        Productos
      </Title>
      <Paragraph>Endpoints para listar y crear productos:</Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`/api/core/products/
Headers: Authorization: Token TOKEN_AQUI`}</CodeBlock>
      <CodeBlock isDark={false} method="POST" status={200}>{`/api/core/products/
{
  "name": "Coca-Cola 1.5L",
  "price": 1500,
  "stock": 100
}`}</CodeBlock>
      <Paragraph>
        <b>Respuesta:</b>
      </Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`[
  {
    "id": 1,
    "name": "Coca-Cola 1.5L",
    "price": 1500,
    "stock": 100
  },
  ...
]`}</CodeBlock>
      <Divider />
      <Title level={4} style={{ marginTop: 24 }}>
        Repartidores
      </Title>
      <Paragraph>Endpoints para listar y crear repartidores:</Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`/api/core/delivery/
Headers: Authorization: Token TOKEN_AQUI`}</CodeBlock>
      <CodeBlock isDark={false} method="POST" status={200}>{`/api/core/delivery/
{
  "name": "Juan Repartidor",
  "phone": "+56 9 1234 5678"
}`}</CodeBlock>
      <Paragraph>
        <b>Respuesta:</b>
      </Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`[
  {
    "id": 1,
    "name": "Juan Repartidor",
    "phone": "+56 9 1234 5678"
  },
  ...
]`}</CodeBlock>
      <Divider />
      <Title level={4} style={{ marginTop: 24 }}>
        Clientes
      </Title>
      <Paragraph>Endpoints para listar y crear clientes:</Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`/api/core/clients/
Headers: Authorization: Token TOKEN_AQUI`}</CodeBlock>
      <CodeBlock isDark={false} method="POST" status={200}>{`/api/core/clients/
{
  "name": "Pedro Cliente",
  "email": "pedro@email.com"
}`}</CodeBlock>
      <Paragraph>
        <b>Respuesta:</b>
      </Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`[
  {
    "id": 1,
    "name": "Pedro Cliente",
    "email": "pedro@email.com"
  },
  ...
]`}</CodeBlock>
      <Divider />
      <Title level={4} style={{ marginTop: 24 }}>
        Métodos de Pago
      </Title>
      <Paragraph>Endpoints para listar y crear métodos de pago:</Paragraph>
      <CodeBlock
        isDark={false}
        method="GET"
        status={200}
      >{`/api/core/payment-methods/
Headers: Authorization: Token TOKEN_AQUI`}</CodeBlock>
      <CodeBlock
        isDark={false}
        method="POST"
        status={200}
      >{`/api/core/payment-methods/
{
  "name": "Transferencia",
  "active": true
}`}</CodeBlock>
      <Paragraph>
        <b>Respuesta:</b>
      </Paragraph>
      <CodeBlock isDark={false} method="GET" status={200}>{`[
  {
    "id": 1,
    "name": "Transferencia",
    "active": true
  },
  ...
]`}</CodeBlock>
    </>
  );
}

export default ApiDocSection;
