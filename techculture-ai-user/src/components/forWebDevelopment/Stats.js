"use client";

import {
  FaBriefcase,
  FaUsers,
  FaSmile,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import SpotlightCard, { TEAL_SPOTLIGHT } from "@/components/SpotlightCard";

export default function Stats() {
  const stats = [
    {
      icon: <FaBriefcase />,
      value: "12+ Years",
      label: "in Business",
      border: "border-teal-500",
      bg: "bg-teal-100",
      text: "text-teal-600",
    },
    {
      icon: <FaUsers />,
      value: "100+ Talented",
      label: "Experts",
      border: "border-blue-500",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      icon: <FaSmile />,
      value: "400+ Happy",
      label: "Clients",
      border: "border-yellow-500",
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      icon: <FaGlobe />,
      value: "20+ Countries",
      label: "Served",
      border: "border-purple-500",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      icon: <FaCheckCircle />,
      value: "202+ Projects",
      label: "Delivered",
      border: "border-green-500",
      bg: "bg-green-100",
      text: "text-green-600",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-20 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-12">
        Why <span className="text-teal-main">Gomilestone</span> is the perfect
        mobile <br />
        app development company
      </h2>

      <div className="bg-gray-50 rounded-[2rem] p-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        {stats.map((item, index) => (
          <SpotlightCard
            key={index}
            spotlightColor={TEAL_SPOTLIGHT}
            className={`flex flex-col items-center border-2 ${item.border} rounded-2xl p-6 bg-white hover:shadow-lg transition`}
          >
            <div
              className={`w-12 h-12 ${item.bg} rounded-lg flex items-center justify-center ${item.text} mb-3 text-xl`}
            >
              {item.icon}
            </div>

            <span className="font-bold block">{item.value}</span>
            <span className="text-xs text-gray-500">{item.label}</span>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
