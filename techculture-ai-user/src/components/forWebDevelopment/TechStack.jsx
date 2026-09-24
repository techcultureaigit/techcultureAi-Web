"use client";

import {
  FaCode,
  FaDatabase,
  FaFigma,
  FaMobileAlt,
  FaNodeJs,
  FaPaintBrush,
  FaPhp,
  FaReact,
  FaServer,
} from "react-icons/fa";
import { SiAdobe, SiNextdotjs } from "react-icons/si";

export default function TechStack() {
  const techStacks = [
    {
      label: "Designing Tools",
      icon: <FaPaintBrush />,
      items: [
        {
          icon: <SiAdobe />,
          name: "Adobe Suite",
          color: "text-red-600",
        },
        {
          icon: <FaFigma />,
          name: "Figma",
          color: "text-purple-600",
        },
      ],
    },
    {
      label: "Front-End Development",
      icon: <FaCode />,
      items: [
        {
          icon: <FaReact />,
          name: "React.js",
          color: "text-blue-500",
        },
        {
          icon: <FaMobileAlt />,
          name: "React Native",
          color: "text-teal-600",
        },
        {
          icon: <SiNextdotjs />,
          name: "Next.js",
          color: "text-gray-800",
        },
      ],
    },
    {
      label: "Back-End Development",
      icon: <FaServer />,
      items: [
        {
          icon: <FaPhp />,
          name: "PHP",
          color: "text-indigo-600",
        },
        {
          icon: <FaNodeJs />,
          name: "Node.js",
          color: "text-green-600",
        },
        {
          icon: <FaDatabase />,
          name: "Database",
          color: "text-blue-600",
        },
      ],
    },
  ];

  return (
    <section className="container mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl font-bold mb-12">
        Our Technology Stack For{" "}
        <span className="text-teal-main">Design & Development</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {techStacks.map((stack, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold mb-6">{stack.label}</h3>

            <div className="flex justify-around items-center">
              {stack.items.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className={`text-4xl ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
