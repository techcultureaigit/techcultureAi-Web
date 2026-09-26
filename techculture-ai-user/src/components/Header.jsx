"use client"
import { useSite } from '../context/siteContext';
import { useBookDemo } from '../context/BookDemoContext';
import Button from '@mui/material/Button'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { IoClose, IoChevronDown } from 'react-icons/io5';
import {
  FiHome,
  FiUsers,
  FiInfo,
  FiBox,
  FiServer,
  FiBriefcase,
  FiEdit3,
} from "react-icons/fi";
import HeaderGooeyBubbles from "./HeaderGooeyBubbles";
import FontSwitcher from "./FontSwitcher";
import { webdevHref } from "../lib/webdevelopment/paths";

const WEBDEV_LOGO = "/techculturelive.gif";
import {
  ProductsMegaPanel,
  ProductsMobileMenu,
  AboutMegaPanel,
  AboutMobileMenu,
  aboutItems,
} from "./HeaderMegaMenus";

const mobileNavIconClass =
  "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff0eb] text-[#FE602F] ring-1 ring-[#FE602F]/15";

const Header = () => {
    const pathname = usePathname();
    const isLightHeader = true;
    const menuVariant = isLightHeader ? "webdevelopment" : "default";
    const dropdownActiveClass =
        isLightHeader
            ? "text-[#FE602F] opacity-100 font-semibold"
            : "text-primary opacity-100 font-semibold";
    const router = useRouter();
    const { settingsData, setSettingsData } = useSite();
    const headerLogoSrc = isLightHeader ? WEBDEV_LOGO : settingsData?.logo || WEBDEV_LOGO;
    const isGifLogo = /\.gif($|\?)/i.test(headerLogoSrc || "");
    const homeHref = isLightHeader ? webdevHref("/") : "/";
    const navPaths = {
      automation: isLightHeader ? webdevHref("/products") : "/automation",
      products: isLightHeader ? webdevHref("/products") : "/products",
      careers: webdevHref("/careers"),
      blog: webdevHref("/blog"),
      team: webdevHref("/team"),
      about: isLightHeader ? webdevHref("/about") : "/about",
      middleware: webdevHref("/middleware"),
    };
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const { openBookDemo } = useBookDemo();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpenNav, setIsOpenNav] = useState(false);
    const [headerServices, setHeaderServices] = useState([]);
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    const [isMobileAboutSubmenuOpen, setIsMobileAboutSubmenuOpen] = useState(false);
    const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
    const [navigationSource, setNavigationSource] = useState('direct');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // cleanup
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Track navigation source from sessionStorage
    useEffect(() => {
        const storedSource = sessionStorage.getItem('navigationSource');
        if (storedSource) {
            setNavigationSource(storedSource);
        }
    }, [pathname]);

    // Close dropdown when clicking outside (desktop only)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth > 1024) {
                if (isServicesDropdownOpen && !event.target.closest('.services-dropdown')) {
                    setIsServicesDropdownOpen(false);
                }
                if (isAboutDropdownOpen && !event.target.closest('.about-dropdown')) {
                    setIsAboutDropdownOpen(false);
                }
                if (isProductsDropdownOpen && !event.target.closest('.products-dropdown')) {
                    setIsProductsDropdownOpen(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isServicesDropdownOpen, isAboutDropdownOpen, isProductsDropdownOpen]);

    // Reset mobile submenu when closing mobile nav
    useEffect(() => {
        if (!isOpenNav) {
            setIsMobileSubmenuOpen(false);
            setIsMobileAboutSubmenuOpen(false);
            setIsMobileProductsOpen(false);
        }
    }, [isOpenNav]);

    // Fetch header services
    useEffect(() => {
        const fetchHeaderServices = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/services?showOnHeader=true`);
                if (response.status === 200) {
                    setHeaderServices(response.data.services || []);
                }
            } catch (error) {
                console.error("Error fetching header services:", error);
            }
        };
        
        fetchHeaderServices();
    }, [apiBaseUrl]);

    useEffect(() => {
      async function fetchData() {
        if (!settingsData) {
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/site-settings`
            );
            if (res.status === 200) {
              setSettingsData(res.data.data);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      fetchData();
    }, [settingsData, setSettingsData]);

    // Helper function to check if current service is in AI-Automation dropdown
    const isAiAutomationService = () => {
        if (!pathname.startsWith('/services/')) return false;
        
        const currentSlug = pathname.replace('/services/', '');
        return headerServices.some(service => service.slug === currentSlug);
    };

    const isAboutSectionActive = () => {
        if (isLightHeader) {
            return (
              pathname === navPaths.about ||
              pathname.startsWith(`${navPaths.about}/`) ||
              pathname === webdevHref("/contact")
            );
        }
        return aboutItems.some((link) => {
            if (link.href === '/services') {
                return pathname === '/services' || (pathname.startsWith('/services/') && navigationSource === 'services');
            }
            return pathname === link.href || pathname.startsWith(`${link.href}/`);
        });
    };
    
    // Function to check if current path matches the nav link
    const isActiveLink = (path) => {
        if (path === '/' && pathname === '/') return true;
        if (isLightHeader && path === homeHref && pathname === homeHref) return true;

        if (isLightHeader) {
            if (path === navPaths.automation) {
                return pathname === navPaths.automation || pathname.startsWith(`${navPaths.automation}/`);
            }
            if (path === navPaths.products) {
                return pathname === navPaths.products || pathname.startsWith(`${navPaths.products}/`);
            }
            if (path === navPaths.about) {
                return isAboutSectionActive();
            }
            if (path !== '/' && path !== homeHref && pathname.startsWith(path)) return true;
            return pathname === path;
        }
        
        // Special handling for services
        if (path === '/services') {
            // Active for main services page OR if navigated from services page to an individual service
            return pathname === '/services' || (pathname.startsWith('/services/') && navigationSource === 'services');
        }
        
        // Special handling for AI-Automation
        if (path === '/automation') {
            // Active only if it's an AI service AND user came from automation dropdown
            return isAiAutomationService() && navigationSource === 'automation';
        }

        // Special handling for About Us dropdown
        if (path === '/about') {
            return isAboutSectionActive();
        }
        
        // Default behavior for other paths
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    // Function to get active link classes
    const getLinkClasses = (path) => {
        const baseClasses = "text-[17px] transition-all duration-300 relative";
        const activeClasses = isLightHeader
            ? "text-[#FE602F] opacity-100 font-semibold"
            : "text-primary opacity-100 font-semibold";
        const inactiveClasses = isLightHeader
            ? "text-slate-800 opacity-90 hover:opacity-100 hover:text-[#FE602F]"
            : "text-white opacity-90 hover:opacity-100 hover:text-primary";
        
        return `${baseClasses} ${isActiveLink(path) ? activeClasses : inactiveClasses}`;
    };

    const scheduleDemoBtnBase = isLightHeader
        ? "brand-cta-gradient !text-white !rounded-full"
        : "brand-cta-gradient !text-white !rounded-md";

    // Handle services dropdown toggle for desktop
    const closeDesktopDropdowns = () => {
        setIsServicesDropdownOpen(false);
        setIsAboutDropdownOpen(false);
        setIsProductsDropdownOpen(false);
    };

    const handleServicesClick = (e) => {
        e.preventDefault();
        if (window.innerWidth > 1024) {
            const next = !isServicesDropdownOpen;
            closeDesktopDropdowns();
            setIsServicesDropdownOpen(next);
        } else {
            setIsMobileSubmenuOpen(!isMobileSubmenuOpen);
        }
    };

    const handleAboutClick = (e) => {
        e.preventDefault();
        if (window.innerWidth > 1024) {
            const next = !isAboutDropdownOpen;
            closeDesktopDropdowns();
            setIsAboutDropdownOpen(next);
        } else {
            setIsMobileAboutSubmenuOpen(!isMobileAboutSubmenuOpen);
        }
    };

    const handleProductsClick = (e) => {
        e.preventDefault();
        if (window.innerWidth > 1024) {
            const next = !isProductsDropdownOpen;
            closeDesktopDropdowns();
            setIsProductsDropdownOpen(next);
        } else {
            setIsMobileProductsOpen(!isMobileProductsOpen);
        }
    };

    // Handle mouse events for desktop hover
    const handleMouseEnter = () => {
        if (window.innerWidth > 1024) {
            closeDesktopDropdowns();
            setIsServicesDropdownOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth > 1024) {
            setIsServicesDropdownOpen(false);
        }
    };

    const handleAboutMouseEnter = () => {
        if (window.innerWidth > 1024) {
            closeDesktopDropdowns();
            setIsAboutDropdownOpen(true);
        }
    };

    const handleAboutMouseLeave = () => {
        if (window.innerWidth > 1024) {
            setIsAboutDropdownOpen(false);
        }
    };

    const handleProductsMouseEnter = () => {
        if (window.innerWidth > 1024) {
            closeDesktopDropdowns();
            setIsProductsDropdownOpen(true);
        }
    };

    const handleProductsMouseLeave = () => {
        if (window.innerWidth > 1024) {
            setIsProductsDropdownOpen(false);
        }
    };

    // Handle navigation with source tracking
    const handleNavigation = (href, source) => {
        sessionStorage.setItem('navigationSource', source);
        setNavigationSource(source);
        router.push(href);
        setIsOpenNav(false);
        closeDesktopDropdowns();
        setIsMobileSubmenuOpen(false);
        setIsMobileAboutSubmenuOpen(false);
        setIsMobileProductsOpen(false);
    };

    return (
 
      
       
      <>
        <header
          className={`theme-site-header site-header w-full h-20 flex items-center justify-center fixed top-0 left-0 z-[100] bg-white ${
            !isLightHeader && isScrolled === true ? "scroll" : ""
          }`}
        >
          <div className="container flex items-center justify-between">
            <Link
              href={homeHref}
              className="logo flex items-center shrink-0"
              onClick={() => {
                sessionStorage.removeItem("navigationSource");
                setNavigationSource("direct");
              }}
            >
              <div
                className={`relative overflow-visible ${
                  isLightHeader
                    ? "h-14 w-[118px] sm:h-[72px] sm:w-[140px] lg:h-[80px] lg:w-[150px]"
                    : "h-12 w-[120px] sm:h-14 sm:w-[150px]"
                }`}
              >
                <Image
                  src={headerLogoSrc}
                  alt="logo"
                  fill
                  unoptimized={isGifLogo}
                  className={
                    isLightHeader
                      ? `object-contain ${
                          isGifLogo
                            ? "mix-blend-multiply brightness-[1.18] contrast-[1.05]"
                            : ""
                        }`
                      : "object-contain object-left"
                  }
                  priority
                />
              </div>
            </Link>

            <HeaderGooeyBubbles className="relative max-lg:contents lg:flex lg:items-center">
            <nav
              className={`mobile-nav-drawer flex items-center gap-5 xl:gap-7 fixed top-[5%] right-0 lg:static lg:top-auto flex-col lg:flex-row h-auto max-h-[min(80dvh,640px)] lg:max-h-none lg:h-auto z-[101] pt-0 lg:pt-0 px-0 lg:px-0 w-[min(20.5rem,90vw)] lg:w-auto overflow-y-auto lg:overflow-visible rounded-l-3xl lg:rounded-none ${
                isLightHeader
                  ? "bg-[#fdfcfb] lg:bg-transparent shadow-[-12px_0_40px_rgba(46,53,69,0.18)] lg:shadow-none"
                  : "bg-[#040416] lg:bg-transparent"
              } ${isOpenNav ? "is-open" : ""}`}
            >
              {/* Mobile drawer atmosphere */}
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-l-3xl lg:hidden"
                aria-hidden
              >
                <Image
                  src="/hero-office-bg.jpg"
                  alt=""
                  fill
                  unoptimized
                  className="object-cover object-center opacity-[0.22]"
                  sizes="90vw"
                />
                <div className="absolute inset-0 bg-linear-to-b from-white/92 via-[#fff8f5]/88 to-[#fff1eb]/94" />
                <div className="absolute -right-16 top-24 h-44 w-44 rounded-full bg-[#FE602F]/18 blur-3xl" />
                <div className="absolute -left-10 bottom-10 h-28 w-28 rounded-full bg-[#2E3545]/10 blur-3xl" />
              </div>

              <div className="relative z-10 flex w-full flex-col gap-0.5 px-4 pb-4 pt-3 lg:contents lg:px-0 lg:pb-0 lg:pt-0">
                <div className="mobile-nav-item mb-2 flex items-center justify-between border-b border-orange-100/80 pb-2.5 lg:hidden" style={{ "--i": 0 }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FE602F]">
                      Menu
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[#2E3545]">
                      TechCulture AI
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="grid h-9 w-9 place-items-center rounded-full border border-orange-100 bg-white/80 text-slate-800 shadow-sm backdrop-blur-sm transition hover:bg-[#FE602F] hover:text-white"
                    onClick={() => setIsOpenNav(false)}
                  >
                    <IoClose size={18} />
                  </button>
                </div>

              {/* Home */}
              <Link
                href={homeHref}
                className={`${getLinkClasses(homeHref)} hidden lg:block`}
                onClick={() => handleNavigation(homeHref, "direct")}
              >
                Home
              </Link>

              <Link
                href={homeHref}
                className={`${getLinkClasses(homeHref)} mobile-nav-item flex w-full items-center gap-3 rounded-xl border-b-0 px-2.5 py-2.5 transition hover:bg-white/70 lg:hidden`}
                style={{ "--i": 1 }}
                onClick={() => handleNavigation(homeHref, "direct")}
              >
                <span className={mobileNavIconClass}>
                  <FiHome size={16} />
                </span>
                Home
              </Link>

              {/* Our Team */}
              <Link
                href={navPaths.team}
                className={`${getLinkClasses(navPaths.team)} hidden lg:block`}
                onClick={() => handleNavigation(navPaths.team, "team")}
              >
                Our Team
              </Link>

              <Link
                href={navPaths.team}
                className={`${getLinkClasses(navPaths.team)} mobile-nav-item flex w-full items-center gap-3 rounded-xl border-b-0 px-2.5 py-2.5 transition hover:bg-white/70 lg:hidden`}
                style={{ "--i": 2 }}
                onClick={() => handleNavigation(navPaths.team, "team")}
              >
                <span className={mobileNavIconClass}>
                  <FiUsers size={16} />
                </span>
                Our Team
              </Link>

              {/* About Us Mega Menu - Desktop */}
              <div
                className="about-dropdown relative group hidden lg:block"
                onMouseEnter={isLightHeader ? undefined : handleAboutMouseEnter}
                onMouseLeave={isLightHeader ? undefined : handleAboutMouseLeave}
              >
                <div
                  className={`${getLinkClasses(
                    navPaths.about
                  )} flex items-center gap-1 cursor-pointer ${
                    isAboutDropdownOpen && !isLightHeader ? dropdownActiveClass : ""
                  }`}
                  onClick={(e) => {
                    if (isLightHeader) {
                      e.preventDefault();
                      handleNavigation(navPaths.about, "about");
                      return;
                    }
                    handleAboutClick(e);
                  }}
                >
                  About Us
                  {!isLightHeader && (
                  <IoChevronDown
                    className={`text-sm transition-transform duration-300 ${
                      isAboutDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  )}
                </div>

                {!isLightHeader && (
                <div
                  className={`absolute top-full right-0 pt-3 z-[120] transition-all duration-300 ${
                    isAboutDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="w-[min(820px,90vw)]">
                    <AboutMegaPanel
                      onNavigate={handleNavigation}
                      variant={menuVariant}
                    />
                  </div>
                </div>
                )}
              </div>

              {/* Mobile About Us Menu */}
              <div className="mobile-nav-item w-full lg:hidden" style={{ "--i": 3 }}>
                {isLightHeader ? (
                  <Link
                    href={navPaths.about}
                    className={`${getLinkClasses(
                      navPaths.about
                    )} flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-white/70`}
                    onClick={() => handleNavigation(navPaths.about, "about")}
                  >
                    <span className={mobileNavIconClass}>
                      <FiInfo size={16} />
                    </span>
                    About Us
                  </Link>
                ) : (
                  <>
                <div
                  className={`${getLinkClasses(
                    "/about"
                  )} flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2.5`}
                  onClick={handleAboutClick}
                >
                  <span className="flex items-center gap-3">
                    <span className={mobileNavIconClass}>
                      <FiInfo size={16} />
                    </span>
                    About Us
                  </span>
                  <IoChevronDown
                    className={`text-sm transition-transform duration-300 ${
                      isMobileAboutSubmenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isMobileAboutSubmenuOpen && (
                  <AboutMobileMenu
                    onNavigate={handleNavigation}
                    variant={menuVariant}
                  />
                )}
                  </>
                )}
              </div>

              {/* Product Mega Menu - Desktop */}
              <div
                className="products-dropdown relative group hidden lg:block"
                onMouseEnter={handleProductsMouseEnter}
                onMouseLeave={handleProductsMouseLeave}
              >
                <div
                  className={`${getLinkClasses(
                    navPaths.products
                  )} flex items-center gap-1 cursor-pointer ${
                    isProductsDropdownOpen ? dropdownActiveClass : ""
                  }`}
                  onClick={(e) => {
                    handleProductsClick(e);
                  }}
                >
                  Product
                  <IoChevronDown
                    className={`text-sm transition-transform duration-300 ${
                      isProductsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <div
                  className={`absolute top-full left-1/2 z-[120] -translate-x-1/2 pt-3 transition-all duration-300 xl:-translate-x-[42%] ${
                    isProductsDropdownOpen
                      ? "visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible translate-y-2 opacity-0"
                  }`}
                >
                  <div className="max-h-[min(78vh,560px)] w-[min(860px,94vw)] overflow-y-auto overscroll-contain xl:max-h-[min(82vh,620px)] xl:w-[min(1080px,94vw)] 2xl:max-h-none 2xl:w-[min(1180px,92vw)] 2xl:overflow-visible">
                    <ProductsMegaPanel
                      onNavigate={handleNavigation}
                      variant={menuVariant}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Product Menu */}
              <div className="mobile-nav-item w-full lg:hidden" style={{ "--i": 4 }}>
                <div
                  className={`${getLinkClasses(
                    navPaths.products
                  )} flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2.5 transition hover:bg-white/70`}
                  onClick={handleProductsClick}
                >
                  <span className="flex items-center gap-3">
                    <span className={mobileNavIconClass}>
                      <FiBox size={16} />
                    </span>
                    Product
                  </span>
                  <IoChevronDown
                    className={`text-sm transition-transform duration-300 ${
                      isMobileProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isMobileProductsOpen && (
                  <ProductsMobileMenu
                    onNavigate={handleNavigation}
                    variant={menuVariant}
                  />
                )}
              </div>

              {isLightHeader && (
                <Link
                  href={navPaths.middleware}
                  className={`${getLinkClasses(
                    navPaths.middleware
                  )} mobile-nav-item flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-white/70 lg:inline lg:w-auto lg:gap-0 lg:rounded-none lg:px-0 lg:py-0 lg:text-center lg:hover:bg-transparent`}
                  style={{ "--i": 5 }}
                  onClick={() => handleNavigation(navPaths.middleware, "direct")}
                >
                  <span className={`${mobileNavIconClass} lg:hidden`}>
                    <FiServer size={16} />
                  </span>
                  Middleware
                </Link>
              )}

              <Link
                href={navPaths.careers}
                className={`${getLinkClasses(
                  navPaths.careers
                )} mobile-nav-item flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-white/70 lg:inline lg:w-auto lg:gap-0 lg:rounded-none lg:px-0 lg:py-0 lg:text-center lg:hover:bg-transparent`}
                style={{ "--i": 6 }}
                onClick={() => handleNavigation(navPaths.careers, "direct")}
              >
                <span className={`${mobileNavIconClass} lg:hidden`}>
                  <FiBriefcase size={16} />
                </span>
                Careers
              </Link>

              <Link
                href={navPaths.blog}
                className={`${getLinkClasses(
                  navPaths.blog
                )} mobile-nav-item flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-white/70 lg:inline lg:w-auto lg:gap-0 lg:rounded-none lg:px-0 lg:py-0 lg:text-center lg:hover:bg-transparent`}
                style={{ "--i": 7 }}
                onClick={() => handleNavigation(navPaths.blog, "direct")}
              >
                <span className={`${mobileNavIconClass} lg:hidden`}>
                  <FiEdit3 size={16} />
                </span>
                Blog
              </Link>

              <div className="mobile-nav-item mt-2 border-t border-orange-100/80 pt-3 lg:hidden" style={{ "--i": 8 }}>
                <Button
                  className={`${scheduleDemoBtnBase} !w-full !px-5 !py-2 !capitalize !font-bold !text-sm`}
                  size="medium"
                  onClick={() => {
                    setIsOpenNav(false);
                    openBookDemo();
                  }}
                >
                  Schedule Demo
                </Button>
              </div>
              </div>
            </nav>
            </HeaderGooeyBubbles>

            <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
              {/* <div className="hidden min-[400px]:block">
                <FontSwitcher compact />
              </div> */}
              <Button
                className={`${scheduleDemoBtnBase} !px-3 !py-1.5 !capitalize !font-bold !text-xs sm:!px-4 sm:!py-2 sm:!text-sm`}
                size="small"
                onClick={openBookDemo}
              >
                Book a Demo
              </Button>
              <AiOutlineMenu
                size={26}
                className={`shrink-0 cursor-pointer ${isLightHeader ? "text-slate-800" : "text-white"}`}
                onClick={() => setIsOpenNav(true)}
              />
            </div>

            <div
              className={`mobile-nav-overlay fixed inset-0 z-[100] bg-black/55 lg:hidden ${
                isOpenNav ? "is-open" : ""
              }`}
              onClick={() => setIsOpenNav(false)}
              aria-hidden={!isOpenNav}
            />

            <div className="items-center gap-3 hidden lg:flex xl:gap-4">
              {/* <FontSwitcher /> */}
              <Button
                className={`${scheduleDemoBtnBase} !px-6 !py-2 !capitalize !font-bold !hidden lg:!flex`}
                size="large"
                onClick={openBookDemo}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </header>
      </>
      
     
    );
}

export default Header