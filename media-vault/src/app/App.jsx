import { BrowserRouter } from "react-router-dom";
import AppProviders from "./providers";
import AppRoutes from "./routes";

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}
