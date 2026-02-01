import type { ReactNode } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface Props {
  children: ReactNode;
}

export function Guards({ children }: Props) {
  const auth = useAuthStore();
  const params = useParams<{ id: string }>();
  const location = useLocation();

  const isLoggedIn = auth.isLoggedIn();
  const role = auth.getRole();
  const userId = auth.getUserId();
  const routeUserId = params.id ? Number(params.id) : undefined;

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role === "admin") return <>{children}</>;

  if (role === "user") {
    if (routeUserId === undefined || routeUserId === userId) {
      return <>{children}</>;
    } else {
      return <Navigate to={`/userPrivate/${userId}`} replace />;
    }
  }

  return <Navigate to="/" replace />;
}