import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { App } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
                organization: import.meta.env.VITE_AUTH0_ORGANIZATION,
                ...(import.meta.env.VITE_AUTH0_AUDIENCE && { audience: import.meta.env.VITE_AUTH0_AUDIENCE }),
            }}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
);
