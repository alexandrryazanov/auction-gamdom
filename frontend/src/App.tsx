import MainLayout from "./layouts/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LotsTable from "@/components/LotsTable";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <LotsTable />
      </MainLayout>
    </QueryClientProvider>
  );
}

export default App;
