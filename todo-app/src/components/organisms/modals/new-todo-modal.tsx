import React from "react";
import { Check, Icon as TablerIcon, X as Close } from "tabler-icons-react";
import { Box, Button, Group, Text, Textarea, TextInput } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { DateTime } from "luxon";
import { ICreateTodo } from "../../../models";
import { MODAL_IDS } from "../../../constants";

interface IFormState {
  name: string;
  finishDate: Date;
  description: string;
}

const formState: {
  type: "text" | "date" | "textarea";
  name: keyof IFormState;
  label: string;
  placeholder: string;
  endIcon?: TablerIcon;
}[] = [
  {
    type: "text",
    name: "name",
    label: "Todo Name",
    placeholder: "Enter your todo name"
  },
  {
    type: "textarea",
    name: "description",
    label: "Todo Description",
    placeholder: "Enter your todo description"
  },
  {
    type: "date",
    name: "finishDate",
    label: "Finish until",
    placeholder: "Select your todo finish date"
  }
];

export interface INewTodoModalProps extends Record<string, unknown> {
  mutateFn: (args: { data: ICreateTodo }) => void;
}

export const NewTodoModal: React.FC<ContextModalProps<INewTodoModalProps>> = ({
  context,
  id: modalId,
  innerProps: { mutateFn }
}) => {
  const dateDefaultValue = DateTime.now().toLocal().toJSDate();

  const [dateValue, setDateValue] = React.useState<Date>(new Date());

  const textAreaMaxLength = 250;

  const maxDate = DateTime.now()
    .toLocal()
    .plus({
      month: 1
    })
    .toJSDate();

  const textAreaMinRows = 3;

  const initialValues = React.useMemo(
    () =>
      formState.reduce((acc, { name }) => {
        if (name === "finishDate") {
          acc[name] = dateDefaultValue.toISOString();
        } else {
          acc[name] = "";
        }
        return acc;
      }, {} as Record<keyof IFormState, string>),
    []
  );

  const form = useForm({
    initialValues,
    validate: {
      name: (value) => (value.length < 2 ? "Name must be at least 2 characters long" : null),
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters long" : null
    }
  });

  const handleClose = (): void => {
    context.closeModal(modalId);
  };

  const handleSubmit = form.onSubmit((value) => {
    const data: IFormState = {
      description: value.description,
      name: value.name,
      finishDate: DateTime.fromISO(value.finishDate).toJSDate()
    };
    mutateFn({ data });
    context.closeModal(MODAL_IDS.CREATE_TODO_MODAL_ID);
  });

  const handleDateChange = (value: Date | null) => {
    if (!value) {
      setDateValue(dateDefaultValue);
    } else {
      setDateValue(DateTime.fromJSDate(value).toJSDate());
    }
    form.setFieldValue(
      "finishDate",
      DateTime.fromJSDate(value as Date)
        .toLocal()
        .toISO()
    );
  };

  return (
    <Box mx="xs">
      <form id="todo-form" onSubmit={handleSubmit}>
        {formState.map(({ type, name, label, placeholder }, idx) =>
          type === "text" ? (
            <TextInput
              required
              key={idx}
              radius="sm"
              name={name}
              label={label}
              placeholder={placeholder}
              {...form.getInputProps(name)}
            />
          ) : type === "textarea" ? (
            <React.Fragment key={idx}>
              <Textarea
                placeholder={placeholder}
                label={label}
                required
                autosize
                minRows={textAreaMinRows}
                radius="sm"
                sx={{ marginTop: 10 }}
                maxLength={textAreaMaxLength}
                {...form.getInputProps(name)}
              />
              <Group mt={5} position="right">
                <Text size="xs" color="gray">
                  {form.values.description.length} / {textAreaMaxLength}
                </Text>
              </Group>
            </React.Fragment>
          ) : (
            <DatePicker
              key={idx}
              mt={-10}
              label={label}
              placeholder={placeholder}
              value={dateValue}
              onChange={(value) => handleDateChange(value)}
              minDate={dateDefaultValue}
              maxDate={maxDate}
              required
              defaultValue={dateDefaultValue}
            />
          )
        )}
      </form>
      <Group direction="row" position="right" spacing="sm" align="center" mt={15}>
        <Button color="red" variant="outline" onClick={handleClose} rightIcon={<Close size={18} />}>
          Close
        </Button>
        <Button
          color="green"
          form="todo-form"
          variant="outline"
          type="submit"
          rightIcon={<Check size={18} />}
        >
          Submit
        </Button>
      </Group>
    </Box>
  );
};
