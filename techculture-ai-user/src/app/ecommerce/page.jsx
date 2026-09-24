"use client";

import {
  CreditCard,
  LayoutGrid,
  Search,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function EcommercePage() {
  return (
    <ServiceOfferingPage
      Icon={Store}
      title="E-Commerce"
      summary="Online stores, marketplaces and shopping apps for any business."
      about="We design and build conversion-focused e-commerce experiences — from catalog and cart to payments, inventory and order tracking — on web and mobile, tailored to your brand and operations."
      heroImage="/ecommerce.jpg"
      heroAlt="E-Commerce — online stores, marketplaces and shopping apps"
      heroFeatures={[
        { title: "Storefronts", subtitle: "Brand-ready catalogs", icon: Store },
        { title: "Checkout", subtitle: "Fast payment flows", icon: CreditCard },
        { title: "Discovery", subtitle: "Search & filters", icon: Search },
        { title: "Fulfilment", subtitle: "Orders & logistics", icon: Truck },
      ]}
      offerings={[
        {
          title: "Product Catalogs",
          desc: "Variants, pricing, inventory sync and rich media for every SKU.",
          icon: LayoutGrid,
        },
        {
          title: "Cart & Checkout",
          desc: "Frictionless checkout with offers, wallets and COD where needed.",
          icon: ShoppingBag,
        },
        {
          title: "Payments",
          desc: "Secure payment gateway integrations and reconciliation-ready flows.",
          icon: CreditCard,
        },
        {
          title: "Marketplace Ready",
          desc: "Multi-vendor setups, commissions and seller dashboards.",
          icon: Store,
        },
        {
          title: "Mobile Shopping Apps",
          desc: "iOS and Android apps that mirror your store experience.",
          icon: ShoppingBag,
        },
        {
          title: "Order & Logistics",
          desc: "Status tracking, notifications and delivery partner hooks.",
          icon: Truck,
        },
      ]}
      outcomes={[
        "Faster time-to-launch for D2C brands and retailers",
        "Higher conversion with clean UX and trusted checkout",
        "Admin tools your ops team can actually use",
        "Scalable architecture for traffic spikes and campaigns",
      ]}
    />
  );
}
