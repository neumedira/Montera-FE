
import { Store } from "lucide-react";
import SettingSection from "./SettingSection";
import SaveButton from "./SaveButton";

export default function BusinessProfile({
  data,
  setData,
  onSave,
}) {
  const update = (field, value) => {
    setData((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value,
      },
    }));
  };

  return (
    <SettingSection
      title="PROFIL USAHA"
      icon={
        <Store
          size={14}
          className="text-white"
        />
      }
      iconClass="bg-[#252423]"
    >
      <div className="space-y-3">

        {/* NAMA */}

        <div>
          <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            NAMA CAFÉ
          </label>

          <input
            value={
              data?.business?.cafeName || ""
            }
            onChange={(e) =>
              update(
                "cafeName",
                e.target.value
              )
            }
            className="h-[40px] w-full rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] px-3.5 text-[12px] font-medium text-[#302e2b] outline-none focus:border-[#aaa39a]"
          />
        </div>

        {/* ALAMAT */}

        <div>
          <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            ALAMAT
          </label>

          <input
            value={
              data?.business?.address || ""
            }
            onChange={(e) =>
              update(
                "address",
                e.target.value
              )
            }
            placeholder="Jl. Contoh No. 1, Kota Anda"
            className="h-[57px] w-full rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] px-3.5 text-[12px] font-medium text-[#302e2b] outline-none placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
          />
        </div>

        {/* WHATSAPP */}

        <div>
          <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            NOMOR WHATSAPP
          </label>

          <input
            value={
              data?.business?.whatsapp || ""
            }
            onChange={(e) =>
              update(
                "whatsapp",
                e.target.value
              )
            }
            placeholder="08xxxxxxxxxx"
            className="h-[40px] w-full rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] px-3.5 text-[12px] font-medium text-[#302e2b] outline-none placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
          />
        </div>

        {/* INSTAGRAM */}

        <div>
          <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            INSTAGRAM
          </label>

          <input
            value={
              data?.business?.instagram || ""
            }
            onChange={(e) =>
              update(
                "instagram",
                e.target.value
              )
            }
            placeholder="@username"
            className="h-[40px] w-full rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] px-3.5 text-[12px] font-medium text-[#302e2b] outline-none placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
          />
        </div>

        {/* TIKTOK */}

        <div>
          <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            TIKTOK
          </label>

          <input
            value={
              data?.business?.tiktok || ""
            }
            onChange={(e) =>
              update(
                "tiktok",
                e.target.value
              )
            }
            placeholder="@username"
            className="h-[40px] w-full rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] px-3.5 text-[12px] font-medium text-[#302e2b] outline-none placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
          />
        </div>

        <SaveButton
          onClick={onSave}
        />

      </div>
    </SettingSection>
  );
}

