// "use client";

// import React, { useState, useCallback } from 'react';
// import { ChevronLeft, ChevronRight, User, Calendar, Briefcase, MessageSquare, ClipboardList, Check } from 'lucide-react';

// const PhoneCarousel = () => {
//   const slides = [
//     { 
//       id: 1, 
//       title: "Job Details", 
//       color: "bg-gray-100", 
//       content: "Detailed job information and requirements" 
//     },
//     { 
//       id: 2, 
//       title: "Chat Interface", 
//       color: "bg-blue-50", 
//       content: "Real-time messaging with employers" 
//     },
//     { 
//       id: 3, 
//       title: "Main Profile", 
//       color: "bg-black text-white", 
//       isMain: true 
//     },
//     { 
//       id: 4, 
//       title: "Activity Overview", 
//       color: "bg-white", 
//       content: "Your recent activities and applications" 
//     },
//     { 
//       id: 5, 
//       title: "Job Modification", 
//       color: "bg-gray-50", 
//       content: "Edit and manage job preferences" 
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(2);
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);

//   const nextSlide = useCallback(() => {
//     setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   }, [slides.length]);

//   const prevSlide = useCallback(() => {
//     setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   }, [slides.length]);

//   const minSwipeDistance = 50;

//   const onTouchStart = (e) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;
//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;
//     if (isLeftSwipe) nextSlide();
//     if (isRightSwipe) prevSlide();
//   };

//   return (
//     <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Interactive <span className="text-teal-600">Mobile Experience</span>
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Experience our mobile-first approach with this interactive 3D carousel showcasing our app features
//           </p>
//         </div>

//         <div className="relative w-full flex items-center justify-center h-[500px] md:h-[600px]">
//           {/* Left Navigation Button */}
//           <button 
//             onClick={prevSlide}
//             className="absolute left-0 md:left-4 z-50 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl"
//             aria-label="Previous slide"
//           >
//             <ChevronLeft size={24} />
//           </button>

//           {/* Slides Wrapper */}
//           <div 
//             className="relative w-full h-full flex items-center justify-center"
//             onTouchStart={onTouchStart}
//             onTouchMove={onTouchMove}
//             onTouchEnd={onTouchEnd}
//           >
//             {slides.map((slide, index) => {
//               const offset = index - currentIndex;
//               const absOffset = Math.abs(offset);
//               const isVisible = absOffset <= 2;
              
//               if (!isVisible) return null;

//               return (
//                 <div
//                   key={slide.id}
//                   className="absolute transition-all duration-500 ease-out cursor-pointer"
//                   style={{
//                     transform: `
//                       translateX(${offset * (window.innerWidth < 640 ? 40 : 100)}px) 
//                       scale(${1 - absOffset * 0.15}) 
//                       rotateY(${offset * -10}deg)
//                       translateZ(${-absOffset * 80}px)
//                     `,
//                     zIndex: 10 - absOffset,
//                     opacity: 1 - absOffset * 0.3,
//                     perspective: '1000px'
//                   }}
//                   onClick={() => setCurrentIndex(index)}
//                 >
//                   {/* Phone Mockup Frame */}
//                   <div className={`w-[240px] h-[480px] md:w-[280px] md:h-[560px] rounded-[2.5rem] border-[10px] border-black shadow-2xl overflow-hidden relative ${slide.color}`}>
//                     {/* Speaker/Camera Notch */}
//                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-20"></div>
                    
//                     {/* Mock Content */}
//                     {slide.isMain ? (
//                       <ProfileMockup />
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full p-6">
//                         <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
//                           <div className="text-teal-600">
//                             {slide.id === 1 && <Briefcase size={24} />}
//                             {slide.id === 2 && <MessageSquare size={24} />}
//                             {slide.id === 4 && <Calendar size={24} />}
//                             {slide.id === 5 && <ClipboardList size={24} />}
//                           </div>
//                         </div>
//                         <h3 className="text-lg font-bold text-gray-800 mb-2">{slide.title}</h3>
//                         <p className="text-gray-600 text-sm text-center">{slide.content}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Right Navigation Button */}
//           <button 
//             onClick={nextSlide}
//             className="absolute right-0 md:right-4 z-50 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl"
//             aria-label="Next slide"
//           >
//             <ChevronRight size={24} />
//           </button>
//         </div>

//         {/* Slide Indicators */}
//         <div className="flex justify-center mt-8 space-x-2">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                 index === currentIndex ? 'bg-teal-600 w-8' : 'bg-gray-300'
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>

//         {/* Current Slide Info */}
//         <div className="text-center mt-8">
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             {slides[currentIndex].title}
//           </h3>
//           <p className="text-gray-600 max-w-md mx-auto">
//             {slides[currentIndex].isMain 
//               ? "Complete profile management with interactive controls" 
//               : slides[currentIndex].content}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// const ProfileMockup = () => (
//   <div className="h-full flex flex-col pt-8 bg-[#0a0a0a] text-white overflow-y-auto">
//     <div className="px-6 pb-4">
//       <div className="flex flex-col items-center mb-4">
//         <h1 className="text-lg font-semibold">Jasmine Perez <span className="text-teal-400 text-xs">●</span></h1>
//         <div className="flex text-yellow-400 space-x-0.5 my-1">
//           {[1,2,3,4,5].map(i => <span key={i} className="text-[10px]">★</span>)}
//         </div>
//         <p className="text-[10px] text-gray-400">Account # P2037</p>
        
