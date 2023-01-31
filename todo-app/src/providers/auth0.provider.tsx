import React from "react";
import { Auth0Provider as Provider } from "@auth0/auth0-react";
import { IWithChildren } from "../types";

const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export const Auth0Provider: React.FC<IWithChildren> = ({ children }) => {
  return (
    <Provider
      clientId={clientId}
      domain={domain}
      redirectUri={window.location.origin}
      useRefreshTokens={true}
      audience={audience}
    >
      {children}
    </Provider>
  );
};
