import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Journal from "./pages/Journal";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/journal"} component={Journal} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "'Lora', Georgia, serif",
                background: "oklch(0.99 0.008 80)",
                border: "1px solid oklch(0.87 0.018 75)",
                color: "oklch(0.22 0.025 55)",
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
