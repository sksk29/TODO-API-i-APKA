import React from "react";
import { Avatar, createStyles, Header as MantineHeader } from "@mantine/core";
import { useApiContext } from "../../../contexts";

const HEADER_HEIGHT = 54;

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md
  },
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "end",
    alignItems: "center"
  }
}));

export const Header: React.FC = () => {
  const { classes } = useStyles();

  const { user } = useApiContext();

  return (
    <MantineHeader height={HEADER_HEIGHT} className={classes.header}>
      <div className={classes.inner}>
        <Avatar sx={{ cursor: "pointer" }} src={user?.picture} radius="xl" size="md" />
      </div>
    </MantineHeader>
  );
};