//         <div className="relative mt-2">
//           <div className="w-20 h-20 rounded-full border-2 border-teal-400 p-1">
//             <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white">
//               <User size={32} />
//             </div>
//           </div>
//           <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-black">
//             <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
//                <span className="text-[8px]">📷</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-4">
//         <div className="flex justify-between text-[10px] mb-1 px-1">
//           <span>Profile Complete</span>
//           <span>7/7</span>
//         </div>
//         <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
//           <div className="w-[100%] h-full bg-teal-400"></div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <ProfileListItem icon={<Briefcase size={14}/>} label="Available for Permanent Job" hasToggle />
//         <ProfileListItem icon={<User size={14}/>} label="Contact Information" hasChevron />
//         <ProfileListItem icon={<Briefcase size={14}/>} label="Professional Information" hasChevron />
//         <ProfileListItem icon={<User size={14}/>} label="About Me" hasChevron />
//         <ProfileListItem icon={<MessageSquare size={14}/>} label="Video Introduction" hasChevron />
//         <ProfileListItem icon={<ClipboardList size={14}/>} label="Address" hasChevron />
//       </div>
//     </div>

//     {/* Bottom Nav Mockup */}
//     <div className="mt-auto bg-[#1a1a1a] p-3 flex justify-around items-center border-t border-gray-800">
//       <div className="flex flex-col items-center opacity-50"><User size={16}/><span className="text-[8px] mt-1">Home</span></div>
//       <div className="flex flex-col items-center opacity-50"><Calendar size={16}/><span className="text-[8px] mt-1">Calendar</span></div>
//       <div className="flex flex-col items-center opacity-50"><Briefcase size={16}/><span className="text-[8px] mt-1">Jobs</span></div>
//       <div className="flex flex-col items-center opacity-100 text-teal-400"><MessageSquare size={16}/><span className="text-[8px] mt-1">Messages</span></div>
//       <div className="flex flex-col items-center opacity-50"><ClipboardList size={16}/><span className="text-[8px] mt-1">Records</span></div>
//     </div>
//   </div>
// );

// const ProfileListItem = ({ icon, label, hasToggle, hasChevron }) => (
//   <div className="bg-[#1a1a1a] p-3 rounded-lg flex items-center justify-between hover:bg-[#222] transition-colors">
//     <div className="flex items-center space-x-3">
//       <div className="text-gray-400">{icon}</div>
//       <span className="text-xs font-medium">{label}</span>
//     </div>
//     {hasToggle && (
//       <div className="w-8 h-4 bg-teal-600 rounded-full relative">
//         <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
//       </div>
//     )}
//     {hasChevron && <ChevronRight size={14} className="text-teal-400" />}
//   </div>
// );

// export default PhoneCarousel;

// "use client";

// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { ChevronLeft, ChevronRight, User, Calendar, Briefcase, MessageSquare, ClipboardList } from 'lucide-react';

// const PhoneCarousel = () => {
//   // Create an expandable array of slides - you can add as many as you want
//   const baseSlides = [
//     { 
//       id: 1, 
//       title: "Job Details", 
//       color: "bg-gray-100", 
//       icon: <Briefcase size={24} />,
//       content: "Detailed job information and requirements" 
//     },
//     { 
//       id: 2, 
//       title: "Chat Interface", 
//       color: "bg-blue-50", 
//       icon: <MessageSquare size={24} />,
//       content: "Real-time messaging with employers" 
//     },
//     { 
//       id: 3, 
//       title: "Main Profile", 
//       color: "bg-black text-white", 
//       isMain: true 
//     },
//     { 
//       id: 4, 
//       title: "Activity Overview", 
//       color: "bg-white", 
//       icon: <Calendar size={24} />,
//       content: "Your recent activities and applications" 
//     },
//     { 
//       id: 5, 
//       title: "Job Modification", 
//       color: "bg-gray-50", 
//       icon: <ClipboardList size={24} />,
//       content: "Edit and manage job preferences" 
//     },
//     { 
//       id: 6, 
//       title: "Notifications", 
//       color: "bg-purple-50", 
//       icon: <MessageSquare size={24} />,
//       content: "Stay updated with alerts and notifications" 
//     },
//     { 
//       id: 7, 
//       title: "Analytics", 
//       color: "bg-green-50", 
//       icon: <ClipboardList size={24} />,
//       content: "Track your job application performance" 
//     },
//   ];

//   // We'll create a longer array by duplicating the slides for seamless infinite scrolling
//   const [slides, setSlides] = useState([...baseSlides, ...baseSlides, ...baseSlides]);
//   const [currentIndex, setCurrentIndex] = useState(baseSlides.length); // Start in the middle of duplicated array
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);
//   const [autoScroll, setAutoScroll] = useState(true);
//   const autoScrollRef = useRef(null);

