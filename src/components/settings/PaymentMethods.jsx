import { useState } from "react";

import {
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Check,
  QrCode,
  Banknote,
  Building2,
  WalletCards,
} from "lucide-react";

import SettingSection from "./SettingSection";
import PaymentMethodModal from "./modal/PaymentMethodModal";

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PaymentMethods({
  data,
  setData,
  onSavePayment,
}) {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [editingPayment, setEditingPayment] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const paymentMethods =
    Array.isArray(data?.paymentMethods)
      ? data.paymentMethods
      : [];

  // =========================================================
  // OPEN ADD
  // =========================================================

  const openAddModal = () => {
    setEditingId(null);
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditModal = (payment) => {
    setEditingId(payment.id);
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingId(null);
    setEditingPayment(null);
  };

  // =========================================================
  // SAVE PAYMENT
  // =========================================================

  const handleSavePayment = async (
    paymentData
  ) => {
    if (saving) return;

    try {
      setSaving(true);

      console.log(
        "PAYMENT DATA DARI MODAL:",
        paymentData
      );

      const success =
        await onSavePayment(
          paymentData,
          editingId
        );

      if (!success) {
        return;
      }

      // =====================================================
      // API SUKSES
      // Parent sudah GET ulang database
      //
      // Tutup modal setelah benar-benar berhasil.
      // =====================================================

      setIsModalOpen(false);
      setEditingId(null);
      setEditingPayment(null);

      alert(
        editingId
          ? "Metode pembayaran berhasil diperbarui."
          : "Metode pembayaran berhasil ditambahkan."
      );
    } catch (error) {
      console.error(
        "ERROR PAYMENT:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const deletePayment = () => {
    alert(
      "Fitur hapus metode pembayaran belum tersedia di API backend."
    );
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <>
      <SettingSection
        title="METODE PEMBAYARAN"
        icon={
          <CreditCard
            size={14}
            className="text-white"
          />
        }
        iconClass="bg-[#ed3044]"
        action={
          <button
            type="button"
            onClick={openAddModal}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#252423] text-white transition hover:bg-[#353331] active:scale-95"
            title="Tambah metode pembayaran"
          >
            <Plus
              size={17}
              strokeWidth={2.2}
            />
          </button>
        }
      >
        {/* PAYMENT LIST */}

        <div className="space-y-2.5">
          {paymentMethods.length === 0 ? (
            <div className="rounded-[11px] bg-[#f7f4ec] px-4 py-7 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#eae7df] text-[#77736b]">
                <CreditCard size={18} />
              </div>

              <p className="text-[11px] font-bold text-[#292725]">
                Belum ada metode pembayaran
              </p>

              <p className="mt-1 text-[9px] text-[#aaa59d]">
                Klik tombol + untuk menambahkan.
              </p>
            </div>
          ) : (
            paymentMethods.map(
              (payment) => (
                <div
                  key={payment.id}
                  className="flex min-h-[62px] items-center justify-between gap-3 rounded-[11px] bg-[#f7f4ec] px-3 py-2.5"
                >
                  {/* INFO */}

                  <div className="flex min-w-0 items-center gap-2.5">
                    <PaymentIcon
                      type={
                        payment.method ||
                        payment.type
                      }
                    />

                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-bold text-[#292725]">
                        {getPaymentName(
                          payment
                        )}
                      </p>

                      <p className="mt-0.5 truncate text-[9px] text-[#aaa59d]">
                        {getPaymentDescription(
                          payment
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}

                  <div className="flex shrink-0 items-center gap-1.5">

                    {/* STATUS */}

                    <div
                      className={`flex h-[30px] w-[30px] items-center justify-center rounded-[8px] ${
                        isPaymentActive(
                          payment
                        )
                          ? "bg-[#dcf8e8] text-[#00a85a]"
                          : "bg-[#e4e1da] text-[#aaa59d]"
                      }`}
                      title={
                        isPaymentActive(
                          payment
                        )
                          ? "Aktif"
                          : "Nonaktif"
                      }
                    >
                      <Check
                        size={14}
                        strokeWidth={2.3}
                      />
                    </div>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(
                          payment
                        )
                      }
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#e6e3dc] text-[#292725] transition hover:bg-[#ddd9d0] active:scale-95"
                      title="Edit"
                    >
                      <Pencil
                        size={13}
                        strokeWidth={2}
                      />
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        deletePayment(
                          payment.id
                        )
                      }
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#f8dfdc] text-[#ed3044] transition hover:bg-[#f3d1ce] active:scale-95"
                      title="Hapus"
                    >
                      <Trash2
                        size={13}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </SettingSection>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {isModalOpen && (
        <PaymentMethodModal
          editingId={editingId}
          initialData={editingPayment}
          onClose={closeModal}
          onSave={handleSavePayment}
          saving={saving}
        />
      )}
    </>
  );
}

/* =========================================================
   PAYMENT ACTIVE
========================================================= */

function isPaymentActive(payment) {
  if (
    payment.is_active !==
    undefined
  ) {
    return Boolean(
      payment.is_active
    );
  }

  return Boolean(
    payment.enabled
  );
}

/* =========================================================
   PAYMENT NAME
========================================================= */

function getPaymentName(payment) {
  const method =
    payment.method ||
    payment.type;

  if (method === "tunai") {
    return (
      payment.name ||
      "Tunai"
    );
  }

  if (method === "qris") {
    return (
      payment.name ||
      "QRIS"
    );
  }

  if (method === "tf_bank") {
    return (
      payment.name ||
      "Transfer Bank"
    );
  }

  if (method === "ewallet") {
    return (
      payment.name ||
      "E-Wallet"
    );
  }

  if (method === "kartu") {
    return (
      payment.name ||
      "Kartu"
    );
  }

  return (
    payment.name ||
    payment.provider_note ||
    "Metode Pembayaran"
  );
}

/* =========================================================
   PAYMENT DESCRIPTION
========================================================= */

function getPaymentDescription(
  payment
) {
  const method =
    payment.method ||
    payment.type;

  const provider =
    payment.provider_note ||
    payment.provider ||
    "";

  switch (method) {
    case "tunai":
      return "Pembayaran tunai";

    case "qris":
      return provider
        ? `QRIS • ${provider}`
        : "Pembayaran QRIS";

    case "tf_bank":
      return provider
        ? `Transfer Bank • ${provider}`
        : "Transfer Bank";

    case "ewallet":
      return provider
        ? `E-Wallet • ${provider}`
        : "Pembayaran E-Wallet";

    case "kartu":
      return provider
        ? `Kartu • ${provider}`
        : "Pembayaran kartu";

    default:
      return (
        provider ||
        "Metode pembayaran"
      );
  }
}

/* =========================================================
   PAYMENT ICON
========================================================= */

function PaymentIcon({ type }) {
  let icon = (
    <CreditCard
      size={17}
      strokeWidth={2}
    />
  );

  if (type === "tunai") {
    icon = (
      <Banknote
        size={17}
        strokeWidth={2}
      />
    );
  }

  if (type === "qris") {
    icon = (
      <QrCode
        size={17}
        strokeWidth={2}
      />
    );
  }

  if (type === "tf_bank") {
    icon = (
      <Building2
        size={17}
        strokeWidth={2}
      />
    );
  }

  if (type === "ewallet") {
    icon = (
      <WalletCards
        size={17}
        strokeWidth={2}
      />
    );
  }

  if (type === "kartu") {
    icon = (
      <CreditCard
        size={17}
        strokeWidth={2}
      />
    );
  }

  return (
    <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] bg-[#eae7df] text-[#68645d]">
      {icon}
    </div>
  );
}