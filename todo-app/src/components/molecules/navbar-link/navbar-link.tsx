import React from "react";
import { createStyles, UnstyledButton } from "@mantine/core";

const ICON_REF = "icon";

import { INavigationLink } from "../../../types";

const useStyles = createStyles((theme, _, getRef) => {
  const icon = getRef(ICON_REF);
  return {
    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,
      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black
        }
      }
    },
    linkIcon: {
      ref: icon,
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm
    },
    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
            : theme.colors[theme.primaryColor][0],
        color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 7],
        [`& .${icon}`]: {
          color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 7]
        }
      }
    }
  };
});

export const NavbarLink: React.FC<INavigationLink> = ({ icon: Icon, label, active, onClick }) => {
  const { classes, cx } = useStyles();
  return (
    <UnstyledButton
      sx={{ width: "100%" }}
      className={cx(classes.link, { [classes.linkActive]: active })}
      onClick={onClick}
    >
      <Icon className={classes.linkIcon} />
      {label}
    </UnstyledButton>
  );
};
