import { faker } from "@faker-js/faker";
import type { CustomerRecord } from "@/components/CustomerForm";
import { GST_STATE_BY_CODE } from "@/lib/gstStates";
import type { InvoiceDocument } from "@/lib/invoiceTypes";
import { calcGrandTotal, emptyCommissionRow, emptyLineItem, uid } from "@/lib/invoiceUtils";

export const IS_DEV = process.env.NODE_ENV === "development";

const STATE_CODES = Object.keys(GST_STATE_BY_CODE).filter(
  (code) => !["97", "99"].includes(code),
);

function fakePan() {
  const letters = () => faker.string.alpha({ length: 5, casing: "upper" });
  const digits = () => faker.string.numeric(4);
  const last = () => faker.string.alpha({ length: 1, casing: "upper" });
  return `${letters()}${digits()}${last()}`;
}

/** Plausible 15-char GSTIN (not checksum-valid, fine for UI fill) */
export function fakeGstin(stateCode?: string) {
  const code =
    stateCode || faker.helpers.arrayElement(STATE_CODES);
  const pan = fakePan();
  const entity = faker.string.numeric(1);
  const z = "Z";
  const check = faker.string.alphanumeric({ length: 1, casing: "upper" });
  return `${code}${pan}${entity}${z}${check}`;
}

export function fakeCustomer(base: CustomerRecord): CustomerRecord {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const companyName = faker.company.name().replace(/,/g, "");
  const stateCode = faker.helpers.arrayElement(STATE_CODES);
  const stateName = GST_STATE_BY_CODE[stateCode];
  const gstNumber = fakeGstin(stateCode);
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const mobile = `9${faker.string.numeric(9)}`;
  const workPhone = `0${faker.string.numeric(10)}`;
  const city = faker.location.city();
  const street1 = faker.location.streetAddress();
  const pinCode = faker.location.zipCode("######");

  const billingAddress = {
    ...base.billingAddress,
    attention: `${firstName} ${lastName}`,
    country: "India",
    street1,
    street2: faker.location.secondaryAddress(),
    city,
    state: stateName,
    pinCode,
    phone: mobile,
    fax: "",
  };

  return {
    ...base,
    customerType: "Business",
    salutation: faker.helpers.arrayElement(["Mr.", "Mrs.", "Ms.", "Dr."]),
    firstName,
    lastName,
    companyName,
    displayName: companyName,
    name: companyName,
    email,
    phone: mobile,
    mobile,
    workPhone,
    currency: "INR - Indian Rupee",
    gstNumber,
    gstTreatment: gstNumber,
    placeOfSupply: stateName,
    pan: fakePan(),
    paymentTerms: faker.helpers.arrayElement([
      "Due on Receipt",
      "Net 15",
      "Net 30",
      "Net 45",
    ]),
    priceList: faker.helpers.arrayElement(["None", "Retail", "Wholesale"]),
    enablePortal: faker.datatype.boolean(),
    portalLanguage: "English",
    sameAsBilling: true,
    billingAddress,
    shippingAddress: { ...billingAddress },
    contactPersons: [
      {
        id: `CP-${uid("cp")}`,
        salutation: "Mr.",
        firstName,
        lastName,
        email,
        workPhone,
        mobile,
      },
    ],
  };
}

export function fakeInvoice(base: InvoiceDocument): InvoiceDocument {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const company = faker.company.name().replace(/,/g, "");
  const stateCode = faker.helpers.arrayElement(STATE_CODES);
  const stateName = GST_STATE_BY_CODE[stateCode];
  const gstin = fakeGstin(stateCode);
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const phone = `9${faker.string.numeric(9)}`;

  const lineItems = [
    {
      ...emptyLineItem(),
      description: faker.commerce.productName() + " — Implementation",
      qty: 1,
      rate: Number(faker.commerce.price({ min: 5000, max: 50000, dec: 0 })),
    },
    {
      ...emptyLineItem(),
      description: faker.commerce.productName() + " — Monthly fee",
      qty: faker.number.int({ min: 1, max: 3 }),
      rate: Number(faker.commerce.price({ min: 500, max: 8000, dec: 0 })),
    },
  ];

  const commissionRows = [
    {
      ...emptyCommissionRow(),
      month: "1st Month",
      users: faker.number.int({ min: 5, max: 20 }),
      ratePerUser: 499,
      commissionPercent: 15,
    },
  ];

  const gstApplicable = faker.datatype.boolean();
  const gstPercent = gstApplicable ? 18 : 0;
  const amount = calcGrandTotal(lineItems, gstApplicable, gstPercent);

  const billTo = {
    name: company,
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${stateName} - ${faker.location.zipCode("######")}`,
    gstin,
    stateName,
    stateCode,
    cin: `U${faker.string.numeric(5)}${faker.string.alpha({ length: 2, casing: "upper" })}${faker.string.numeric(4)}PTC${faker.string.numeric(6)}`,
    email,
    phone,
  };

  return {
    ...base,
    name: company,
    email,
    phone,
    amount,
    status: faker.helpers.arrayElement(["Pending", "Paid", "Overdue", "Draft"]),
    date: faker.date.recent({ days: 40 }).toISOString().slice(0, 10),
    billTo,
    lineItems,
    commissionRows,
    gstApplicable,
    gstPercent,
    gstNote: gstApplicable ? `${gstPercent}%` : "Not Applicable",
    notes: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    kind: "invoice",
  };
}

export function fakePayment(base: {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  amount?: number;
  status?: string;
  date?: string;
  category?: string;
  description?: string;
}) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const company = faker.company.name().replace(/,/g, "");
  return {
    ...base,
    name: company,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: `9${faker.string.numeric(9)}`,
    amount: Number(faker.commerce.price({ min: 1000, max: 80000, dec: 0 })),
    status: faker.helpers.arrayElement(["Completed", "Processing", "Failed"]),
    date: faker.date.recent({ days: 30 }).toISOString().slice(0, 10),
    category: faker.helpers.arrayElement(["Bank transfer", "UPI", "Card", "Cash"]),
    description: faker.finance.transactionDescription(),
  };
}
