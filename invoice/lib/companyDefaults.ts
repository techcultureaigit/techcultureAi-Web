export const COMPANY_PROFILE = {
  brandName: "TECH CULTURE",
  legalName: "TECHCULTURE TECHNOLOGIES PRIVATE LIMITED",
  cin: "U62010DL2026PTC460892",
  address:
    "50, 51, Second Floor, Regal Building, Connaught Place, New Delhi, Central Delhi, Delhi, India, 110001",
  /** Seller GST place — used for CGST/SGST vs IGST */
  stateName: "Delhi",
  stateCode: "07",
  email: "hello@techculture.in",
  phone: "",
  bank: {
    beneficiaryName: "TECHCULTURE TECHNOLOGIES PRIVATE LIMITED",
    bankName: "ICICI Bank Limited",
    branch: "New Delhi - K G Marg",
    accountType: "Current Account",
    accountNo: "000705052946",
    ifsc: "ICIC0000007",
  },
  declaration:
    "We declare that this invoice shows the actual price of the goods / services described and that all particulars are true and correct. This is a commercial invoice issued by a non-GST registered supplier.",
  signatoryLabel: "For TECHCULTURE TECHNOLOGIES PRIVATE LIMITED",
  authorisedSignatory: "Authorised Signatory",
  signatoryImage: "/SIGNETURE.png",
};

export const DEFAULT_GST_NOTE = "Not Applicable";

/** Merge settings overrides onto the static company profile. */
export function resolveCompanyProfile(settings?: {
  businessAddress?: string;
  businessCin?: string;
  businessLegalName?: string;
  address?: string;
  cin?: string;
  legalName?: string;
} | null) {
  const address = String(settings?.businessAddress || settings?.address || "").trim();
  const legalName = String(
    settings?.businessLegalName || settings?.legalName || "",
  ).trim();
  const cin = String(settings?.businessCin || settings?.cin || "").trim();
  return {
    ...COMPANY_PROFILE,
    address: address || COMPANY_PROFILE.address,
    legalName: legalName || COMPANY_PROFILE.legalName,
    cin: cin || COMPANY_PROFILE.cin,
  };
}
