import { Receipt } from "lucide-react";
import SettingSection from "./SettingSection";
import SaveButton from "./SaveButton";

export default function ReceiptSettings({ data, setData }) {
  const update = (field, value) => {
    setData((prev) => ({
      ...prev,
      receipt: {
        ...prev.receipt,
        [field]: value,
      },
    }));
  };

  return (
    <SettingSection
      title="STRUK"
      icon={<Receipt size={14} className="text-white" />}
      iconClass="bg-[#252423]"
      headerRight={
        <span className="hidden sm:block text-[9px] text-[#aaa59d]">
          Klik teks untuk edit langsung
        </span>
      }
    >
      <div>
        {/* Preview area */}
        <div className="min-h-[380px] rounded-[11px] bg-[#f5f2eb] flex items-center justify-center p-5 overflow-hidden">

          {/* Receipt */}
          <div className="w-[208px] bg-[#fffdf7] px-4 py-5 shadow-[0_5px_20px_rgba(0,0,0,0.12)] text-[#2d2b28] font-mono text-[8px] leading-[1.45]">

            {/* Greeting */}
            <input
              value={data.receipt.greeting}
              onChange={(e) =>
                update("greeting", e.target.value)
              }
              className="w-full text-center bg-transparent outline-none italic mb-2"
            />

            <div className="border-b border-dashed border-[#bdb8ae] pb-2 text-center">
              <input
                value={data.receipt.cafeName}
                onChange={(e) =>
                  update("cafeName", e.target.value)
                }
                className="w-full text-center bg-transparent outline-none font-bold text-[10px]"
              />

              <input
                value={data.receipt.address}
                onChange={(e) =>
                  update("address", e.target.value)
                }
                className="w-full text-center bg-transparent outline-none mt-1"
              />

              <input
                value={`WA: ${data.receipt.whatsapp}`}
                onChange={(e) =>
                  update(
                    "whatsapp",
                    e.target.value.replace("WA: ", "")
                  )
                }
                className="w-full text-center bg-transparent outline-none"
              />
            </div>

            {/* Order info */}
            <div className="py-2 border-b border-dashed border-[#bdb8ae] space-y-0.5">
              <div className="flex justify-between">
                <span>No. Order</span>
                <b>NTR-1025</b>
              </div>

              <div className="flex justify-between">
                <span>Nama</span>
                <b>Chinta</b>
              </div>

              <div className="flex justify-between">
                <span>Tipe</span>
                <b>Dine-in</b>
              </div>

              <div className="flex justify-between">
                <span>Waktu</span>
                <b>14:32</b>
              </div>

              <div className="flex justify-between">
                <span>Bayar</span>
                <b>Cash</b>
              </div>
            </div>

            {/* Items */}
            <div className="py-2 border-b border-dashed border-[#bdb8ae] space-y-1">
              <div className="flex justify-between gap-2">
                <span>Nasi Goreng Montera x2</span>
                <b>56.000</b>
              </div>

              <div className="flex justify-between gap-2">
                <span>Kopi Susu Montera</span>
                <b>22.000</b>
              </div>

              <div className="flex justify-between gap-2">
                <span>+ Extra Shot Espresso</span>
                <b>7.000</b>
              </div>
            </div>

            {/* Total */}
            <div className="py-2 border-b border-[#4d4a45] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>85.000</span>
              </div>

              <div className="flex justify-between font-bold text-[10px]">
                <span>TOTAL</span>
                <span>Rp 85.000</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 text-center">
              <p className="mb-2">
                18 Agustus 2026 · 15:36
              </p>

              <input
                value={data.receipt.footer}
                onChange={(e) =>
                  update("footer", e.target.value)
                }
                className="w-full text-center bg-transparent outline-none italic"
              />
            </div>
          </div>
        </div>

        <p className="text-center text-[9px] text-[#b5b0a8] mt-3">
          Klik pada teks header atau footer di struk untuk mengeditnya langsung
        </p>

        <SaveButton />
      </div>
    </SettingSection>
  );
}