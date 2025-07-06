import React from "react";
import { Flex } from "antd";

import Filters from "./form_filters/Filters";
import ListFilterCategories from "./form_filters/ListFilterCategories";

const FormFilters = () => {
  return (
    <Flex vertical gap="small">
      <Filters />
      <ListFilterCategories />
    </Flex>
  );
};

export default FormFilters;
