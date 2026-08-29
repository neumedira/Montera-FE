
import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function Footer() {
  const [settings, setSettings] = useState(() => {
    try {
      const cached =
        sessionStorage.getItem(
          "customer_settings"
        );

      if (!cached) {
        return null;
      }

      return JSON.parse(cached);
    } catch (error) {
      console.error(
        "Gagal membaca cache settings:",
        error
      );

      return null;
    }
  });

  // =========================================================
  // FORMAT SOCIAL URL
  // =========================================================

  const formatInstagramUrl = (value) => {
    if (!value) {
      return "";
    }

    const trimmedValue =
      String(value).trim();

    if (!trimmedValue) {
      return "";
    }

    // Kalau sudah URL lengkap
    if (
      trimmedValue.startsWith("http://") ||
      trimmedValue.startsWith("https://")
    ) {
      return trimmedValue;
    }

    // Hapus @ kalau ada
    const username =
      trimmedValue.replace(/^@/, "");

    return `https://instagram.com/${username}`;
  };

  const formatTikTokUrl = (value) => {
    if (!value) {
      return "";
    }

    const trimmedValue =
      String(value).trim();

    if (!trimmedValue) {
      return "";
    }

    // Kalau sudah URL lengkap
    if (
      trimmedValue.startsWith("http://") ||
      trimmedValue.startsWith("https://")
    ) {
      return trimmedValue;
    }

    // Hapus @ kalau ada
    const username =
      trimmedValue.replace(/^@/, "");

    return `https://tiktok.com/@${username}`;
  };

  // =========================================================
  // GET SETTINGS
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const response =
          await api.get(
            "/admin/settings"
          );

        console.log(
          "FOOTER SETTINGS API:",
          response
        );

        const data =
          response?.data?.data ??
          response?.data ??
          {};

        if (!isMounted) {
          return;
        }

        setSettings(data);

        // Simpan ke cache
        sessionStorage.setItem(
          "customer_settings",
          JSON.stringify(data)
        );
      } catch (error) {
        console.error(
          "Gagal mengambil data pengaturan footer:",
          error
        );
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // BUSINESS DATA
  // =========================================================

  const business =
    settings?.business ||
    settings?.business_profile ||
    settings?.profile ||
    settings ||
    {};

  // =========================================================
  // ADDRESS
  // =========================================================

  const address =
    business?.address ||
    business?.business_address ||
    "";

  // =========================================================
  // SOCIAL MEDIA
  // =========================================================

  const instagramValue =
    business?.instagram ||
    business?.instagram_url ||
    "";

  const tiktokValue =
    business?.tiktok ||
    business?.tiktok_url ||
    "";

  const instagramUrl =
    formatInstagramUrl(
      instagramValue
    );

  const tiktokUrl =
    formatTikTokUrl(
      tiktokValue
    );

  const hasSocial =
    instagramUrl ||
    tiktokUrl;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <footer
      className="
        mt-[50px]
        bg-[#242321]
        px-[30px]
        pb-[110px]
        pt-[42px]
        text-white
      "
    >
      <div className="mx-auto max-w-[680px]">

        {/* ===================================================
            SOCIAL MEDIA
        =================================================== */}

        {hasSocial && (
          <div
            className="
              flex
              items-center
              gap-[18px]
            "
          >

            {/* =================================================
                INSTAGRAM
            ================================================= */}

            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  transition-opacity
                  duration-200
                  hover:opacity-70
                "
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}

            {/* =================================================
                TIKTOK
            ================================================= */}

            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="
                  transition-opacity
                  duration-200
                  hover:opacity-70
                "
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-3.77V2h-3.45v13.67a2.9 2.9 0 1 1-2.9-2.9c.3 0 .59.05.86.13V9.38a6.4 6.4 0 1 0 5.49 6.29V8.26a8.27 8.27 0 0 0 4.84 1.56V6.38c-.36.19-.72.31-1.07.31Z"
                  />
                </svg>
              </a>
            )}

          </div>
        )}

        {/* ===================================================
            GARIS
        =================================================== */}

        <div
          className="
            mt-[22px]
            h-px
            w-full
            bg-white/90
          "
        />

        {/* ===================================================
            ALAMAT
        =================================================== */}

        {address && (
          <p
            className="
              mt-[22px]
              max-w-[620px]
              whitespace-pre-line
              text-[14px]
              font-semibold
              leading-[1.5]
              tracking-[0.25px]
            "
          >
            {address}
          </p>
        )}

      </div>
    </footer>
  );
}
