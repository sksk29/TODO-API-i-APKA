import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useQuery } from "react-query";
import { Api } from "../api";
import { IUser, UserModel } from "../models";
import { IWithChildren } from "../types";

interface IApiContext {
  user: IUser | null;
  isLoading: boolean;
  error?: unknown;
  accessToken: string;
}

const initialState: IApiContext = {
  user: null,
  isLoading: false,
  accessToken: ""
};

const ApiContext = React.createContext<IApiContext>(initialState);

export const ApiContextProvider: React.FC<IWithChildren> = ({ children }) => {
  const [state, setState] = React.useState<IApiContext>({
    ...initialState,
    isLoading: true
  });

  const { getAccessTokenSilently, isLoading: isAuth0Loading } = useAuth0();

  const { data, isLoading, refetch, isRefetching, error } = useQuery("get-user-info", {
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently();
      setState((prevState) => ({ ...prevState, accessToken }));
      Api.setAccessToken(accessToken);
      const { data: userData } = await Api.get<IUser>({
        url: "/users/me",
        config: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      });
      return new UserModel(userData);
    },
    retry: 2
  });

  React.useEffect(() => {
    if (isLoading) {
      setState({
        ...state,
        isLoading: true
      });
    }
    if (data) {
      setState({
        ...state,
        user: data,
        isLoading: false
      });
    }
    if (error) {
      setState({
        ...state,
        isLoading: false,
        error
      });
    }
  }, [data, isLoading, isRefetching, error, isAuth0Loading]);

  React.useEffect(() => {
    setState((prevState) => ({ ...prevState, refetch }));
  }, [refetch]);

  return <ApiContext.Provider value={state}>{children}</ApiContext.Provider>;
};

export function useApiContext() {
  const context = React.useContext(ApiContext);
  return context;
}
