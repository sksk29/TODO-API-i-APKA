import React from "react";
import { createStyles, Group, Navbar as MantineNavbar } from "@mantine/core";
import { ListCheck, Logout, User } from "tabler-icons-react";
import { INavigationLink, NavKeys } from "../../../types";
import { NavbarLink } from "../../molecules";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";

const plainNavLinks: INavigationLink[] = [
  {
    icon: ListCheck,
    navKey: NavKeys.TODOS,
    label: "Todos"
  },
  {
    icon: User,
    label: "Account",
    navKey: NavKeys.ACCOUNT
  }
];

const plainFooterLinks: INavigationLink[] = [
  {
    icon: Logout,
    navKey: NavKeys.LOGOUT,
    label: "Logout"
  }
];

const useStyles = createStyles((theme) => {
  return {
    navbar: {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white
    },
    footer: {
      borderTop: `1px solid ${
        theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
      paddingTop: theme.spacing.md
    }
  };
});

export const Navbar = () => {
  const { classes } = useStyles();

  const { logout } = useAuth0();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const index = plainNavLinks.findIndex(({ navKey }) => navKey === pathname);

    if (index !== -1) {
      setActive(index);
    }
  }, [pathname]);

  const handleNavlinkClick = React.useCallback((key: NavKeys) => {
    if (key === NavKeys.LOGOUT) {
      logout();
    }
    navigate(key);
  }, []);

  const navLinks = plainNavLinks.map((link, idx) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={idx === active}
      onClick={() => {
        setActive(idx);
        handleNavlinkClick(link.navKey);
      }}
    />
  ));

  const footerNavLinks = plainFooterLinks.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={false}
      onClick={() => {
        handleNavlinkClick(link.navKey);
      }}
    />
  ));

  return (
    <MantineNavbar width={{ base: 250 }} p="md" className={classes.navbar}>
      <MantineNavbar.Section grow mt={25}>
        {navLinks}
      </MantineNavbar.Section>
      <MantineNavbar.Section className={classes.footer}>
        <Group direction="column" align="end" spacing={0}>
          {footerNavLinks}
        </Group>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};
