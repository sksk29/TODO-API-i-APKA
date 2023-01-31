import React from "react";
import { Box, Button, Group, LoadingOverlay, Text, Textarea, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { DateTime } from "luxon";
import { Check, X as Close } from "tabler-icons-react";
import { ITodo } from "../../../models";

export interface IEditModalProps extends Record<string, unknown> {
  isUpdating: boolean;
  todo: ITodo;
  mutationFn: (args: { id: string; data: Partial<ITodo> }) => void;
}

type FormState = Pick<ITodo, "name" | "description" | "finishDate">;

export const EditTodoModal: React.FC<ContextModalProps<IEditModalProps>> = ({
  context,
  id: modalId,
  innerProps
}) => {
  const form = useForm<FormState>({
    initialValues: {
      name: innerProps.todo.name,
      description: innerProps.todo.description,
      finishDate: innerProps.todo.finishDate
    }
  });

  const textAreaMaxLength = 250;

  const handleClose = (): void => {
    context.closeModal(modalId);
  };

  const handleSubmit = form.onSubmit((values: FormState) => {
    innerProps.mutationFn({
      id: innerProps.todo.id,
      data: values
    });
  });

  return (
    <Box mx="xs">
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={innerProps.isUpdating} />
        <form onSubmit={handleSubmit} id="edit-todo-form">
          <TextInput
            label="Edit todo name"
            radius="sm"
            name="name"
            placeholder="Edit todo name"
            {...form.getInputProps("name")}
          />
          <>
            <Textarea
              label="Edit todo description"
              maxLength={textAreaMaxLength}
              mt={10}
              {...form.getInputProps("description")}
            />
            <Group mt={5} position="right">
              <Text size="xs" color="gray">
                {form.values.description.length} / {textAreaMaxLength}
              </Text>
            </Group>
          </>
          <DatePicker
            mt={-10}
            label="Edit todo finish date"
            defaultValue={DateTime.fromISO(innerProps.todo.finishDate).toJSDate()}
            {...form.getInputProps("finishDate")}
          />
        </form>
        <Group direction="row" position="right" spacing="sm" align="center" mt={15}>
          <Button color="red" onClick={handleClose} rightIcon={<Close size={18} />}>
            Close
          </Button>
          <Button color="blue" type="submit" form="edit-todo-form" rightIcon={<Check size={18} />}>
            Confirm changes
          </Button>
        </Group>
      </div>
    </Box>
  );
};
