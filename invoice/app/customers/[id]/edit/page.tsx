import { Suspense } from "react";
import EditCustomerClient from "./EditCustomerClient";

function EditFallback() {
  return (
    <div className="app-shell" style={{ padding: 24 }}>
      Loading customer…
    </div>
  );
}

export default function EditCustomerPage() {
  return (
    <Suspense fallback={<EditFallback />}>
      <EditCustomerClient />
    </Suspense>
  );
}
