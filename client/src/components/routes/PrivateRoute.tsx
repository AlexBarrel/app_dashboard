// components/PrivateRoute.tsx
import { JSX } from "react";
import { Navigate } from "react-router";

interface Props {
  children: JSX.Element;
  token: string | null;
}

const PrivateRoute = ({ children, token }: Props) => {
  return token ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
