
import { ImagePlus, X } from "lucide-react";

import SettingSection from "./SettingSection";

import SaveButton from "./SaveButton";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CustomerBanner({
  data,
  setData,
  onSave,
}) {
  const rawBannerUrl =
    data?.business?.bannerImageUrl || "";

  const bannerFile =
    data?.business?.bannerImage || null;

  // =========================================================
  // BANNER URL
  // =========================================================

  const getBannerUrl = (url) => {
    if (!url) return "";

    // Preview lokal dari URL.createObjectURL()
    if (
      url.startsWith("blob:") ||
      url.startsWith("data:")
    ) {
      return url;
    }

    // Sudah URL lengkap
    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    // Path dari Laravel storage:
    // /storage/banners/xxx.png
    if (url.startsWith("/storage/")) {
      return `${BACKEND_URL}${url}`;
    }

    // Path:
    // storage/banners/xxx.png
    if (url.startsWith("storage/")) {
      return `${BACKEND_URL}/${url}`;
    }

    // Path database:
    // banners/xxx.png
    return `${BACKEND_URL}/storage/${url.replace(
      /^\/+/,
      ""
    )}`;
  };

  const bannerUrl = getBannerUrl(rawBannerUrl);

  // =========================================================
  // UPDATE BANNER
  // =========================================================

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // =======================================================
    // MAXIMUM SIZE
    // =======================================================

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran banner maksimal 2MB.");
      e.target.value = "";
      return;
    }

    // =======================================================
    // ALLOWED FORMAT
    // =======================================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Format banner harus JPG, JPEG, PNG, atau WEBP."
      );

      e.target.value = "";
      return;
    }

    // =======================================================
    // CREATE PREVIEW
    // =======================================================

    const previewUrl = URL.createObjectURL(file);

    // =======================================================
    // UPDATE STATE
    // =======================================================

    setData((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        bannerImage: file,
        bannerImageUrl: previewUrl,
      },
    }));
  };

  // =========================================================
  // REMOVE BANNER
  // =========================================================

  const handleRemove = () => {
    setData((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        bannerImage: null,
        bannerImageUrl: "",
      },
    }));
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <SettingSection
      title="TAMPILAN CUSTOMER"
      icon={
        <ImagePlus
          size={14}
          className="text-white"
        />
      }
      iconClass="bg-[#252423]"
    >
      <div className="space-y-3">

        {/* ===================================================
            INFO
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            BANNER CUSTOMER
          </label>

          <p className="text-[10px] leading-relaxed text-[#aaa49b]">
            Banner ini akan ditampilkan di bagian
            atas halaman menu customer.
          </p>
        </div>

        {/* ===================================================
            PREVIEW
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            PREVIEW
          </label>

          {bannerUrl ? (
            <div className="relative overflow-hidden rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7]">

              <img
                src={bannerUrl}
                alt="Preview Banner Customer"
                className="block aspect-[16/7] w-full object-cover"
                onError={(e) => {
                  console.error(
                    "Gagal menampilkan banner:",
                    bannerUrl
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />

              {/* REMOVE */}

              <button
                type="button"
                onClick={handleRemove}
                className="
                  absolute
                  right-2
                  top-2
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-[#252423]/80
                  text-white
                  transition
                  hover:bg-[#252423]
                "
                aria-label="Hapus banner"
              >
                <X size={13} />
              </button>

            </div>
          ) : (
            <div
              className="
                flex
                aspect-[16/7]
                w-full
                flex-col
                items-center
                justify-center
                rounded-[11px]
                border
                border-dashed
                border-[#dcd7cd]
                bg-[#fffdf7]
                text-[#aaa49b]
              "
            >
              <ImagePlus
                size={24}
                strokeWidth={1.5}
              />

              <span className="mt-1.5 text-[10px] font-medium">
                Belum ada banner
              </span>
            </div>
          )}
        </div>

        {/* ===================================================
            UPLOAD
        =================================================== */}

        <div>
          <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            UPLOAD BANNER
          </label>

          <label
            className="
              flex
              h-[40px]
              w-full
              cursor-pointer
              items-center
              justify-center
              gap-2
              rounded-[11px]
              border
              border-[#dcd7cd]
              bg-[#fffdf7]
              text-[11px]
              font-bold
              text-[#302e2b]
              transition
              hover:bg-[#f8f5ee]
            "
          >
            <ImagePlus size={15} />

            <span>
              {bannerFile
                ? "Ganti Banner"
                : "Pilih Banner"}
            </span>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleBannerChange}
              className="hidden"
            />
          </label>

          <p className="mt-1.5 text-[9px] text-[#aaa49b]">
            JPG, PNG, WEBP · Maks. 2MB
          </p>
        </div>

        {/* ===================================================
            SAVE
        =================================================== */}

        <SaveButton onClick={onSave} />

      </div>
    </SettingSection>
  );
}

