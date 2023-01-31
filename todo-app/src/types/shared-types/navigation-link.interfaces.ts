import { Icon as TablerIcon } from "tabler-icons-react";

export enum NavKeys {
  ACCOUNT = "/account",
  TODOS = "/todos",
  LOGOUT = "/logout"
}

export interface INavigationLink {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  navKey: NavKeys;
  onClick?: () => void;
}
