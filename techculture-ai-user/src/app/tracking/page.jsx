"use client";

import {
  Bell,
  MapPin,
  Navigation,
  Package,
  Route,
  Truck,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function TrackingPage() {
  return (
    <ServiceOfferingPage
      Icon={MapPin}
      title="Tracking System"
      summary="Real-time tracking for logistics, assets, field teams and deliveries."
      about="We design tracking platforms that show where things are — vehicles, shipments, assets or field staff — with live maps, status updates, alerts and admin dashboards your operations team can trust."
      heroImage="/tracking.jpg"
      heroFeatures={[
        { title: "Live Maps", subtitle: "Real-time positions", icon: MapPin },
        { title: "Fleet & Assets", subtitle: "Vehicles & inventory", icon: Truck },
        { title: "Shipments", subtitle: "Order journey view", icon: Package },
        { title: "Alerts", subtitle: "Delay & geo alerts", icon: Bell },
      ]}
      offerings={[
        {
          title: "Live Location Tracking",
          desc: "GPS / device feeds with map views and history playback.",
          icon: Navigation,
        },
        {
          title: "Fleet & Field Teams",
          desc: "Track vehicles or agents with status and route context.",
          icon: Truck,
        },
        {
          title: "Shipment Tracking",
          desc: "Customer-facing and ops views for delivery milestones.",
          icon: Package,
        },
        {
          title: "Geofence & Alerts",
          desc: "Notify on delays, entry/exit zones and exceptions.",
          icon: Bell,
        },
        {
          title: "Ops Dashboard",
          desc: "Filters, timelines and SLA views for dispatch teams.",
          icon: Route,
        },
        {
          title: "Mobile Companion Apps",
          desc: "Driver / agent apps that push location and status updates.",
          icon: MapPin,
        },
      ]}
      outcomes={[
        "Fewer “where is it?” calls with live visibility",
        "Faster exception handling with alerts and history",
        "Customer-ready tracking links when you need them",
        "Works with web dashboards and mobile field apps",
      ]}
    />
  );
}
