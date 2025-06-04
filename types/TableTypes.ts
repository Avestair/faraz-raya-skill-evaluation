import { UserProfile } from "./userTypes";

export type TableProps = {
  children: React.ReactNode;
  className?: string;
};

export type TableBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export type TableCellProps = {
  children: React.ReactNode;
  className?: string;
};

export type TableHeadProps = {
  children: React.ReactNode;
  className?: string;
};

export type TableHeaderProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export type TableRowProps = {
  children: React.ReactNode;
  className?: string;
};

export type UserColumnDefinition = {
  headerName: string;
  className?: string;
  dataKey?: keyof UserProfile | "index" | "actions";
  sortable?: boolean;
};

export interface UserTableProps {
  headers: UserColumnDefinition[];
  users: UserProfile[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
