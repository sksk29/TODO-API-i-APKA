import { Button, createStyles, Text } from "@mantine/core";
import React from "react";
import { Icon as TablerIcon } from "tabler-icons-react";

interface IProps {
  icon: TablerIcon;
  label: string;
  onClick?: () => void;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

type ButtonProps = Omit<IProps, "icon" | "label" | "onClick">;

const useStyles = createStyles((theme, props: ButtonProps) => ({
  root: {
    position: "absolute",
    top: props.top,
    bottom: props.bottom,
    left: props.left,
    right: props.right
  }
}));

const Fab: React.FC<IProps> = ({ icon: Icon, label, onClick, ...btnProps }) => {
  const { classes } = useStyles(btnProps);

  return (
    <Button
      className={classes.root}
      leftIcon={<Icon size={18} />}
      variant="filled"
      radius="xl"
      onClick={onClick}
      size="lg"
    >
      <Text transform="capitalize">{label}</Text>
    </Button>
  );
};

export default Fab;
