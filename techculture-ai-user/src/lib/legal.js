import { COMPANY } from "./company";

const LAST_UPDATED = "25 September 2026";

/** Shared legal / policy documents for footer links */
export const LEGAL_PAGES = {
  "privacy-policy": {
    title: "Privacy Policy",
    summary:
      "How TechCulture AI collects, uses, stores, and protects your personal information.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "Who we are",
        body: `${COMPANY.legalName} ("TechCulture AI", "we", "us") provides software products and digital services including KYC, onboarding, middleware, and custom applications. This policy explains how we handle personal data when you use our websites, products, demos, or contact us.`,
      },
      {
        heading: "Information we collect",
        body: "We may collect identity and contact details (name, email, phone, company), business information shared in demos or proposals, technical data such as IP address, browser type, and device information, and communications you send us via forms, email, or support channels.",
      },
      {
        heading: "How we use information",
        body: "We use personal data to respond to enquiries, deliver demos and services, improve our products and website, send service-related messages, and meet legal or compliance obligations. We do not sell personal data.",
      },
      {
        heading: "Sharing and processors",
        body: "We may share data with trusted service providers who help us operate (hosting, analytics, email delivery), with partners only when needed to fulfil a request you initiated, or when required by law. Processors are expected to protect data appropriately.",
      },
      {
        heading: "Retention and security",
        body: "We keep personal data only as long as needed for the purposes above or as required by law. We apply reasonable technical and organisational measures to protect information against unauthorised access, loss, or misuse.",
      },
      {
        heading: "Your choices",
        body: "Depending on applicable law, you may request access, correction, or deletion of your personal data, or withdraw consent where processing is based on consent. Contact us using the details below to exercise these rights.",
      },
      {
        heading: "Contact",
        body: `For privacy questions, email ${COMPANY.email}. Registered office: ${COMPANY.registeredAddress.singleLine}. Corporate office: ${COMPANY.corporateAddress.singleLine}. CIN: ${COMPANY.cin}.`,
      },
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    summary:
      "Our approach to fees, cancellations, and refunds for paid products and services.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "Scope",
        body: "This policy applies to paid licenses, implementation fees, subscriptions, and professional services purchased from TechCulture AI. Free demos, trials, and unpaid evaluations are not eligible for refunds.",
      },
      {
        heading: "Subscriptions and licenses",
        body: "Unless a written order form states otherwise, subscription fees are billed in advance and are non-refundable for the prepaid period once access is provisioned. You may cancel renewal before the next billing cycle; access continues until the end of the paid term.",
      },
      {
        heading: "Implementation and custom work",
        body: "Custom development, integration, and implementation fees are generally non-refundable once work has started, except where we fail to deliver agreed milestones due to reasons solely attributable to us. Milestone-based contracts follow the payment schedule in the statement of work.",
      },
      {
        heading: "Eligible refunds",
        body: "We may issue a partial or full refund at our discretion if a product is unavailable as described, a duplicate charge occurred, or a written agreement expressly provides a refund window. Approved refunds are processed to the original payment method within a reasonable time.",
      },
      {
        heading: "How to request",
        body: `Email ${COMPANY.email} with your invoice or order reference, purchase date, and reason for the request. We will review and respond within a reasonable business period.`,
      },
      {
        heading: "Contact",
        body: `${COMPANY.legalName}. Email: ${COMPANY.email}. Phone: ${COMPANY.phone}. Corporate: ${COMPANY.corporateAddress.singleLine}.`,
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    summary:
      "The terms that govern use of TechCulture AI websites, demos, and software services.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "Agreement",
        body: `By accessing our websites or using our products and services, you agree to these Terms of Service with ${COMPANY.legalName}. If you use our services on behalf of an organisation, you represent that you are authorised to bind that organisation.`,
      },
      {
        heading: "Services",
        body: "We provide software platforms, APIs, middleware, professional services, and related digital solutions. Specific features, SLAs, and commercial terms may be set out in a separate order form, MSA, or statement of work, which prevails if there is a conflict.",
      },
      {
        heading: "Acceptable use",
        body: "You must not misuse our services, attempt unauthorised access, reverse engineer except as permitted by law, upload unlawful content, or use our platforms in ways that violate applicable regulations including data protection and financial-services rules relevant to your business.",
      },
      {
        heading: "Accounts and credentials",
        body: "You are responsible for safeguarding login credentials and for activity under your accounts. Notify us promptly of any suspected unauthorised use.",
      },
      {
        heading: "Intellectual property",
        body: "We retain ownership of our software, branding, documentation, and pre-existing materials. You retain ownership of your content and data. Limited licenses are granted only as needed to use the services during the subscription term.",
      },
      {
        heading: "Disclaimer and liability",
        body: "Services are provided on an \"as available\" basis except where a written SLA applies. To the fullest extent permitted by law, we are not liable for indirect or consequential losses. Our aggregate liability for a claim is limited to fees paid for the affected service in the twelve months before the claim, unless a signed contract states otherwise.",
      },
      {
        heading: "Contact",
        body: `Questions about these terms: ${COMPANY.email}. ${COMPANY.legalName}, CIN ${COMPANY.cin}.`,
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    summary:
      "How we use cookies and similar technologies on TechCulture AI websites.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "What are cookies",
        body: "Cookies are small text files stored on your device when you visit a website. Similar technologies include local storage and pixels. They help sites work, remember preferences, and understand usage.",
      },
      {
        heading: "How we use cookies",
        body: "We may use essential cookies required for security and core site functions, preference cookies to remember choices, and analytics cookies to understand how visitors use our pages so we can improve content and performance.",
      },
      {
        heading: "Managing cookies",
        body: "You can control cookies through your browser settings, including blocking or deleting cookies. Disabling essential cookies may affect site functionality. Where required by law, we will request consent for non-essential cookies.",
      },
      {
        heading: "Updates",
        body: "We may update this Cookie Policy when our practices or tools change. The \"Last updated\" date at the top of this page reflects the latest revision.",
      },
      {
        heading: "Contact",
        body: `For cookie-related questions, contact ${COMPANY.email}.`,
      },
    ],
  },
};

export const LEGAL_FOOTER_LINKS = [
  { name: "Privacy Policy", href: "/privacy-policy", key: "privacy-policy" },
  { name: "Refund Policy", href: "/refund-policy", key: "refund-policy" },
  { name: "Terms of Service", href: "/terms-of-service", key: "terms-of-service" },
  { name: "Cookie Policy", href: "/cookie-policy", key: "cookie-policy" },
];
