"use client";

import {
  Layers3,
  Map,
  MapPin,
  Radar,
  Route,
  Satellite,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function GisApplicationPage() {
  return (
    <ServiceOfferingPage
      Icon={MapPin}
      title="GIS Application"
      summary="Location intelligence for smarter decisions."
      about="We build GIS applications that turn maps into business tools — layers, spatial search, field data capture and dashboards so teams can plan routes, monitor assets and analyse geography with clarity."
      heroImage="/gis.jpg"
      heroFeatures={[
        { title: "Interactive Maps", subtitle: "Pan, zoom, explore", icon: Map },
        { title: "Layers", subtitle: "Overlay your data", icon: Layers3 },
        { title: "Field Capture", subtitle: "Collect on the go", icon: MapPin },
        { title: "Insights", subtitle: "Spatial analytics", icon: Radar },
      ]}
      offerings={[
        {
          title: "Map Visualization",
          desc: "Fast, interactive maps tailored to your regions and use cases.",
          icon: Map,
        },
        {
          title: "Spatial Layers",
          desc: "Boundaries, assets, heatmaps and custom overlays.",
          icon: Layers3,
        },
        {
          title: "Field Data Collection",
          desc: "Mobile-friendly capture with geo-tags and photos.",
          icon: MapPin,
        },
        {
          title: "Routing & Coverage",
          desc: "Plan routes, service areas and territory coverage.",
          icon: Route,
        },
        {
          title: "Satellite / Imagery Ready",
          desc: "Integrate imagery sources where your workflow needs them.",
          icon: Satellite,
        },
        {
          title: "Ops Dashboards",
          desc: "Filters, alerts and reports on top of your spatial data.",
          icon: Radar,
        },
      ]}
      outcomes={[
        "Decisions grounded in where things actually are",
        "Field teams and HQ share one live geographic view",
        "Custom layers instead of one-size-fits-all map tools",
        "Web and mobile access for planners and field staff",
      ]}
    />
  );
}
