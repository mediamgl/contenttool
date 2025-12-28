import App from "./src/App";
import { createRoot } from "react-dom/client";
import "./src/theme.css";
import { AuthProvider } from "./src/context/AuthContext";
import { ContentProvider } from "./src/context/ContentContext";
import { ToastProvider } from "./src/components/ui/Toast";


const root = createRoot(document.getElementById("root")!);
root.render(
  <AuthProvider>
    <ContentProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ContentProvider>
  </AuthProvider>
);