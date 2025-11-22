/** @jsxImportSource @emotion/react */
import React from "react";
import { Card } from "antd";
import NutritionCalculator from "../components/recipes/NutritionCalculator";

const NutritionCalculatorPage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Card
        title="Calculadora Nutricional"
        style={{ background: "transparent" }}
        bodyStyle={{ padding: "24px" }}
      >
        <NutritionCalculator />
      </Card>
    </div>
  );
};

export default NutritionCalculatorPage;