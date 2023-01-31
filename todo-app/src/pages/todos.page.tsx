import React from "react";
import {
  ActionIcon,
  Container,
  Group,
  LoadingOverlay,
  ScrollArea,
  Table,
  Tooltip,
  useMantineTheme
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Check, Edit, Plus, Trash } from "tabler-icons-react";
import { Api } from "../api";
import { Fab } from "../components/atoms";
import { MODAL_IDS } from "../constants";
import { DateTime } from "luxon";
import { INewTodoModalProps } from "../components/organisms/modals/new-todo-modal";
import { ICreateTodo, ITodo } from "../models";
import { showNotification, updateNotification } from "@mantine/notifications";
import { CheckIcon } from "@modulz/radix-icons";
import { IEditModalProps } from "../components/organisms/modals/edit-todo.modal";

enum Action {
  EDIT = "edit",
  DELETE = "delete",
  MARK_COMPLETED = "mark-completed"
}

const finishedTodoComparator = (firstTodo: ITodo, secondTodo: ITodo): number => {
  if (firstTodo.isFinished > secondTodo.isFinished) {
    return -1;
  }
  if (firstTodo.isFinished < secondTodo.isFinished) {
    return 1;
  }
  return 0;
};

export const TodosPage: React.FC = () => {
  const modals = useModals();

  const headers = [
    "Todo name",
    "Description",
    "Created At",
    "Last Data Update",
    "Is to be finished by"
  ];
  const [rows, setRows] = React.useState<React.ReactNode[]>(new Array(10));

  const theme = useMantineTheme();

  const queryClient = useQueryClient();

  const {
    isLoading: isCreateTodoLoading,
    mutate: createTodoMutation,
    status: createTodoStatus
  } = useMutation<ITodo, unknown, { data: ICreateTodo }>("create-todo", {
    mutationFn: async (args: { data: ICreateTodo }) => {
      const { data: todo } = await Api.post<ITodo>({
        url: `/todos/create`,
        data: args.data
      });
      return todo;
    },
    onSuccess: async () => {
      await queryClient.fetchQuery("todos");
    }
  });

  const openNewTodoModal = () =>
    modals.openContextModal<INewTodoModalProps>(MODAL_IDS.CREATE_TODO_MODAL_ID, {
      title: "Create new Todo",
      centered: true,
      innerProps: {
        mutateFn: createTodoMutation
      },
      overlayOpacity: 0.55,
      overlayBlur: 3,
      transition: "slide-up",
      size: "lg"
    });

  const convertDate = React.useCallback((date: string) => {
    return DateTime.fromISO(date).toLocal().toFormat("yyyy-MM-dd HH:mm:ss");
  }, []);

  const {
    data: todos,
    isLoading,
    refetch: refetchTodos
  } = useQuery("todos", {
    queryFn: async () => {
      const { data: fetchedTodos } = await Api.get<ITodo[]>({
        url: "/todos"
      });
      return fetchedTodos;
    },
    initialData: [],
    keepPreviousData: false
  });

  const { mutate: updateTodosMutate, isLoading: isUpdating } = useMutation("update-todo", {
    mutationFn: async ({ id, data }: { id: string; data: Partial<ITodo> }) => {
      const result = await Api.patch({
        url: `/todos/edit/${id}`,
        data
      });
      return result.data;
    },
    onSuccess: async () => {
      await refetchTodos();
      modals.closeModal(MODAL_IDS.EDIT_TODO_MODAL_ID);
    }
  });

  const { isLoading: isDeleting, mutate: deleteMutation } = useMutation("delete-todo", {
    mutationFn: async (id: string) => {
      await Api.delete<void>({
        url: `/todos/delete/${id}`
      });
    },
    onSuccess: async () => {
      await refetchTodos();
    }
  });

  const { mutate: markCompletedMutation, isLoading: isTodoMarkingAsCompleted } = useMutation<
    ITodo,
    unknown,
    string
  >("mark-completed", {
    mutationFn: async (id: string) => {
      const { data: response } = await Api.put<ITodo>({
        url: `/todos/mark-completed/${id}`,
        data: {
          id
        }
      });
      return response;
    },
    onSuccess: async () => {
      await refetchTodos();
    }
  });

  const handleActionClick = React.useCallback(async (action: Action, id: string) => {
    if (action === Action.DELETE) {
      deleteMutation(id);
    }
    if (action === Action.MARK_COMPLETED) {
      markCompletedMutation(id);
    }
    if (action === Action.EDIT) {
      let todosToSearch = todos || [];
      if (todosToSearch.length === 0) {
        const { data: newTodosData } = await Api.get<ITodo[]>({
          url: "/todos"
        });
        todosToSearch = newTodosData;
      }
      const foundTodo = todosToSearch?.find((todo: ITodo) => todo.id === id);
      if (!foundTodo) {
        return null;
      }
      modals.openContextModal<IEditModalProps>(MODAL_IDS.EDIT_TODO_MODAL_ID, {
        title: "Edit chosen todo",
        centered: true,
        innerProps: {
          todo: foundTodo,
          isUpdating,
          mutationFn: updateTodosMutate
        },
        overlayOpacity: 0.55,
        overlayBlur: 3,
        transition: "slide-up",
        size: "lg"
      });
    }
  }, []);

  const actionButtons = [
    {
      icon: Check,
      label: "Mark as completed",
      action: Action.MARK_COMPLETED,
      color: "green",
      isLoading: false
    },
    {
      icon: Edit,
      label: "Edit",
      action: Action.EDIT,
      color: "blue",
      isLoading: false
    },
    {
      icon: Trash,
      label: "Delete",
      action: Action.DELETE,
      color: "red",
      isLoading: isDeleting
    }
  ];

  React.useEffect(() => {
    if (isCreateTodoLoading) {
      showNotification({
        id: "create-todo",
        message: "Todo is creating",
        title: "Wait a moment",
        autoClose: false,
        disallowClose: true,
        loading: true
      });
    }
    if (createTodoStatus === "success") {
      updateNotification({
        id: "create-todo",
        title: "Success! New todo created",
        message: "Notification will close in 3 seconds, you can close this notification now",
        autoClose: 3000,
        icon: <CheckIcon />,
        color: "teal"
      });
    }
  }, [isCreateTodoLoading]);

  React.useEffect(() => {
    if (todos) {
      const tableRows = todos
        .sort(finishedTodoComparator)
        .map(({ id, name, description, createdAt, updatedAt, finishDate, isFinished }) => (
          <tr key={id} style={{ backgroundColor: isFinished ? theme.colors.green[4] : "" }}>
            <td>{name}</td>
            <td>{description}</td>
            <td>{convertDate(createdAt)}</td>
            <td>{convertDate(updatedAt)}</td>
            <td>{convertDate(finishDate)}</td>
            <td>
              <Group position="center" spacing="sm">
                {actionButtons
                  .filter(({ action }) =>
                    isFinished ? action !== Action.EDIT && action !== Action.MARK_COMPLETED : action
                  )
                  .map(
                    (
                      { icon: Icon, label, color, action, isLoading: isButtonActionLoading },
                      idx
                    ) => (
                      <Tooltip label={label} key={idx}>
                        <ActionIcon
                          color={color}
                          variant="filled"
                          onClick={() => handleActionClick(action, id)}
                          loading={isButtonActionLoading}
                        >
                          <Icon />
                        </ActionIcon>
                      </Tooltip>
                    )
                  )}
              </Group>
            </td>
          </tr>
        ));
      setRows(tableRows);
    }
  }, [todos]);

  return (
    <>
      <Container fluid>
        {
          <div style={{ width: "100%", position: "relative" }}>
            <LoadingOverlay
              visible={isLoading || isCreateTodoLoading || isDeleting || isTodoMarkingAsCompleted}
            />
            <ScrollArea>
              <Table striped fontSize="md" verticalSpacing="md" highlightOnHover>
                <thead>
                  <tr>
                    {headers.map((header, idx) => (
                      <th key={idx}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </ScrollArea>
          </div>
        }
      </Container>
      <Fab icon={Plus} label="Add new Todo" bottom={45} right={45} onClick={openNewTodoModal} />
    </>
  );
};
