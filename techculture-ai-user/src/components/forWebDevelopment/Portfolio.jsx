// "use client";

// import { useState } from 'react';
// import { FaChevronLeft, FaChevronRight, FaQuoteLeft, FaStar } from 'react-icons/fa';
// import { MdPerson } from 'react-icons/md';

// export default function Testimonials() {
//   const [activeSlide, setActiveSlide] = useState(0);

//   const testimonials = [
//     {
//       text: "I am looking forward to working with the GoMilestone again. I create efficient, adaptable, and engaging websites.",
//       name: "Dora Dybala",
//       position: "CEO & Founder",
//       company: "ConvertKit",
//       rating: 5
//     },
//     {
//       text: "I am looking forward to working with the GoMilestone again. I create efficient, adaptable, and engaging websites.",
//       name: "Dora Dybala",
//       position: "CEO & Founder",
//       company: "ConvertKit",
//       rating: 5
//     },
//     {
//       text: "I am looking forward to working with the GoMilestone again. I create efficient, adaptable, and engaging websites.",
//       name: "Dora Dybala",
//       position: "CEO & Founder",
//       company: "ConvertKit",
//       rating: 5
//     },
//   ];

//   const nextSlide = () => {
//     setActiveSlide((prev) => (prev + 1) % testimonials.length);
//   };

//   const prevSlide = () => {
//     setActiveSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }).map((_, index) => (
//       <FaStar 
//         key={index} 
//         className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
//       />
//     ));
//   };

//   return (
//     <section className="container mx-auto px-6 py-20">
//       <div className="flex justify-between items-center mb-12">
//         <h2 className="text-3xl font-bold">
//           Our <span className="text-teal-600">Happy Clients</span>
//         </h2>
//         <div className="flex space-x-2">
//           <button 
//             onClick={prevSlide}
//             className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-colors duration-300"
//             aria-label="Previous testimonial"
//           >
//             <FaChevronLeft className="w-4 h-4" />
//           </button>
//           <button 
//             onClick={nextSlide}
//             className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center bg-teal-600 text-white hover:bg-teal-700 transition-colors duration-300"
//             aria-label="Next testimonial"
//           >
//             <FaChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {testimonials.map((testimonial, index) => (
//           <div 
//             key={index} 
//             className={`bg-white border border-gray-100 p-8 rounded-2xl shadow-sm transition-all duration-300 relative ${
//               index === activeSlide ? 'transform scale-105 shadow-lg border-teal-200' : ''
//             }`}
//           >
//             {/* Quote icon at top left */}
//             <div className="absolute -top-3 -left-3 w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
//               <FaQuoteLeft className="text-white w-5 h-5" />
//             </div>

//             {/* Star rating */}
//             <div className="flex mb-4">
//               {renderStars(testimonial.rating)}
//             </div>

//             <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
//                   <MdPerson className="text-teal-600 w-6 h-6" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-sm">{testimonial.name}</p>
//                   <p className="text-xs text-gray-500">{testimonial.position}</p>
//                 </div>
//               </div>
//               <span className="text-teal-600 font-bold text-sm">{testimonial.company}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Mobile dots indicator */}
//       <div className="flex justify-center mt-8 md:hidden">
//         <div className="flex space-x-2">
//           {testimonials.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveSlide(index)}
//               className={`w-2 h-2 rounded-full transition-colors duration-300 ${
//                 index === activeSlide ? 'bg-teal-600' : 'bg-gray-300'
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function Portfolio() {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      quote: "I am looking forward to working with the Boltshift again.",
      description: "I create efficient, adaptable, and engaging websites. No predefined patterns. No sluggish, complex code. Webflow forms the foundation of my web development approach. I employ it to provide safe, top-notch bespoke websites.",
      author: "Dora Dybala",
      role: "CEO & Founder of Company",
      company: "ConvertKit",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      quote: "I am looking forward to working with the Boltshift again.",
      description: "I create efficient, adaptable, and engaging websites. No predefined patterns. No sluggish, complex code. Webflow forms the foundation of my web development approach. I employ it to provide safe, top-notch bespoke websites.",
      author: "Dora Dybala",
      role: "CEO & Founder of Company",
      company: "ConvertKit",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    {
      quote: "I am looking forward to working with the Boltshift again.",
      description: "I create efficient, adaptable, and engaging websites. No predefined patterns. No sluggish, complex code. Webflow forms the foundation of my web development approach. I employ it to provide safe, top-notch bespoke websites.",
      author: "Dora Dybala",
      role: "CEO & Founder of Company",
      company: "ConvertKit",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-gray-50/50  py-20 px-6 font-sans">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Our <span className="text-teal-600">Happy Clients</span>
          </h2>
          
          <div className="flex space-x-4">
            <button 
              onClick={prevSlide}
              className="brand-cta-outline w-12 h-12 border rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="brand-cta-gradient w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div 
              key={index} 
              className={`relative bg-white p-8 rounded-[2rem] border-2 transition-all duration-500 flex flex-col justify-between h-full
                ${index === activeSlide 
                  ? 'border-teal-600 shadow-xl shadow-teal-50 ring-4 ring-teal-50' 
                  : 'border-teal-100 hover:border-teal-300'
                }`}
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 leading-tight">
                  "{item.quote}"
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 border-b border-teal-50 pb-8">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.avatar} 
                    alt={item.author} 
                    className="w-12 h-12 rounded-xl object-cover grayscale-[30%]"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.author}</h4>
                    <p className="text-gray-400 text-xs">{item.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1.5 opacity-80">
                  <div className="bg-black text-white p-1 rounded-md">
                    <div className="w-3 h-3 flex items-center justify-center">
                       <div className="bg-white w-full h-full rounded-full" />
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{item.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="brand-cta-gradient px-10 py-4 rounded-xl font-bold hover:scale-105 duration-300">
            View all testimonials
          </button>
        </div>
      </div>
    </section>
  );
}