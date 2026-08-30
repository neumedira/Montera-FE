
import { useEffect, useState } from "react";
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  Building2,
  WalletCards,
  Upload,
  Trash2,
} from "lucide-react";

export default function PaymentMethodModal({
  editingId,
  initialData,
  onClose,
  onSave,
  saving = false,
}) {
  const [form, setForm] = useState({
    method: "tunai",
    is_active: true,
    provider_note: "",
    qr_image: null,
    qr_image_url: null,
  });

  const [preview, setPreview] = useState(null);

  // =========================================================
  // QR IMAGE URL
  // =========================================================

  const getQrImageUrl = (url) => {
    if (!url) return null;

    // Sudah berupa URL lengkap
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("blob:")
    ) {
      return url;
    }

    // Backend menyimpan contoh:
    // qris/abc123.jpg
    //
    // Maka arahkan ke Laravel public storage:
    // http://localhost:8000/storage/qris/abc123.jpg
    return `http://10.174.91.209:8000/storage/${url}`;
  };

  // =========================================================
  // LOAD DATA EDIT
  // =========================================================

  useEffect(() => {
    if (initialData) {
      const method =
        initialData.method ||
        initialData.type ||
        "tunai";

      const qrImageUrl = getQrImageUrl(
        initialData.qr_image_url
      );

      setForm({
        method,

        is_active:
          initialData.is_active ??
          initialData.enabled ??
          true,

        provider_note:
          initialData.provider_note ??
          initialData.provider ??
          "",

        qr_image: null,

        qr_image_url:
          qrImageUrl,
      });

      setPreview(qrImageUrl);
    } else {
      setForm({
        method: "tunai",
        is_active: true,
        provider_note: "",
        qr_image: null,
        qr_image_url: null,
      });

      setPreview(null);
    }
  }, [initialData]);

  // =========================================================
  // UPDATE FORM
  // =========================================================

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // SELECT METHOD
  // HANYA BISA SAAT TAMBAH
  // =========================================================

  const selectMethod = (method) => {
    if (editingId) return;

    setForm((prev) => ({
      ...prev,

      method,

      qr_image:
        method === "qris"
          ? prev.qr_image
          : null,

      qr_image_url:
        method === "qris"
          ? prev.qr_image_url
          : null,
    }));

    if (method !== "qris") {
      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }

      setPreview(null);
    }
  };

  // =========================================================
  // UPLOAD QR
  // =========================================================

  const handleQrUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      event.target.value = "";
      return;
    }

    // Validasi ukuran
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    // Hapus preview blob sebelumnya
    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    // Buat preview lokal
    const objectUrl =
      URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,

      qr_image: file,

      // Karena menggunakan file baru,
      // URL lama tidak digunakan lagi.
      qr_image_url: null,
    }));

    setPreview(objectUrl);

    // Supaya file yang sama bisa dipilih lagi
    event.target.value = "";
  };

  // =========================================================
  // REMOVE QR
  // =========================================================

  const removeQr = () => {
    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    setForm((prev) => ({
      ...prev,

      qr_image: null,
      qr_image_url: null,
    }));

    setPreview(null);
  };

  // =========================================================
  // CLEANUP PREVIEW
  // =========================================================

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // =========================================================
  // CREATE UNIQUE METHOD
  //
  // Contoh:
  //
  // E-Wallet + DANA
  // -> ewallet_dana
  //
  // E-Wallet + GoPay
  // -> ewallet_gopay
  //
  // Transfer Bank + BNI
  // -> tf_bank_bni
  //
  // Transfer Bank + BCA
  // -> tf_bank_bca
  //
  // Kartu + BCA Debit
  // -> kartu_bca_debit
  //
  // Saat EDIT method tidak disentuh.
  // =========================================================

  const createUniqueMethod = (
    baseMethod,
    providerNote
  ) => {
    if (
      baseMethod !== "ewallet" &&
      baseMethod !== "tf_bank" &&
      baseMethod !== "kartu"
    ) {
      return baseMethod;
    }

    if (!providerNote) {
      return baseMethod;
    }

    // Ambil bagian pertama sebelum "•"
    //
    // "DANA • 08123456789"
    // -> "DANA"
    //
    // "BNI • 1234567890 • a.n. Montera"
    // -> "BNI"

    const providerName =
      providerNote
        .split("•")[0]
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    if (!providerName) {
      return baseMethod;
    }

    return `${baseMethod}_${providerName}`;
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    // -------------------------------------------------------
    // VALIDASI METODE
    // -------------------------------------------------------

    if (!form.method) {
      alert(
        "Metode pembayaran wajib dipilih."
      );
      return;
    }

    // -------------------------------------------------------
    // PROVIDER / NOTE
    // -------------------------------------------------------

    const providerNote =
      form.provider_note.trim();

    // -------------------------------------------------------
    // VALIDASI PROVIDER
    //
    // Saat tambah:
    // E-Wallet
    // Transfer Bank
    // Kartu
    //
    // wajib memiliki provider / note.
    // -------------------------------------------------------

    if (
      !editingId &&
      (
        form.method === "ewallet" ||
        form.method === "tf_bank" ||
        form.method === "kartu"
      ) &&
      !providerNote
    ) {
      alert(
        "Provider / Note wajib diisi."
      );
      return;
    }

    // -------------------------------------------------------
    // METHOD FINAL
    //
    // TAMBAH:
    // ewallet + DANA
    // -> ewallet_dana
    //
    // EDIT:
    // method database tetap digunakan.
    // -------------------------------------------------------

    const finalMethod = editingId
      ? form.method
      : createUniqueMethod(
          form.method,
          providerNote
        );

    const paymentData = {
      method: finalMethod,

      is_active:
        form.is_active,

      provider_note:
        providerNote,

      qr_image:
        form.qr_image,

      qr_image_url:
        form.qr_image_url,
    };

    console.log(
      "========================================"
    );

    console.log(
      "PAYMENT DATA:",
      paymentData
    );

    console.log(
      "METHOD ASLI:",
      form.method
    );

    console.log(
      "METHOD FINAL:",
      finalMethod
    );

    console.log(
      "QR IMAGE:",
      form.qr_image
    );

    console.log(
      "QR IMAGE URL:",
      form.qr_image_url
    );

    console.log(
      "========================================"
    );

    try {
      await onSave(paymentData);
    } catch (error) {
      console.error(
        "Gagal menyimpan metode pembayaran:",
        error
      );
    }
  };

  // =========================================================
  // METHODS
  // =========================================================

  const methods = [
    {
      value: "tunai",
      label: "Tunai",
      description:
        "Pembayaran langsung dengan uang tunai",
      icon: Banknote,
    },

    {
      value: "qris",
      label: "QRIS",
      description:
        "Pembayaran menggunakan QRIS",
      icon: QrCode,
    },

    {
      value: "tf_bank",
      label: "Transfer Bank",
      description:
        "Pembayaran melalui transfer bank",
      icon: Building2,
    },

    {
      value: "ewallet",
      label: "E-Wallet",
      description:
        "GoPay, OVO, DANA, ShopeePay, dll",
      icon: WalletCards,
    },

    {
      value: "kartu",
      label: "Kartu",
      description:
        "Pembayaran menggunakan kartu",
      icon: CreditCard,
    },
  ];

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6">

      {/* ===================================================
          MODAL
      =================================================== */}

      <div className="flex max-h-[90vh] w-full max-w-[500px] flex-col overflow-hidden rounded-[18px] bg-[#fffdf7] shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#e5e0d6] px-5 py-4">

          <div>
            <h2 className="text-[15px] font-extrabold text-[#292725]">
              {editingId
                ? "Edit Metode Pembayaran"
                : "Tambah Metode Pembayaran"}
            </h2>

            <p className="mt-0.5 text-[9px] text-[#aaa59d]">
              {editingId
                ? "Ubah informasi metode pembayaran."
                : "Atur metode pembayaran yang tersedia."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#eeeae2] text-[#66625b] transition hover:bg-[#e2ded5] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={15} />
          </button>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto p-5"
        >

          {/* =================================================
              METODE PEMBAYARAN
          ================================================= */}

          <div>

            <label className="mb-2 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
              METODE PEMBAYARAN
            </label>

            <div className="grid grid-cols-2 gap-2">

              {methods.map((item) => {
                const Icon = item.icon;

                // Saat edit:
                // ewallet_dana
                // ewallet_gopay
                // tf_bank_bni
                // tf_bank_bca
                //
                // tetap menampilkan kategori
                // yang sesuai sebagai aktif.

                const active =
                  form.method === item.value ||
                  form.method.startsWith(
                    `${item.value}_`
                  );

                const disabled =
                  !!editingId;

                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      selectMethod(
                        item.value
                      )
                    }
                    className={`flex items-center gap-2.5 rounded-[11px] border p-3 text-left transition ${
                      active
                        ? "border-[#252423] bg-[#252423] text-white"
                        : "border-[#ded9cf] bg-[#fffdf7] text-[#292725]"
                    } ${
                      disabled
                        ? "cursor-not-allowed opacity-65"
                        : "hover:bg-[#f5f1e8]"
                    }`}
                  >

                    <div
                      className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${
                        active
                          ? "bg-white/10"
                          : "bg-[#eeeae2]"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          active
                            ? "text-white"
                            : "text-[#68645d]"
                        }
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10.5px] font-bold">
                        {item.label}
                      </p>

                      <p
                        className={`mt-0.5 text-[8px] leading-3 ${
                          active
                            ? "text-white/60"
                            : "text-[#aaa59d]"
                        }`}
                      >
                        {item.description}
                      </p>

                    </div>

                  </button>
                );
              })}

            </div>

            {/* =================================================
                INFO SAAT EDIT
            ================================================= */}

            {editingId && (
              <div className="mt-2.5 rounded-[9px] bg-[#f3f0e8] px-3 py-2">

                <p className="text-[8px] leading-3 text-[#858078]">
                  Metode pembayaran tidak dapat
                  diganti saat edit. Jika ingin
                  menggunakan metode lain, tambahkan
                  metode pembayaran baru.
                </p>

              </div>
            )}

          </div>

          {/* =================================================
              PROVIDER / NOTE
          ================================================= */}

          <div className="mt-4">

            <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
              PROVIDER / NOTE
            </label>

            <input
              type="text"
              value={
                form.provider_note || ""
              }
              onChange={(event) =>
                updateForm(
                  "provider_note",
                  event.target.value
                )
              }
              placeholder={
                form.method.startsWith(
                  "tf_bank"
                )
                  ? "Contoh: BNI • 1234567890 • a.n. Montera"

                  : form.method.startsWith(
                      "ewallet"
                    )
                  ? "Contoh: DANA • 08123456789"

                  : form.method === "qris"
                  ? "Contoh: BNI"

                  : form.method.startsWith(
                      "kartu"
                    )
                  ? "Contoh: BCA Debit / Visa"

                  : "Contoh: Pembayaran langsung"
              }
              disabled={saving}
              className="h-[40px] w-full rounded-[11px] border border-[#dcd7cd] bg-[#fffdf7] px-3.5 text-[11px] font-medium text-[#292725] outline-none transition placeholder:text-[#b8b3aa] focus:border-[#252423] disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* INFO TRANSFER BANK */}

            {form.method.startsWith(
              "tf_bank"
            ) && (
              <p className="mt-1.5 text-[8px] leading-3 text-[#aaa59d]">
                Bisa diisi nama bank, nomor
                rekening, dan nama pemilik rekening.
              </p>
            )}

            {/* INFO E-WALLET */}

            {form.method.startsWith(
              "ewallet"
            ) && (
              <p className="mt-1.5 text-[8px] leading-3 text-[#aaa59d]">
                Bisa diisi nama E-Wallet dan
                nomor HP / ID akun.
              </p>
            )}

          </div>

          {/* =================================================
              QR IMAGE
          ================================================= */}

          {form.method === "qris" && (
            <div className="mt-4">

              <label className="mb-1.5 block text-[9px] font-extrabold tracking-[1px] text-[#858078]">
                GAMBAR QRIS
              </label>

              {preview ? (
                <div className="relative overflow-hidden rounded-[12px] border border-[#ded9cf] bg-[#f7f4ec] p-3">

                  <div className="flex justify-center">

                    <img
                      src={preview}
                      alt="Preview QRIS"
                      className="h-[190px] w-[190px] rounded-[8px] bg-white object-contain"
                      onError={(event) => {
                        console.error(
                          "Gagal menampilkan gambar QRIS:",
                          preview
                        );

                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                  <button
                    type="button"
                    onClick={removeQr}
                    disabled={saving}
                    className="absolute right-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#f8dfdc] text-[#ed3044] transition hover:bg-[#f3d1ce] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Hapus QR"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>
              ) : (
                <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[#d5d0c6] bg-[#f7f4ec] text-center transition hover:bg-[#f1ede4]">

                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#e8e4db] text-[#77736b]">
                    <Upload size={17} />
                  </div>

                  <p className="text-[10px] font-bold text-[#292725]">
                    Upload gambar QRIS
                  </p>

                  <p className="mt-1 text-[8px] text-[#aaa59d]">
                    PNG, JPG, atau JPEG • Maks. 5 MB
                  </p>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={
                      handleQrUpload
                    }
                    disabled={saving}
                    className="hidden"
                  />

                </label>
              )}

              {/* =================================================
                  GANTI GAMBAR QR
              ================================================= */}

              {preview && (
                <label className="mt-2 flex h-[34px] cursor-pointer items-center justify-center gap-1.5 rounded-[9px] border border-[#dcd7cd] bg-[#fffdf7] text-[9px] font-bold text-[#68645d] transition hover:bg-[#f3f0e8]">

                  <Upload size={13} />

                  Ganti Gambar QR

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={
                      handleQrUpload
                    }
                    disabled={saving}
                    className="hidden"
                  />

                </label>
              )}

            </div>
          )}

          {/* =================================================
              ACTIVE
          ================================================= */}

          <div className="mt-4 flex items-center justify-between rounded-[11px] bg-[#f7f4ec] px-3.5 py-3">

            <div>

              <p className="text-[10.5px] font-bold text-[#292725]">
                Aktifkan metode pembayaran
              </p>

              <p className="mt-0.5 text-[8px] text-[#aaa59d]">
                Metode aktif akan tersedia saat pembayaran.
              </p>

            </div>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateForm(
                  "is_active",
                  !form.is_active
                )
              }
              className={`relative h-[24px] w-[44px] rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                form.is_active
                  ? "bg-[#252423]"
                  : "bg-[#d5d1c8]"
              }`}
            >

              <span
                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition ${
                  form.is_active
                    ? "left-[23px]"
                    : "left-[3px]"
                }`}
              />

            </button>

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-5 flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-[36px] rounded-[10px] border border-[#dcd7cd] bg-[#fffdf7] px-4 text-[10px] font-bold text-[#68645d] transition hover:bg-[#f3f0e8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-[36px] rounded-[10px] bg-[#252423] px-4 text-[10px] font-bold text-white transition hover:bg-[#353331] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Menyimpan..."
                : editingId
                ? "Simpan Perubahan"
                : "Tambah Metode"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
