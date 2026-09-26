"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { MdOutlineMail, MdOutlinePhone } from "react-icons/md";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { LiaLinkedinIn } from "react-icons/lia";

import { useSite } from "../../context/siteContext";
import {
  navLinks,
  productPages,
} from "../../lib/webdevelopment/catalog";
import { webdevHref } from "../../lib/webdevelopment/paths";
import { COMPANY } from "../../lib/company";
import { LEGAL_FOOTER_LINKS } from "../../lib/legal";

const FOOTER_LOGO = "/tc-app-logo.png";

const Footer = () => {
  const { settingsData, setSettingsData } = useSite();
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    async function fetchSettings() {
      if (!settingsData) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/site-settings`
          );
          if (res.status === 200) {
            setSettingsData(res.data.data);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }

    fetchSettings();
  }, [settingsData, setSettingsData]);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const currentYear = new Date().getFullYear();
  const footerProducts = productPages.slice(0, 6);

  const aboutFooterLinks = [
    { name: "About Us", href: webdevHref("/about") },
    { name: "Our Team", href: webdevHref("/team") },
    { name: "Careers", href: webdevHref("/careers") },
    { name: "Contact Us", href: webdevHref("/contact") },
  ];

  const legalFooterLinks = LEGAL_FOOTER_LINKS.map((item) => ({
    name: item.name,
    href: webdevHref(item.href),
  }));

  const socials = [
    {
      href: "https://www.facebook.com/people/Tech-Culture/61581408442619/",
      icon: FaFacebookF,
      label: "Facebook",
    },
    {
      href: "https://www.instagram.com/techculture_technologies",
      icon: FaInstagram,
      label: "Instagram",
    },
    {
      href: "https://www.linkedin.com/company/techculture-technologies-private-limited/",
      icon: LiaLinkedinIn,
      label: "LinkedIn",
    },
  ];

  return (
    <footer
      ref={footerRef}
      className={`site-footer theme-site-footer text-white ${
        visible ? "site-footer--visible" : ""
      }`}
    >
      <div className="site-footer__glow" aria-hidden />
      <div className="site-footer__glow site-footer__glow--secondary" aria-hidden />
      <div className="site-footer__shimmer" aria-hidden />

      <div className="site-footer__inner container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:gap-16">
          {/* Brand */}
          <div
            className="site-footer__col flex w-full flex-col items-center sm:items-start lg:max-w-[399px] lg:shrink-0 xl:max-w-[652px]"
            style={{ "--i": 0 }}
          >
            <Link
              href={webdevHref("/")}
              className="site-footer__logo inline-flex items-center transition hover:opacity-90"
            >
              <Image
                src={FOOTER_LOGO}
                alt="Tech Culture AI"
                width={220}
                height={72}
                className="h-12 w-auto object-contain sm:h-14"
                priority={false}
              />
            </Link>
            <p className="site-footer__tagline mx-auto mt-4 max-w-full text-sm leading-relaxed text-white/70 sm:mx-0">
              We build intelligent, scalable digital products using modern
              technologies to drive sustainable growth.
            </p>
            <div className="mt-5 space-y-3 text-xs leading-relaxed text-white/55">
              <p>
                <span className="font-semibold text-white/75">Corporate:</span>{" "}
                {COMPANY.corporateAddress.singleLine}
              </p>
              <p>
                <span className="font-semibold text-white/75">Registered:</span>{" "}
                {COMPANY.registeredAddress.singleLine}
              </p>
              <p>
                <span className="font-semibold text-white/75">CIN:</span>{" "}
                {COMPANY.cin}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:justify-start">
              <a
                href={`mailto:${settingsData?.email || COMPANY.email}`}
                className="site-footer__contact group inline-flex items-center gap-2 text-sm text-white/75"
                style={{ "--j": 0 }}
              >
                <span className="site-footer__icon-wrap">
                  <MdOutlineMail size={16} />
                </span>
                <span className="transition-colors group-hover:text-white">
                  {settingsData?.email || COMPANY.email}
                </span>
              </a>

              <a
                href={`tel:${settingsData?.contactNo || COMPANY.phoneTel}`}
                className="site-footer__contact group inline-flex items-center gap-2 text-sm text-white/75"
                style={{ "--j": 1 }}
              >
                <span className="site-footer__icon-wrap">
                  <MdOutlinePhone size={16} />
                </span>
                <span className="transition-colors group-hover:text-white">
                  {settingsData?.contactNo || COMPANY.phone}
                </span>
              </a>

              {socials.length > 0 && (
                <div className="flex items-center justify-center gap-2.5 sm:ml-1 sm:justify-start">
                  {socials.map(({ href, icon: Icon, label }, idx) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="site-footer__social"
                      style={{ "--j": idx + 2 }}
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Link columns — equal width, fill remaining space */}
          <div className="grid w-full flex-1 grid-cols-2 gap-x-6 gap-y-10 text-center sm:grid-cols-4 sm:gap-x-8 sm:text-left lg:gap-x-10">
            {/* Navigation */}
            <div
              className="site-footer__col flex flex-col items-center sm:items-start"
              style={{ "--i": 1 }}
            >
              <h4 className="site-footer__heading">Navigation</h4>
              <ul className="mt-5 flex flex-col items-center space-y-2.5 sm:items-start">
                {navLinks.map((l, idx) => (
                  <li key={l.name} style={{ "--j": idx }}>
                    <Link href={l.href} className="site-footer__link">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div
              className="site-footer__col flex flex-col items-center sm:items-start"
              style={{ "--i": 2 }}
            >
              <h4 className="site-footer__heading">Products</h4>
              <ul className="mt-5 flex flex-col items-center space-y-2.5 sm:items-start">
                <li style={{ "--j": 0 }}>
                  <Link
                    href={webdevHref("/products")}
                    className="site-footer__link site-footer__link--accent"
                  >
                    All Products
                  </Link>
                </li>
                {footerProducts.map((p, idx) => (
                  <li key={p.slug} style={{ "--j": idx + 1 }}>
                    <Link href={p.href} className="site-footer__link">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Us */}
            <div
              className="site-footer__col flex flex-col items-center sm:items-start"
              style={{ "--i": 3 }}
            >
              <h4 className="site-footer__heading">About Us</h4>
              <ul className="mt-5 flex flex-col items-center space-y-2.5 sm:items-start">
                {aboutFooterLinks.map((item, idx) => (
                  <li key={item.name} style={{ "--j": idx }}>
                    <Link href={item.href} className="site-footer__link">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div
              className="site-footer__col flex flex-col items-center sm:items-start"
              style={{ "--i": 4 }}
            >
              <h4 className="site-footer__heading">Legal</h4>
              <ul className="mt-5 flex flex-col items-center space-y-2.5 sm:items-start">
                {legalFooterLinks.map((item, idx) => (
                  <li key={item.name} style={{ "--j": idx }}>
                    <Link href={item.href} className="site-footer__link">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="site-footer__bottom border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-5 py-6 text-center sm:flex-row sm:px-6 sm:py-7 sm:text-left lg:px-8">
          <p className="site-footer__copy text-sm text-white/50">
            © {currentYear} {COMPANY.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
