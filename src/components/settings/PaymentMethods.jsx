import { CreditCard } from "lucide-react";
import SettingSection from "./SettingSection";
import SaveButton from "./SaveButton";

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-[38px] h-[21px] rounded-full transition-colors ${
        enabled ? "bg-[#292826]" : "bg-[#c9c4bb]"
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[15px] h-[15px] rounded-full bg-white transition-transform duration-200 ${
          enabled ? "translate-x-[17px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function PaymentMethods({ data, setData }) {
  const toggle = (field) => {
    setData((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [field]: !prev.paymentMethods[field],
      },
    }));
  };

  return (
    <SettingSection
      title="METODE PEMBAYARAN"
      icon={<CreditCard size={14} className="text-white" />}
      iconClass="bg-[#ed3044]"
    >
      <div className="space-y-2.5">

        {/* QRIS */}
        <div className="h-[57px] px-3.5 rounded-[11px] bg-[#f7f4ec] flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-[#292725]">
              QRIS BNI
            </p>

            <p className="text-[9px] text-[#aaa59d] mt-0.5">
              Pembayaran cashless via scan QR
            </p>
          </div>

          <Toggle
            enabled={data.paymentMethods.qrisBni}
            onChange={() => toggle("qrisBni")}
          />
        </div>

        {/* Cash */}
        <div className="h-[57px] px-3.5 rounded-[11px] bg-[#f7f4ec] flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-[#292725]">
              Tunai (Cash)
            </p>

            <p className="text-[9px] text-[#aaa59d] mt-0.5">
              Pembayaran tunai di kasir
            </p>
          </div>

          <Toggle
            enabled={data.paymentMethods.cash}
            onChange={() => toggle("cash")}
          />
        </div>

        <SaveButton />
      </div>
    </SettingSection>
  );
}