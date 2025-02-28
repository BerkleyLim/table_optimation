import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import TableExample from "./TableExample.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*<App />*/}
    <TableExample/>
  </StrictMode>,
)
