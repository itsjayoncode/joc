import { AppProviders } from "./AppProviders.js";
import { AppRoutes } from "../routes/app-routes.js";

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
