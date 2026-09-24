"use client";
import axios from "axios";
import { createContext, useContext,  useState } from "react";
import { preconnect } from "react-dom";

// 1. Create Context
const SiteContext = createContext();

// 2. Context Provider Component
export const SiteProvider = ({ children }) => {
  const [settingsData, setSettingsData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [testimonialData, setTestimonialData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [careerData, setCareerData] = useState(null);
  const [technologyData, setTechnologyData] = useState(null);

  return (
    <SiteContext.Provider
      value={{
        settingsData,
        setSettingsData,
        projectData,
        setProjectData,
        categoryData,
        setCategoryData,
        serviceData,
        setServiceData,
        testimonialData,
        setTestimonialData,
        teamData,
        setTeamData,
        imageData,
        setImageData,
        videoData,
        setVideoData,
        careerData,
        setCareerData,
        technologyData,
        setTechnologyData,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

// 3. Custom Hook for easy access
export const useSite = () => useContext(SiteContext);