//   // Handle infinite scrolling
//   const nextSlide = useCallback(() => {
//     setCurrentIndex(prev => {
//       const nextIndex = prev + 1;
      
//       // If we're near the end of the duplicated array, reset to middle without animation
//       if (nextIndex >= slides.length - baseSlides.length) {
//         // Schedule a reset to middle of array after transition
//         setTimeout(() => {
//           setCurrentIndex(baseSlides.length);
//         }, 50);
//         return nextIndex;
//       }
      
//       return nextIndex;
//     });
//   }, [slides.length, baseSlides.length]);

//   const prevSlide = useCallback(() => {
//     setCurrentIndex(prev => {
//       const prevIndex = prev - 1;
      
//       // If we're near the beginning of the duplicated array, reset to middle without animation
//       if (prevIndex <= baseSlides.length) {
//         // Schedule a reset to middle of array after transition
//         setTimeout(() => {
//           setCurrentIndex(slides.length - baseSlides.length * 2);
//         }, 50);
//         return prevIndex;
//       }
      
//       return prevIndex;
//     });
//   }, [slides.length, baseSlides.length]);

//   // Add a new slide dynamically
//   const addNewSlide = useCallback(() => {
//     const newSlide = {
//       id: slides.length + 1,
//       title: `New Feature ${slides.length + 1}`,
//       color: `bg-${['blue', 'green', 'purple', 'yellow', 'indigo'][Math.floor(Math.random() * 5)]}-50`,
//       icon: [<Briefcase size={24} />, <MessageSquare size={24} />, <Calendar size={24} />, <ClipboardList size={24} />, <User size={24} />][Math.floor(Math.random() * 5)],
//       content: "Newly added feature with interactive controls"
//     };
    
//     // Add to both baseSlides and the extended slides array
//     baseSlides.push(newSlide);
    
//     // Refresh the slides array with the new slide included in all three segments
//     setSlides([...baseSlides, ...baseSlides, ...baseSlides]);
//   }, [slides.length]);

//   // Auto-scroll functionality
//   useEffect(() => {
//     if (autoScroll) {
//       autoScrollRef.current = setInterval(() => {
//         nextSlide();
//       }, 3000);
//     } else {
//       clearInterval(autoScrollRef.current);
//     }
    
//     return () => clearInterval(autoScrollRef.current);
//   }, [autoScroll, nextSlide]);

//   // Touch swipe handling
//   const minSwipeDistance = 50;

//   const onTouchStart = (e) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;
//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;
//     if (isLeftSwipe) nextSlide();
//     if (isRightSwipe) prevSlide();
//   };

//   // Calculate which slides to display
//   const getVisibleSlides = () => {
//     const visibleSlides = [];
//     const totalVisible = 5; // Show 5 slides at once
    
//     for (let i = -2; i <= 2; i++) {
//       const slideIndex = (currentIndex + i + slides.length) % slides.length;
//       visibleSlides.push({
//         ...slides[slideIndex],
//         offset: i,
//         absOffset: Math.abs(i),
//         isVisible: true
//       });
//     }
    
//     return visibleSlides;
//   };

//   return (
//     <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
//       <div className="container mx-auto px-4">
//         {/* <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Infinite <span className="text-teal-600">3D Carousel</span>
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto mb-6">
//             Continuously looping 3D carousel with unlimited slides. Add as many as you want!
//           </p>
          
//           <div className="flex flex-wrap gap-4 justify-center">
//             <button 
//               onClick={() => setAutoScroll(!autoScroll)}
//               className={`px-4 py-2 rounded-lg transition-all ${autoScroll ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
//             >
//               {autoScroll ? '❚❚ Pause' : '▶ Auto-scroll'}
//             </button>
//             <button 
//               onClick={addNewSlide}
//               className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
//             >
//               + Add New Slide
//             </button>
//             <div className="px-4 py-2 bg-gray-800 text-white rounded-lg">
//               Total Slides: {baseSlides.length}
//             </div>
//           </div>
//         </div> */}

//         <div className="relative w-full flex items-center justify-center h-[500px] md:h-[600px]">
//           {/* Left Navigation Button */}
//           <button 
//             onClick={prevSlide}
//             className="absolute left-0 md:left-4 z-50 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl"
//             aria-label="Previous slide"
//           >
//             <ChevronLeft size={24} />
//           </button>

//           {/* Slides Wrapper */}
//           <div 
//             className="relative w-full h-full flex items-center justify-center"
//             onTouchStart={onTouchStart}
//             onTouchMove={onTouchMove}
//             onTouchEnd={onTouchEnd}
//           >
//             {getVisibleSlides().map((slide) => {
//               const { offset, absOffset } = slide;
//               const isCenter = offset === 0;
              
