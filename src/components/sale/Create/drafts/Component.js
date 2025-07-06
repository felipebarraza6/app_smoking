import React, { useState, useEffect, useCallback } from "react";
import { Button, Drawer } from "antd";
import { LuGitPullRequestDraft } from "react-icons/lu";
import ListElements from "./ListElements"; // Assuming you have this component

const ListDrafts = () => {
  const [open, setOpen] = useState(false);

  const onClickDraftBtn = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        icon={<LuGitPullRequestDraft />}
        size="small"
        shape="round"
        onClick={onClickDraftBtn}
      >
        Ver borradores
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Borradores"
        placement="left"
        width={"700px"}
      >
        <ListElements setVisible={setOpen} />
      </Drawer>
    </>
  );
};

export default ListDrafts;
