/** @jsxImportSource @emotion/react */
import React from "react";
import { Card } from "antd";
import NutritionalIngredients from "../components/recipes/NutritionalIngredients";

const NutritionalIngredientsPage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Card
        title="Ingredientes Nutricionales"
        style={{ background: "transparent" }}
        bodyStyle={{ padding: "24px" }}
      >
        <NutritionalIngredients />
      </Card>
    </div>
  );
};

export default NutritionalIngredientsPage;