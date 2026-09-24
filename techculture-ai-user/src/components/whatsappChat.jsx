"use client";

import { ImWhatsapp } from "react-icons/im";

const WHATSAPP_CONTACT = "7428238091";

const WhatsAppChat = () => {
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent("Hii");
    window.open(
      `https://wa.me/${WHATSAPP_CONTACT}?text=${encodedMessage}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      type="button"
      onClick={openWhatsApp}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[1100] hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:bg-[#20bd5a] lg:inline-flex"
    >
      <ImWhatsapp size={28} />
    </button>
  );
};

export default WhatsAppChat;
