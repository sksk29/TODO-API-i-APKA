import React from "react";
import { AppRoutes } from "./routes/app-routes";
import { Auth0Provider, ModalsProvider } from "./providers";
import { MainTemplate } from "./templates/main.template";
import { ApiContextProvider } from "./contexts";
import { NotificationsProvider } from "@mantine/notifications";

export const App: React.FC = () => {
  return (
    <Auth0Provider>
      <ApiContextProvider>
        <ModalsProvider>
          <NotificationsProvider>
            <MainTemplate>
              <AppRoutes />
            </MainTemplate>
          </NotificationsProvider>
        </ModalsProvider>
      </ApiContextProvider>
    </Auth0Provider>
  );
};
