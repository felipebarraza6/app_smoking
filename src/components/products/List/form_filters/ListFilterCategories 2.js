/** @jsxImportSource @emotion/react */
import React, { useContext } from "react";
import { Button, List } from "antd";
import { ProductsContext } from "../../../../containers/Products";
import { PushpinOutlined, PushpinFilled } from "@ant-design/icons";
import { controller } from "../../../../controllers/products";
import { css } from "@emotion/react";

const ListFilterCategories = () => {
  const { state, dispatch } = useContext(ProductsContext);
  const sortedCategories = state.categories.list.sort(
    (a, b) => b.product_count - a.product_count
  );

  const onChangeCategory = (category) => {
    controller.list_table.change_filters_selects(
      "category",
      category,
      dispatch
    );
  };

  const buttonRenderStyled = css({
    margin: "0px 5px 5px 0px",
  });

  const renderButton = (category) => {
    return (
      <Button
        disabled={category.product_count === 0}
        key={category.id}
        type={state.filters.category === category.id ? "primary" : "dashed"}
        size="small"
        icon={
          state.filters.category === category.id ? (
            <PushpinFilled />
          ) : (
            <PushpinOutlined />
          )
        }
        onClick={() => onChangeCategory(category.id)}
        css={buttonRenderStyled}
      >
        {category.name.toLowerCase()}
      </Button>
    );
  };

  return (
    <List
      dataSource={sortedCategories}
      renderItem={renderButton}
      size="small"
    />
  );
};

export default ListFilterCategories;
