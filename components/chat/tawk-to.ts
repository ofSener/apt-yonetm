"use client";

import { useEffect } from "react";

export function TawktoChat() {
  useEffect(() => {
    // Tawk.to entegrasyonu
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/YOUR_TAWK_ID/default";
    s1.setAttribute("crossorigin", "*");
    document.head.appendChild(s1);

    return () => {
      // Temizleme
      document.head.removeChild(s1);
    };
  }, []);

  return null; // Görünür bir UI elementi yok
}
