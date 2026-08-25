import { Store } from "lucide-react";
import SettingSection from "./SettingSection";
import SaveButton from "./SaveButton";

export default function BusinessProfile({ data, setData }) {
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
      icon={<Store size={14} className="text-white" />}
      iconClass="bg-[#252423]"
    >
      <div className="space-y-3">

        {/* Nama */}
        <div>
          <label className="block mb-1.5 text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            NAMA CAFÉ
          </label>

          <input
            value={data.business.cafeName}
            onChange={(e) => update("cafeName", e.target.value)}
            className="w-full h-[40px] px-3.5 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium text-[#302e2b] focus:border-[#aaa39a]"
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="block mb-1.5 text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            ALAMAT
          </label>

          <input
            value={data.business.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Jl. Contoh No. 1, Kota Anda"
            className="w-full h-[57px] px-3.5 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium text-[#302e2b] placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block mb-1.5 text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            NOMOR WHATSAPP
          </label>

          <input
            value={data.business.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full h-[40px] px-3.5 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium text-[#302e2b] placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block mb-1.5 text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            INSTAGRAM
          </label>

          <div className="space-y-2">
            <input
              value={data.business.instagramName}
              onChange={(e) => update("instagramName", e.target.value)}
              placeholder="@username"
              className="w-full h-[40px] px-3.5 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium text-[#302e2b] placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
            />

            <input
              value={data.business.instagramUrl}
              onChange={(e) => update("instagramUrl", e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full h-[40px] px-3.5 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium text-[#302e2b] placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
            />
          </div>
        </div>

        {/* TikTok */}
        <div>
          <label className="block mb-1.5 text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            TIKTOK
          </label>

          <div className="space-y-2">
            <input
              value={data.business.tiktokName}
              onChange={(e) => update("tiktokName", e.target.value)}
              placeholder="@username"
              className="w-full h-[40px] px-3.5 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium text-[#302e2b] placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
            />

            <input
              value={data.business.tiktokUrl}
              onChange={(e) => update("tiktokUrl", e.target.value)}
              placeholder="https://tiktok.com/@username"
              className="w-full h-[40px] px-3.5 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium text-[#302e2b] placeholder:text-[#c7c3bb] focus:border-[#aaa39a]"
            />
          </div>
        </div>

        <SaveButton />

      </div>
    </SettingSection>
  );
}