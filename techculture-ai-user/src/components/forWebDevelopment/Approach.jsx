"use client";

import {
  FaLightbulb,
  FaLayerGroup,
  FaPenNib,
  FaCode,
  FaVials,
  FaComments,
  FaRocket,
  FaHeadset,
} from "react-icons/fa";

export default function Approach() {
  const steps = [
    { number: 1, icon: <FaLightbulb />, title: "Idea & Research" },
    { number: 2, icon: <FaLayerGroup />, title: "Creating a Prototype" },
    { number: 3, icon: <FaPenNib />, title: "Designing the app" },
    { number: 4, icon: <FaCode />, title: "Developing the app" },
    { number: 5, icon: <FaVials />, title: "Testing" },
    { number: 6, icon: <FaComments />, title: "Gathering Feedback" },
    { number: 7, icon: <FaRocket />, title: "Launching app" },
    { number: 8, icon: <FaHeadset />, title: "Ongoing Support" },
  ];

  return (
    <section className="bg-teal-main py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center text-white mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Approach to
          </h2>
          <p className="text-xl opacity-90">app development company</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 relative overflow-hidden bg-white/10 backdrop-blur-sm hover:bg-white/20 transition group"
            >
              {/* Step number */}
              <span className="absolute -left-2 -top-2 text-6xl font-black text-white opacity-10">
                {step.number}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-main mb-4 relative z-10 text-xl">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-white font-bold text-lg relative z-10">
                {step.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
