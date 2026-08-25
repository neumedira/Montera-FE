import { memo, useState } from "react";
import {
  Check,
  X,
  QrCode,
} from "lucide-react";

/* =========================================================
   PAYMENT TYPES
========================================================= */

const PAYMENT_TYPES = [
  {
    value: "tunai",
    label: "Tunai",
  },
  {
    value: "qris",
    label: "QRIS",
  },
  {
    value: "tf_bank",
    label: "TF Bank",
  },
  {
    value: "ewallet",
    label: "E-Wallet",
  },
  {
    value: "kartu",
    label: "Kartu",
  },
];

/* =========================================================
   E-WALLET TYPES
========================================================= */

const EWALLET_TYPES = [
  "GoPay",
  "OVO",
  "DANA",
  "ShopeePay",
  "LinkAja",
];

/* =========================================================
   CARD TYPES
========================================================= */

const CARD_TYPES = [
  "Debit",
  "Kredit",
];

/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM = {
  name: "",
  type: "",
  enabled: true,

  // QRIS
  provider: "",
  merchantId: "",
  qrImage: "",

  // TRANSFER BANK
  bankName: "",
  accountName: "",
  accountNumber: "",

  // E-WALLET
  ewalletType: "",
  ewalletAccountName: "",
  ewalletNumber: "",

  // KARTU
  cardType: "",
  cardProvider: "",
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PaymentMethodModal({
  editingId,
  initialData,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => {
    if (!initialData) {
      return {
        ...EMPTY_FORM,
      };
    }

    return {
      ...EMPTY_FORM,

      name: initialData.name || "",
      type: initialData.type || "tunai",
      enabled: initialData.enabled ?? true,

      provider: initialData.provider || "",
      merchantId: initialData.merchantId || "",
      qrImage: initialData.qrImage || "",

      bankName: initialData.bankName || "",
      accountName: initialData.accountName || "",
      accountNumber: initialData.accountNumber || "",

      ewalletType:
        initialData.ewalletType || "",
      ewalletAccountName:
        initialData.ewalletAccountName || "",
      ewalletNumber:
        initialData.ewalletNumber || "",

      cardType: initialData.cardType || "",
      cardProvider:
        initialData.cardProvider || "",
    };
  });

  /* =======================================================
     HANDLE CHANGE
  ======================================================= */

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =======================================================
     CHANGE PAYMENT TYPE
  ======================================================= */

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,

      type,

      provider: "",
      merchantId: "",
      qrImage: "",

      bankName: "",
      accountName: "",
      accountNumber: "",

      ewalletType: "",
      ewalletAccountName: "",
      ewalletNumber: "",

      cardType: "",
      cardProvider: "",
    }));
  };

  /* =======================================================
     UPLOAD QR CODE
  ======================================================= */

  const handleQrUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      qrImage: imageUrl,
    }));
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    if (!form.name.trim()) {
      alert(
        "Nama metode pembayaran wajib diisi."
      );
      return false;
    }

    if (!form.type) {
      alert(
        "Jenis pembayaran wajib dipilih."
      );
      return false;
    }

    /* QRIS */

    if (form.type === "qris") {
      if (!form.provider.trim()) {
        alert(
          "Provider QRIS wajib diisi."
        );
        return false;
      }

      if (!form.merchantId.trim()) {
        alert(
          "Merchant ID wajib diisi."
        );
        return false;
      }
    }

    /* TRANSFER BANK */

    if (form.type === "tf_bank") {
      if (!form.bankName.trim()) {
        alert(
          "Nama bank wajib diisi."
        );
        return false;
      }

      if (!form.accountName.trim()) {
        alert(
          "Nama pemilik rekening wajib diisi."
        );
        return false;
      }

      if (!form.accountNumber.trim()) {
        alert(
          "Nomor rekening wajib diisi."
        );
        return false;
      }
    }

    /* E-WALLET */

    if (form.type === "ewallet") {
      if (!form.ewalletType) {
        alert(
          "Jenis E-Wallet wajib dipilih."
        );
        return false;
      }

      if (!form.ewalletAccountName.trim()) {
        alert(
          "Nama pemilik akun wajib diisi."
        );
        return false;
      }

      if (!form.ewalletNumber.trim()) {
        alert(
          "Nomor HP / ID akun wajib diisi."
        );
        return false;
      }
    }

    /* KARTU */

    if (form.type === "kartu") {
      if (!form.cardType) {
        alert(
          "Jenis kartu wajib dipilih."
        );
        return false;
      }

      if (!form.cardProvider.trim()) {
        alert(
          "Provider / Bank wajib diisi."
        );
        return false;
      }
    }

    return true;
  };

  /* =======================================================
     DESCRIPTION
  ======================================================= */

  const generateDescription = () => {
    switch (form.type) {
      case "tunai":
        return "Pembayaran tunai";

      case "qris":
        return form.provider
          ? `QRIS • ${form.provider}`
          : "Pembayaran QRIS";

      case "tf_bank":
        return form.bankName
          ? `Transfer Bank • ${form.bankName}`
          : "Transfer Bank";

      case "ewallet":
        return form.ewalletType
          ? `E-Wallet • ${form.ewalletType}`
          : "Pembayaran E-Wallet";

      case "kartu":
        return form.cardProvider
          ? `${form.cardType || "Kartu"} • ${form.cardProvider}`
          : "Pembayaran kartu";

      default:
        return "";
    }
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const paymentData = {
      name: form.name.trim(),
      type: form.type,
      enabled: form.enabled,

      // QRIS
      provider: form.provider,
      merchantId: form.merchantId,
      qrImage: form.qrImage,

      // TRANSFER BANK
      bankName: form.bankName,
      accountName: form.accountName,
      accountNumber: form.accountNumber,

      // E-WALLET
      ewalletType: form.ewalletType,
      ewalletAccountName:
        form.ewalletAccountName,
      ewalletNumber: form.ewalletNumber,

      // KARTU
      cardType: form.cardType,
      cardProvider: form.cardProvider,

      description: generateDescription(),
    };

    onSave(paymentData);
  };

  /* =======================================================
     DYNAMIC FIELDS
  ======================================================= */

  const renderDynamicFields = () => {
    switch (form.type) {
      /* =====================================================
         TUNAI
      ===================================================== */

      case "tunai":
        return null;

      /* =====================================================
         QRIS
      ===================================================== */

      case "qris":
        return (
          <div className="space-y-3.5">
            <InputField
              label="PROVIDER"
              value={form.provider}
              onChange={(value) =>
                handleChange(
                  "provider",
                  value
                )
              }
              placeholder="Contoh: BCA, BNI, GoPay"
            />

            <InputField
              label="MERCHANT ID"
              value={form.merchantId}
              onChange={(value) =>
                handleChange(
                  "merchantId",
                  value
                )
              }
              placeholder="Masukkan merchant ID"
            />

            {/* UPLOAD QR */}

            <div>
              <label className="mb-1.5 block text-[8px] font-extrabold tracking-[1px] text-[#858078]">
                FOTO QR CODE
              </label>

              <label className="relative flex min-h-[95px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-[#d5d0c6] bg-[#faf8f1] transition hover:border-[#aaa39a]">
                {form.qrImage ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <img
                      src={form.qrImage}
                      alt="QR Code"
                      className="h-[64px] w-[64px] rounded-lg object-contain"
                    />

                    <span className="text-[9px] font-bold text-[#292725]">
                      Klik untuk mengganti
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#e9e6de]">
                      <QrCode
                        size={16}
                        className="text-[#77736b]"
                      />
                    </div>

                    <span className="text-[10px] font-bold text-[#292725]">
                      Upload Foto QR Code
                    </span>

                    <span className="mt-0.5 text-[8px] text-[#aaa59d]">
                      PNG, JPG atau JPEG
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleQrUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        );

      /* =====================================================
         TRANSFER BANK
      ===================================================== */

      case "tf_bank":
        return (
          <div className="space-y-3.5">
            <InputField
              label="NAMA BANK"
              value={form.bankName}
              onChange={(value) =>
                handleChange(
                  "bankName",
                  value
                )
              }
              placeholder="Contoh: BCA"
            />

            <InputField
              label="NAMA PEMILIK REKENING"
              value={form.accountName}
              onChange={(value) =>
                handleChange(
                  "accountName",
                  value
                )
              }
              placeholder="Masukkan nama pemilik rekening"
            />

            <InputField
              label="NOMOR REKENING"
              value={form.accountNumber}
              onChange={(value) =>
                handleChange(
                  "accountNumber",
                  value
                )
              }
              placeholder="Masukkan nomor rekening"
            />
          </div>
        );

      /* =====================================================
         E-WALLET
      ===================================================== */

      case "ewallet":
        return (
          <div className="space-y-3.5">
            <CustomSelect
              label="JENIS E-WALLET"
              value={form.ewalletType}
              onChange={(value) =>
                handleChange(
                  "ewalletType",
                  value
                )
              }
              placeholder="Pilih jenis E-Wallet"
              options={EWALLET_TYPES}
            />

            <InputField
              label="NAMA PEMILIK AKUN"
              value={
                form.ewalletAccountName
              }
              onChange={(value) =>
                handleChange(
                  "ewalletAccountName",
                  value
                )
              }
              placeholder="Masukkan nama pemilik akun"
            />

            <InputField
              label="NOMOR HP / ID AKUN"
              value={form.ewalletNumber}
              onChange={(value) =>
                handleChange(
                  "ewalletNumber",
                  value
                )
              }
              placeholder="Masukkan nomor HP / ID akun"
            />
          </div>
        );

      /* =====================================================
         KARTU
      ===================================================== */

      case "kartu":
        return (
          <div className="space-y-3.5">
            <CustomSelect
              label="JENIS KARTU"
              value={form.cardType}
              onChange={(value) =>
                handleChange(
                  "cardType",
                  value
                )
              }
              placeholder="Pilih jenis kartu"
              options={CARD_TYPES}
            />

            <InputField
              label="PROVIDER / BANK"
              value={form.cardProvider}
              onChange={(value) =>
                handleChange(
                  "cardProvider",
                  value
                )
              }
              placeholder="Contoh: BCA, BNI, Mandiri"
            />
          </div>
        );

      default:
        return null;
    }
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-4">
      {/* OVERLAY */}

      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* MODAL */}

      <div className="relative flex max-h-[84vh] w-full max-w-[430px] flex-col overflow-hidden rounded-[18px] bg-[#fffdf7] shadow-2xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4.5">
          <div>
            <h2 className="text-[16px] font-extrabold tracking-[-0.3px] text-[#292725]">
              {editingId
                ? "Edit Metode Pembayaran"
                : "Tambah Metode Pembayaran"}
            </h2>

            <p className="mt-0.5 text-[9px] text-[#aaa59d]">
              Atur metode pembayaran usaha kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-[28px] w-[28px] items-center justify-center rounded-full text-[#96918a] transition hover:bg-[#efede6] hover:text-[#292725]"
          >
            <X size={18} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* SCROLL CONTENT */}

          <div className="overflow-y-auto px-5 pb-3">
            <div className="space-y-3">
              {/* NAMA METODE */}

              <InputField
                label="NAMA METODE"
                value={form.name}
                onChange={(value) =>
                  handleChange(
                    "name",
                    value
                  )
                }
                placeholder="Contoh: QRIS BNI"
                autoFocus
              />

              {/* JENIS PEMBAYARAN */}

              <CustomSelect
                label="JENIS PEMBAYARAN"
                value={form.type}
                onChange={
                  handleTypeChange
                }
                placeholder="Pilih jenis pembayaran"
                options={PAYMENT_TYPES}
                objectOptions
              />

              {/* DYNAMIC FIELDS */}

              {form.type && (
                <div className="pt-0.5">
                  {renderDynamicFields()}
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="shrink-0 px-5 pb-4 pt-2">
            {/* AVAILABLE */}

            <div className="mb-2.5 flex items-center justify-between rounded-[10px] bg-[#f3f1e9] px-3.5 py-2.5">
              <div>
                <span className="text-[11px] font-bold text-[#292725]">
                  Tersedia
                </span>
              </div>

              {/* TOGGLE */}

              <button
                type="button"
                aria-label="Ubah ketersediaan metode pembayaran"
                onClick={() =>
                  handleChange(
                    "enabled",
                    !form.enabled
                  )
                }
                className={`relative flex h-[24px] w-[42px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200 ${
                  form.enabled
                    ? "bg-[#292725]"
                    : "bg-[#c9c5bc]"
                }`}
              >
                <span
                  className={`block h-[18px] w-[18px] shrink-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${
                    form.enabled
                      ? "translate-x-[18px]"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="flex h-[43px] w-full items-center justify-center rounded-[10px] bg-[#292725] text-[12px] font-extrabold text-white transition hover:bg-[#1f1e1c] active:scale-[0.99]"
            >
              {editingId
                ? "Simpan Perubahan"
                : "Simpan Metode"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = memo(function InputField({
  label,
  value,
  onChange,
  placeholder,
  autoFocus = false,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[8px] font-extrabold tracking-[1px] text-[#858078]">
        {label}
      </label>

      <input
        type="text"
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-[40px] w-full rounded-[9px] border border-[#d8d3c9] bg-[#fffdf7] px-3 text-[11px] font-medium text-[#302e2b] outline-none transition placeholder:text-[#aaa59d] focus:border-[#aaa39a]"
      />
    </div>
  );
});

/* =========================================================
   CUSTOM SELECT
========================================================= */

const CustomSelect = memo(function CustomSelect({
  label,
  value,
  onChange,
  placeholder,
  options = [],
  objectOptions = false,
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  const selectedOption = objectOptions
    ? options.find(
        (option) =>
          option.value === value
      )
    : null;

  const displayValue = objectOptions
    ? selectedOption?.label
    : value;

  const handleSelect = (option) => {
    const selectedValue = objectOptions
      ? option.value
      : option;

    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="mb-1.5 block text-[8px] font-extrabold tracking-[1px] text-[#858078]">
        {label}
      </label>

      <button
        type="button"
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        className={`flex h-[40px] w-full items-center justify-between rounded-[9px] border bg-[#fffdf7] px-3 text-left text-[11px] font-medium outline-none transition ${
          isOpen
            ? "border-[#aaa39a]"
            : "border-[#d8d3c9]"
        }`}
      >
        <span
          className={
            displayValue
              ? "text-[#302e2b]"
              : "text-[#aaa59d]"
          }
        >
          {displayValue ||
            placeholder}
        </span>

        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-[#96918a] ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[63px] z-[120] overflow-hidden rounded-[9px] border border-[#d8d3c9] bg-[#fffdf7] shadow-lg">
          <div className="max-h-[180px] overflow-y-auto p-1">
            {options.map((option) => {
              const optionValue =
                objectOptions
                  ? option.value
                  : option;

              const optionLabel =
                objectOptions
                  ? option.label
                  : option;

              const selected =
                value === optionValue;

              return (
                <button
                  key={optionValue}
                  type="button"
                  onClick={() =>
                    handleSelect(
                      option
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-[7px] px-2.5 py-2 text-left text-[10.5px] ${
                    selected
                      ? "bg-[#f0ede5] font-bold text-[#292725]"
                      : "text-[#55514b] hover:bg-[#f5f2eb]"
                  }`}
                >
                  <span>
                    {optionLabel}
                  </span>

                  {selected && (
                    <Check
                      size={12}
                      strokeWidth={2.5}
                      className="text-[#292725]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});