//               return (
//                 <div
//                   key={`${slide.id}-${currentIndex + offset}`}
//                   className="absolute transition-all duration-500 ease-out cursor-pointer"
//                   style={{
//                     transform: `
//                       translateX(${offset * (window.innerWidth < 640 ? 60 : 120)}px) 
//                       scale(${1 - absOffset * 0.2}) 
//                       rotateY(${offset * -15}deg)
//                       translateZ(${-absOffset * 100}px)
//                     `,
//                     zIndex: isCenter ? 30 : 20 - absOffset,
//                     opacity: 1 - absOffset * 0.4,
//                     perspective: '1000px',
//                     filter: isCenter ? 'none' : `brightness(${1 - absOffset * 0.2})`
//                   }}
//                   onClick={() => {
//                     if (offset < 0) prevSlide();
//                     if (offset > 0) nextSlide();
//                     if (offset === 0) {
//                       // Center slide clicked - you could add special behavior here
//                     }
//                   }}
//                 >
//                   {/* Phone Mockup Frame */}
//                   <div className={`w-[220px] h-[440px] md:w-[260px] md:h-[520px] rounded-[2.5rem] border-[10px] border-black shadow-2xl overflow-hidden relative ${slide.color}`}>
//                     {/* Speaker/Camera Notch */}
//                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-b-xl z-20"></div>
                    
//                     {/* Mock Content */}
//                     {slide.isMain ? (
//                       <ProfileMockup />
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full p-6">
//                         <div className={`w-16 h-16 rounded-full ${slide.color.includes('bg-black') ? 'bg-teal-900' : 'bg-teal-100'} flex items-center justify-center mb-4`}>
//                           <div className="text-teal-600">
//                             {slide.icon}
//                           </div>
//                         </div>
//                         <h3 className="text-lg font-bold text-gray-800 mb-2">{slide.title}</h3>
//                         <p className="text-gray-600 text-sm text-center">{slide.content}</p>
//                         <div className="absolute bottom-4 text-xs text-gray-400">
//                           Slide #{slide.id}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Right Navigation Button */}
//           <button 
//             onClick={nextSlide}
//             className="absolute right-0 md:right-4 z-50 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl"
//             aria-label="Next slide"
//           >
//             <ChevronRight size={24} />
//           </button>
//         </div>

//         {/* Slide Indicators - only show base slides */}
//         <div className="flex justify-center mt-8 space-x-2">
//           {baseSlides.map((slide, index) => {
//             // Calculate which base slide is currently centered
//             const currentBaseIndex = (currentIndex - baseSlides.length) % baseSlides.length;
//             const adjustedIndex = currentBaseIndex < 0 ? currentBaseIndex + baseSlides.length : currentBaseIndex;
            
//             return (
//               <button
//                 key={index}
//                 onClick={() => setCurrentIndex(index + baseSlides.length)}
//                 className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                   index === adjustedIndex ? 'bg-teal-600 w-8' : 'bg-gray-300'
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             );
//           })}
//         </div>

//         {/* Current Slide Info */}
//         <div className="text-center mt-8">
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             {slides[currentIndex % baseSlides.length]?.title || slides[baseSlides.length]?.title}
//           </h3>
//           <p className="text-gray-600 max-w-md mx-auto">
//             {slides[currentIndex % baseSlides.length]?.isMain 
//               ? "Complete profile management with interactive controls" 
//               : slides[currentIndex % baseSlides.length]?.content}
//           </p>
//           <div className="mt-4 text-sm text-gray-500">
//             Slide {((currentIndex - baseSlides.length) % baseSlides.length) + 1} of {baseSlides.length}
//             <span className="mx-2">•</span>
//             {autoScroll ? 'Auto-scrolling' : 'Manual mode'}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const ProfileMockup = () => (
//   <div className="h-full flex flex-col pt-8 bg-[#0a0a0a] text-white overflow-y-auto">
//     <div className="px-6 pb-4">
//       <div className="flex flex-col items-center mb-4">
//         <h1 className="text-lg font-semibold">Jasmine Perez <span className="text-teal-400 text-xs">●</span></h1>
//         <div className="flex text-yellow-400 space-x-0.5 my-1">
//           {[1,2,3,4,5].map(i => <span key={i} className="text-[10px]">★</span>)}
//         </div>
//         <p className="text-[10px] text-gray-400">Account # P2037</p>
        
//         <div className="relative mt-2">
//           <div className="w-20 h-20 rounded-full border-2 border-teal-400 p-1">
//             <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white">
//               <User size={32} />
//             </div>
//           </div>
//           <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-black">
//             <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
//                <span className="text-[8px]">📷</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-4">
//         <div className="flex justify-between text-[10px] mb-1 px-1">
//           <span>Profile Complete</span>
//           <span>7/7</span>
//         </div>
//         <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
//           <div className="w-[100%] h-full bg-teal-400"></div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <ProfileListItem icon={<Briefcase size={14}/>} label="Available for Permanent Job" hasToggle />
//         <ProfileListItem icon={<User size={14}/>} label="Contact Information" hasChevron />
//         <ProfileListItem icon={<Briefcase size={14}/>} label="Professional Information" hasChevron />
//         <ProfileListItem icon={<User size={14}/>} label="About Me" hasChevron />
//         <ProfileListItem icon={<MessageSquare size={14}/>} label="Video Introduction" hasChevron />
//         <ProfileListItem icon={<ClipboardList size={14}/>} label="Address" hasChevron />
//       </div>
//     </div>

