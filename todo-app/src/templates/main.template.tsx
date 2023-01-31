import React from "react";
import { AppShell, Container } from "@mantine/core";
import { IWithChildren } from "../types";
import { Header, Navbar } from "../components/organisms";

export const MainTemplate: React.FC<IWithChildren> = ({ children }) => {
  return (
    <AppShell navbar={<Navbar />} header={<Header />}>
      <Container fluid>{children}</Container>
    </AppShell>
  );
};
