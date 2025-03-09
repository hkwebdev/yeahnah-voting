import { LocationProvider, Route, Router } from "preact-iso";
import { Home } from "./pages/home";
import { VotePage } from "./pages/vote";
import { NotFound } from "./pages/notfound";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  console.log("running");
  return (
    <LocationProvider>
      <QueryClientProvider client={queryClient}>
        <div class="font-display font-light">
          <Router>
            <Route path="/" component={Home} />
            <Route path="/vote/:event/:artwork" component={VotePage} />
            <Route path="/not-found" component={NotFound} />
            <Route default component={NotFound} />
          </Router>
        </div>
      </QueryClientProvider>
    </LocationProvider>
  );
}