//     {/* Bottom Nav Mockup */}
//     <div className="mt-auto bg-[#1a1a1a] p-3 flex justify-around items-center border-t border-gray-800">
//       <div className="flex flex-col items-center opacity-50"><User size={16}/><span className="text-[8px] mt-1">Home</span></div>
//       <div className="flex flex-col items-center opacity-50"><Calendar size={16}/><span className="text-[8px] mt-1">Calendar</span></div>
//       <div className="flex flex-col items-center opacity-50"><Briefcase size={16}/><span className="text-[8px] mt-1">Jobs</span></div>
//       <div className="flex flex-col items-center opacity-100 text-teal-400"><MessageSquare size={16}/><span className="text-[8px] mt-1">Messages</span></div>
//       <div className="flex flex-col items-center opacity-50"><ClipboardList size={16}/><span className="text-[8px] mt-1">Records</span></div>
//     </div>
//   </div>
// );

// const ProfileListItem = ({ icon, label, hasToggle, hasChevron }) => (
//   <div className="bg-[#1a1a1a] p-3 rounded-lg flex items-center justify-between hover:bg-[#222] transition-colors">
//     <div className="flex items-center space-x-3">
//       <div className="text-gray-400">{icon}</div>
//       <span className="text-xs font-medium">{label}</span>
//     </div>
//     {hasToggle && (
//       <div className="w-8 h-4 bg-teal-600 rounded-full relative">
//         <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
//       </div>
//     )}
//     {hasChevron && <ChevronRight size={14} className="text-teal-400" />}
//   </div>
// );

// export default PhoneCarousel;
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  BarChart,
  FileText,
  Database,
  TrendingUp,
  Building2,
  ShieldCheck,
  Plug,
  RefreshCw,
  UserCircle,
  DoorOpen,
  Users,
  GraduationCap,
  Rocket,
  Layout,
  PieChart,
  MapPin,
  PenLine,
  Landmark,
  GitMerge,
  Globe2,
  Network,
  LifeBuoy,
} from 'lucide-react';

