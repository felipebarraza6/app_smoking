/** @jsxImportSource @emotion/react */
import React from "react";
import { Card, Tabs } from "antd";
import ComplexRecipes from "../components/recipes/ComplexRecipes";
import SubRecipes from "../components/recipes/SubRecipes";

const { TabPane } = Tabs;

const Recipes = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Card
        title="Gestión de Recetas"
        style={{ background: "transparent" }}
        bodyStyle={{ padding: "24px" }}
      >
        <Tabs defaultActiveKey="complex" type="card">
          <TabPane tab="Recetas Complejas" key="complex">
            <ComplexRecipes />
          </TabPane>
          <TabPane tab="Sub-recetas" key="subrecipes">
            <SubRecipes />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Recipes;