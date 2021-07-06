import React from "react";
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools";
import Records from "./components/Records";

const queryClient = new QueryClient()

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <>
          <Records />
          <ReactQueryDevtools />
        </>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

export default App;