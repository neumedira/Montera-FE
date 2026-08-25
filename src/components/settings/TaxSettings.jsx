import { Percent } from "lucide-react";
import SettingSection from "./SettingSection";
import SaveButton from "./SaveButton";

export default function TaxSettings({ data, setData }) {
  const update = (field, value) => {
    setData((prev) => ({
      ...prev,
      tax: {
        ...(prev.tax || {}),
        [field]: value,
      },
    }));
  };

  return (
    <SettingSection
      title="PAJAK & SERVICE CHARGE"
      icon={<Percent size={14} className="text-[#252423]" />}
      iconClass="bg-[#f4a261]"
    >
      <div className="space-y-3">
        {/* Pajak */}
        <div>
          <label className="block mb-1.5 text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            PAJAK DAERAH (%)
          </label>

          <div className="relative">
            <input
              type="number"
              value={data?.tax?.regionalTax ?? ""}
              onChange={(e) =>
                update("regionalTax", e.target.value)
              }
              className="w-full h-[40px] pl-3.5 pr-10 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#aaa59d] font-bold">
              %
            </span>
          </div>

          <p className="mt-1.5 text-[9px] text-[#b5b0a8]">
            Ditambahkan ke subtotal pesanan. 0% = tidak ada pajak.
          </p>
        </div>

        {/* Service Charge */}
        <div>
          <label className="block mb-1.5 text-[9px] font-extrabold tracking-[1px] text-[#858078]">
            SERVICE CHARGE (%)
          </label>

          <div className="relative">
            <input
              type="number"
              value={data?.tax?.serviceCharge ?? ""}
              onChange={(e) =>
                update("serviceCharge", e.target.value)
              }
              className="w-full h-[40px] pl-3.5 pr-10 rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] outline-none text-[12px] font-medium"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#aaa59d] font-bold">
              %
            </span>
          </div>

          <p className="mt-1.5 text-[9px] text-[#b5b0a8]">
            Biaya layanan yang ditambahkan ke subtotal. 0% = tidak ada
            service charge.
          </p>
        </div>

        <SaveButton />
      </div>
    </SettingSection>
  );
}