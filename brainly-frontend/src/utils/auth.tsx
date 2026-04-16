import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};



export const RequireUnAuth = ({ children }: { children: JSX.Element }) => {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};