import React from "react";
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools";
import Votes from "./components/VotesWrapper";

const queryClient = new QueryClient()

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <>
          <Votes />
          <ReactQueryDevtools />
        </>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

export default App;