const ECOSYSTEM_SLIDES = [
  {
    id: 1,
    title: "DigiLocker",
    shortLabel: "DigiLocker",
    subtitle: "Digital Documents",
    color: "from-teal-500 to-teal-600",
    icon: <FileText size={28} />,
    content: "Aadhaar-based digital document access for instant, verified onboarding.",
    features: ["Secure Aadhaar authentication", "Pull PAN & address proofs", "Real-time document validation"],
    stats: { metric: "2.4M+", metricLabel: "Docs Fetched", growth: "+18%" },
  },
  {
    id: 2,
    title: "CDSL & NSDL",
    shortLabel: "CDSL/NSDL",
    subtitle: "Depository",
    color: "from-emerald-500 to-teal-600",
    icon: <Database size={28} />,
    content: "Depository integration for seamless demat and holdings management.",
    features: ["Demat account linking", "Holdings sync in real-time", "DP-ID verification"],
    stats: { metric: "98%", metricLabel: "Sync Accuracy", growth: "+12%" },
  },
  {
    id: 3,
    title: "NSE & BSE",
    shortLabel: "NSE/BSE",
    subtitle: "Exchanges",
    color: "from-cyan-500 to-teal-600",
    icon: <TrendingUp size={28} />,
    content: "Exchange connectivity for live markets, orders, and settlements.",
    features: ["Live market data feeds", "Order routing APIs", "Settlement integration"],
    stats: { metric: "24/7", metricLabel: "Market Access", growth: "+15%" },
  },
  {
    id: 4,
    title: "MCA APIs",
    shortLabel: "MCA",
    subtitle: "Corporate Verify",
    color: "from-slate-600 to-slate-800",
    icon: <Building2 size={28} />,
    content: "Corporate verification via Ministry of Corporate Affairs data.",
    features: ["Company master lookup", "Director KYC checks", "Compliance status tracking"],
    stats: { metric: "50K+", metricLabel: "Entities", growth: "+9%" },
  },
  {
    id: 5,
    title: "KRA / CKYC",
    shortLabel: "KRA/CKYC",
    subtitle: "KYC Registry",
    color: "from-teal-600 to-emerald-600",
    icon: <ShieldCheck size={28} />,
    content: "KYC registry access for centralized, SEBI-compliant identity records.",
    features: ["Central KYC fetch", "Registry updates", "Audit-ready records"],
    stats: { metric: "1.2M+", metricLabel: "KYC Records", growth: "+22%" },
  },
  {
    id: 6,
    title: "RESTful APIs",
    shortLabel: "APIs",
    subtitle: "Integration",
    color: "from-violet-500 to-purple-600",
    icon: <Plug size={28} />,
    content: "Seamless system integration with open, enterprise-grade APIs.",
    features: ["RESTful architecture", "SDK & webhook support", "Enterprise SLAs"],
    stats: { metric: "99.9%", metricLabel: "Uptime", growth: "+8%" },
  },
  {
    id: 7,
    title: "ReKYC",
    shortLabel: "ReKYC",
    subtitle: "Renewal",
    color: "from-orange-500 to-amber-600",
    icon: <RefreshCw size={28} />,
    content: "Automated periodic KYC renewal with risk-based triggers.",
    features: ["Trigger-based renewals", "Risk scoring engine", "Auto-notifications"],
    stats: { metric: "70%", metricLabel: "Auto-Approved", growth: "+14%" },
  },
  {
    id: 8,
    title: "Account",
    shortLabel: "Account",
    subtitle: "Onboarding",
    color: "from-blue-500 to-blue-600",
    icon: <UserCircle size={28} />,
    content: "End-to-end digital account opening across multiple products.",
    features: ["Digital onboarding", "Multi-product accounts", "Instant activation"],
    stats: { metric: "3min", metricLabel: "Avg. Open Time", growth: "+25%" },
  },
  {
    id: 9,
    title: "Closure",
    shortLabel: "Closure",
    subtitle: "Account Exit",
    color: "from-gray-600 to-gray-800",
    icon: <DoorOpen size={28} />,
    content: "Streamlined account closure with compliance and settlement checks.",
    features: ["Automated settlement", "Document archival", "Regulatory closure"],
    stats: { metric: "100%", metricLabel: "Compliance", growth: "+5%" },
  },
  {
    id: 10,
    title: "Entire Ecosystem",
    shortLabel: "Ecosystem",
    color: "from-teal-600 to-emerald-500",
    isMain: true,
    content: "One unified platform connecting India's entire financial infrastructure.",
  },
  {
    id: 11,
    title: "HRMS",
    shortLabel: "HRMS",
    subtitle: "Human Resources",
    color: "from-pink-500 to-rose-600",
    icon: <Users size={28} />,
    content: "Human resource management integrated with your operations stack.",
    features: ["Employee lifecycle", "Payroll synchronization", "Attendance integration"],
    stats: { metric: "5K+", metricLabel: "Employees", growth: "+11%" },
  },
  {
    id: 12,
    title: "LMS",
    shortLabel: "LMS",
    subtitle: "Learning",
    color: "from-indigo-500 to-indigo-600",
    icon: <GraduationCap size={28} />,
    content: "Learning management for training, compliance, and certifications.",
    features: ["Training modules", "Certification tracking", "Compliance courses"],
    stats: { metric: "200+", metricLabel: "Courses", growth: "+19%" },
  },
  {
    id: 13,
    title: "IPO Master",
    shortLabel: "IPO",
    subtitle: "Capital Markets",
    color: "from-fuchsia-500 to-pink-600",
    icon: <Rocket size={28} />,
    content: "IPO application management from bidding to allotment.",
    features: ["Bidding workflows", "Allotment tracking", "Exchange integration"],
    stats: { metric: "150+", metricLabel: "IPOs Handled", growth: "+30%" },
  },
  {
    id: 14,
    title: "CMS",
    shortLabel: "CMS",
    subtitle: "Content",
    color: "from-sky-500 to-cyan-600",
    icon: <Layout size={28} />,
    content: "Content management for campaigns, pages, and multi-channel publishing.",
    features: ["Dynamic page builder", "Campaign management", "Multi-channel publish"],
    stats: { metric: "500+", metricLabel: "Pages", growth: "+16%" },
  },
  {
    id: 15,
    title: "Mutual Fund",
    shortLabel: "MF",
    subtitle: "Investments",
    color: "from-green-500 to-emerald-600",
    icon: <PieChart size={28} />,
    content: "Mutual fund platform with SIP, portfolio, and NAV management.",
    features: ["SIP/STP automation", "Live NAV updates", "Portfolio analytics"],
    stats: { metric: "₹2.1B", metricLabel: "Assets Managed", growth: "+21%" },
  },
  {
    id: 16,
    title: "Geo Spatial Solutions",
    shortLabel: "Geo",
    subtitle: "Location Intel",
    color: "from-lime-500 to-green-600",
    icon: <MapPin size={28} />,
    content: "Location intelligence for branches, mapping, and address validation.",
    features: ["Branch mapping", "Geo-fencing alerts", "Address geocoding"],
    stats: { metric: "10K+", metricLabel: "Locations", growth: "+13%" },
  },
  {
    id: 17,
    title: "E-Sign",
    shortLabel: "E-Sign",
    subtitle: "Digital Sign",
    color: "from-teal-500 to-cyan-600",
    icon: <PenLine size={28} />,
    content: "Digital signature integration with full audit trail and compliance.",
    features: ["Aadhaar eSign support", "Document stamping", "Complete audit trail"],
    stats: { metric: "800K+", metricLabel: "Signatures", growth: "+27%" },
  },
  {
    id: 18,
    title: "Bank Verification",
    shortLabel: "Bank",
    subtitle: "Verification",
    color: "from-blue-600 to-indigo-700",
    icon: <Landmark size={28} />,
    content: "Bank account validation with penny drop and name matching.",
    features: ["Penny drop verification", "IFSC validation", "Name matching engine"],
    stats: { metric: "99.5%", metricLabel: "Match Rate", growth: "+10%" },
  },
  {
    id: 19,
    title: "Matching Solutions",
    shortLabel: "Matching",
    subtitle: "Intelligence",
    color: "from-purple-500 to-violet-600",
    icon: <GitMerge size={28} />,
    content: "Intelligent data matching for deduplication and AML screening.",
    features: ["Fuzzy name matching", "Duplicate detection", "AML screening"],
    stats: { metric: "95%", metricLabel: "Accuracy", growth: "+17%" },
  },
  {
    id: 20,
    title: "Support Ticket",
    shortLabel: "Support",
    subtitle: "Help Desk",
    color: "from-rose-500 to-pink-600",
    icon: <LifeBuoy size={28} />,
    content: "Centralized support ticket system for tracking, resolving, and escalating client issues.",
    features: ["Ticket tracking & SLA", "Priority escalation", "Multi-channel support"],
    stats: { metric: "<2hr", metricLabel: "Avg. Response", growth: "+20%" },
  },
];

