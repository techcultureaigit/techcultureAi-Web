import { Suspense } from "react";
import NewCustomerClient from "./NewCustomerClient";

function NewFallback() {
  return (
    <div className="app-shell" style={{ padding: 24 }}>
      Preparing customer form…
    </div>
  );
}

export default function NewCustomerPage() {
  return (
    <Suspense fallback={<NewFallback />}>
      <NewCustomerClient />
    </Suspense>
  );
}
