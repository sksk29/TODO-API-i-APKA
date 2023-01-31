import React from "react";
import { Avatar, Box, Button, Container, Group, Paper, Text } from "@mantine/core";
import { useApiContext } from "../contexts";
import { Settings, Trash } from "tabler-icons-react";

export const AccountPage: React.FC = () => {
  const { user } = useApiContext();

  return (
    <Container fluid sx={{ height: "90vh", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          height: 500
        }}
      >
        <Paper
          radius="xl"
          withBorder
          p="3rem"
          shadow="lg"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white
          })}
        >
          <Group position="center" direction="column">
            <Avatar src={user?.picture} size={120} radius={120} mx="auto" />
            <Text align="center" size="lg" weight={500} mt="md">
              {user?.nickname}
            </Text>
            <Text align="center" color="dimmed" size="sm">
              {user?.email}
            </Text>
            <Button color="blue" fullWidth mt="md" rightIcon={<Settings />}>
              Manage account
            </Button>
            <Button color="red" fullWidth rightIcon={<Trash />}>
              Delete Account
            </Button>
          </Group>
        </Paper>
      </Box>
    </Container>
  );
};
