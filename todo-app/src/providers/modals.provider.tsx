import React from "react";
import { ModalsProvider as MantineModalsProvider } from "@mantine/modals";
import { MODAL_IDS } from "../constants";
import { IWithChildren } from "../types";
import { EditTodoModal, NewTodoModal } from "../components/organisms";

export const ModalsProvider: React.FC<IWithChildren> = ({ children }) => {
  return (
    <MantineModalsProvider
      modals={{
        [MODAL_IDS.CREATE_TODO_MODAL_ID]: NewTodoModal,
        [MODAL_IDS.EDIT_TODO_MODAL_ID]: EditTodoModal
      }}
    >
      {children}
    </MantineModalsProvider>
  );
};
