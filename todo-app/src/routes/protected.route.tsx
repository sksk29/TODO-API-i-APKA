import React from "react";
import {
  useAuth0,
  withAuthenticationRequired,
  WithAuthenticationRequiredOptions
} from "@auth0/auth0-react";
import { AppLoading } from "../components/molecules";
import { useApiContext } from "../contexts";

interface IProps {
  component: React.ComponentType;
  options?: Omit<WithAuthenticationRequiredOptions, "onRedirecting">;
}

export const ProtectedRoute: React.FC<IProps> = ({ component, options }) => {
  const { isLoading } = useAuth0();
  const { isLoading: isApiLoading } = useApiContext();
  const { ...args } = options || {};
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <AppLoading isLoading={isLoading} />,
    ...args
  });

  if (isApiLoading) {
    return <AppLoading isLoading={isApiLoading} />;
  }

  return <Component />;
};
