import ProtectedRoute from "../components/ProtectedRoute";
import "./globals.css";
import StoreProvider from "./StoreProvider";

export const metadata = {
  title: "Careers Page",
  description:
    "A dynamic career page builder that allows companies to create and customize their career pages.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ProtectedRoute>{children}</ProtectedRoute>
        </StoreProvider>
      </body>
    </html>
  );
}