const SLIDE_COUNT = ECOSYSTEM_SLIDES.length;

const WebAppCarousel = () => {
  const [slides, setSlides] = useState([...ECOSYSTEM_SLIDES, ...ECOSYSTEM_SLIDES, ...ECOSYSTEM_SLIDES]);
  const [currentIndex, setCurrentIndex] = useState(SLIDE_COUNT);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200); // Default width
  const autoScrollRef = useRef(null);

  // Handle infinite scrolling
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIndex = prev + 1;
      
      // If we're near the end of the duplicated array, reset to middle without animation
      if (nextIndex >= slides.length - SLIDE_COUNT) {
        setTimeout(() => {
          setCurrentIndex(SLIDE_COUNT);
        }, 50);
        return nextIndex;
      }
      
      return nextIndex;
    });
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const prevIndex = prev - 1;
      
      if (prevIndex <= SLIDE_COUNT) {
        setTimeout(() => {
          setCurrentIndex(slides.length - SLIDE_COUNT * 2);
        }, 50);
        return prevIndex;
      }
      
      return prevIndex;
    });
  }, [slides.length]);

  // Touch swipe handling
  useEffect(() => {
    if (autoScroll) {
      autoScrollRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    } else {
      clearInterval(autoScrollRef.current);
    }
    
    return () => clearInterval(autoScrollRef.current);
  }, [autoScroll, nextSlide]);

  // Touch swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Calculate which slides to display
  const getVisibleSlides = () => {
    const visibleSlides = [];
    const totalVisible = 5; // Show 5 slides at once
    
    for (let i = -2; i <= 2; i++) {
      const slideIndex = (currentIndex + i + slides.length) % slides.length;
      visibleSlides.push({
        ...slides[slideIndex],
        offset: i,
        absOffset: Math.abs(i),
        isVisible: true
      });
    }
    
    return visibleSlides;
  };

  return (
    <section className="relative z-0 isolate overflow-hidden bg-white/35 py-16 md:py-20 backdrop-blur-[1px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Our <span className="section-heading-accent">Entire Ecosystem</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
            Integrated solutions across India&apos;s financial infrastructure — from KYC, depository, and exchanges to HRMS, mutual funds, and beyond.
          </p>
        </div>

        <div className="relative w-full flex items-center justify-center h-[500px] md:h-[550px]">
         
          <button 
            onClick={prevSlide}
            className="brand-cta-outline absolute left-0 md:left-4 z-10 bg-white p-4 rounded-full transition-all shadow-lg hover:shadow-xl border"
            aria-label="Previous module"
          >
            <ChevronLeft size={28} />
          </button>

          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {getVisibleSlides().map((slide) => {
              const { offset, absOffset } = slide;
              const isCenter = offset === 0;
              
              return (
                <div
                  key={`${slide.id}-${currentIndex + offset}`}
                  className="absolute transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    transform: `
                      translateX(${offset * (windowWidth < 640 ? 80 : 180)}px)
                      scale(${1 - absOffset * 0.2})
                      rotateY(${offset * -15}deg)
                      translateZ(${-absOffset * 150}px)
                    `,
                    zIndex: isCenter ? 30 : 20 - absOffset,
                    opacity: 1 - absOffset * 0.4,
                    perspective: '1000px',
                    filter: isCenter ? 'none' : `brightness(${1 - absOffset * 0.25}) blur(${absOffset * 0.5}px)`
                  }}
                  onClick={() => {
                    if (offset < 0) prevSlide();
                    if (offset > 0) nextSlide();
                    if (offset === 0) {
                      // Center slide clicked - you could add special behavior here
                    }
                  }}
                >
                  {/* Web App Card */}
                  <div className={`w-[300px] h-[420px] md:w-[360px] md:h-[480px] rounded-2xl shadow-2xl overflow-hidden relative bg-white border border-gray-200`}>
                    {/* Card Header with Gradient */}
                    <div className={`h-32 bg-gradient-to-r ${slide.color} relative overflow-hidden`}>
                      <div className="absolute top-4 left-4 text-white">
                        {slide.isMain ? <Globe2 size={28} /> : slide.icon}
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{slide.title}</h3>
                        <p className="text-sm opacity-90">{slide.subtitle || "Ecosystem Module"}</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-white text-sm font-medium">Live</span>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    {slide.isMain ? (
                      <EcosystemOverview />
                    ) : (
                      <div className="flex flex-col h-full p-6">
                        <div className="flex-1">
                          <p className="text-gray-600 mb-6">{slide.content}</p>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">Key Features</h4>
                            <ul className="space-y-2">
                              {slide.features?.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                                  <span className="text-gray-700">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-teal-50 rounded-lg p-3 ring-1 ring-teal-100">
                              <div className="text-2xl font-bold text-slate-800">{slide.stats?.metric}</div>
                              <div className="text-xs text-slate-500">{slide.stats?.metricLabel}</div>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-3 ring-1 ring-emerald-100">
                              <div className="text-2xl font-bold text-emerald-600">{slide.stats?.growth}</div>
                              <div className="text-xs text-slate-500">Growth Rate</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">#{slide.id} of {SLIDE_COUNT}</span>
                            <button className="brand-cta-gradient px-4 py-2 text-sm rounded-lg">
                              Explore
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Navigation Button */}
          <button 
            onClick={nextSlide}
            className="brand-cta-outline absolute right-0 md:right-4 z-10 bg-white p-4 rounded-full transition-all shadow-lg hover:shadow-xl border "
            aria-label="Next module"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Module Indicators - only show base slides */}
        <div className="flex justify-center mt-8 gap-1 sm:gap-2 overflow-x-auto max-w-full px-4 pb-2 scrollbar-hide">
          {ECOSYSTEM_SLIDES.map((slide, index) => {
            const currentBaseIndex = (currentIndex - SLIDE_COUNT) % SLIDE_COUNT;
            const adjustedIndex = currentBaseIndex < 0 ? currentBaseIndex + SLIDE_COUNT : currentBaseIndex;
            
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index + SLIDE_COUNT)}
                className={`mt-2 flex flex-col items-center transition-all duration-300 min-w-[52px] shrink-0 ${
                  index === adjustedIndex ? 'opacity-100' : 'opacity-45 hover:opacity-70'
                }`}
                aria-label={`Go to ${slide.title}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full mb-1.5 ${index === adjustedIndex ? 'bg-[#FE602F] scale-125' : 'bg-gray-300'}`}></div>
                <span className={`text-[10px] sm:text-xs font-medium truncate max-w-[56px] ${index === adjustedIndex ? 'text-orange-600' : 'text-gray-500'}`}>
                  {slide.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        
      </div>
    </section>
  );
};

const EcosystemOverview = () => (
  <div className="h-full flex flex-col p-6 bg-white">
    <div className="mb-5">
      <h3 className="text-xl font-bold text-slate-900">Connected Infrastructure</h3>
      <p className="text-slate-500 text-sm">20 integrations powering your financial platform</p>
    </div>
    
    <div className="grid grid-cols-2 gap-3 mb-5">
      <div className="bg-teal-50 rounded-xl p-3 ring-1 ring-teal-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-teal-800">Integrations</span>
          <Network size={14} className="text-teal-600" />
        </div>
        <div className="text-2xl font-bold text-teal-900">20+</div>
        <div className="text-xs text-emerald-600">↑ All live</div>
      </div>
      
      <div className="bg-emerald-50 rounded-xl p-3 ring-1 ring-emerald-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-emerald-800">API Calls</span>
          <BarChart size={14} className="text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-emerald-900">12.4M</div>
        <div className="text-xs text-emerald-600">↑ 24% monthly</div>
      </div>
    </div>
    
    <div className="flex-1 mb-4">
      <div className="h-28 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3 ring-1 ring-teal-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Ecosystem Coverage</span>
          <Globe2 size={14} className="text-teal-600" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["KYC", "Trading", "Depository", "MF", "IPO", "HRMS", "E-Sign", "Bank"].map((tag) => (
            <span key={tag} className="text-[10px] font-medium bg-white text-teal-700 px-2 py-0.5 rounded-full ring-1 ring-teal-100">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
    
    <div className="space-y-2.5">
      {[
        { label: "DigiLocker & Aadhaar", color: "bg-teal-500" },
        { label: "CDSL, NSE, MCA APIs", color: "bg-emerald-500" },
        { label: "ReKYC, MF, IPO Master", color: "bg-cyan-500" },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2.5 h-2.5 ${item.color} rounded-full mr-2.5`}></div>
            <span className="text-sm text-slate-600">{item.label}</span>
          </div>
          <span className="text-xs font-medium text-emerald-600">Active</span>
        </div>
      ))}
    </div>
    
    <div className="mt-5 pt-4 border-t border-gray-100">
      <button className="brand-cta-gradient w-full py-3 rounded-xl font-medium">
        View Full Ecosystem
      </button>
    </div>
  </div>
);

export default WebAppCarousel;