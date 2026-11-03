import { NextResponse } from "next/server";

/**
 * Deprecated: invoice mail is sent by the backend at
 * POST /api/invoice/mail/send
 * This route remains as a temporary proxy for older clients.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiBase =
      process.env.NEXT_PUBLIC_INVOICE_API_URL?.replace(/\/$/, "") ||
      "http://localhost:5050/api/invoice";

    const auth = request.headers.get("authorization") || "";
    const res = await fetch(`${apiBase}/mail/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify({
        invoiceId: body.invoiceDbId || body.invoiceId,
        to: body.to,
        kind: body.kind || "payment_request",
        invoice: body.invoice || {
          id: body.invoiceId,
          invoiceNo: body.invoiceId,
          name: body.customerName,
          email: body.to,
          amount: body.amount,
          status: body.status,
          date: body.date,
          notes: body.description,
          lineItems: body.lineItems,
          billTo: {
            name: body.customerName,
            email: body.to,
          },
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to proxy invoice email",
      },
      { status: 500 },
    );
  }
}
