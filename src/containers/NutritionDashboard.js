/** @jsxImportSource @emotion/react */
import React from "react";
import { Card } from "antd";
import RecipeNutritionDashboard from "../components/recipes/RecipeNutritionDashboard";

const NutritionDashboard = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Card
        title="Dashboard Nutricional"
        style={{ background: "transparent" }}
        bodyStyle={{ padding: "24px" }}
      >
        <RecipeNutritionDashboard />
      </Card>
    </div>
  );
};

export default NutritionDashboard;