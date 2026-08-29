
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

import { deletePaymentMethod } from "../../api/admin";

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
  // CLOSE MODAL
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
  // DELETE PAYMENT
  // =========================================================

  const deletePayment = async (id) => {
    if (saving) return;

    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus metode pembayaran ini?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      console.log(
        "DELETE PAYMENT ID:",
        id
      );

      // =====================================================
      // DELETE KE BACKEND
      // =====================================================

      await deletePaymentMethod(id);

      // =====================================================
      // HAPUS DARI STATE FE
      // Supaya langsung hilang dari tampilan
      // =====================================================

      setData((prev) => ({
        ...prev,

        paymentMethods:
          Array.isArray(
            prev.paymentMethods
          )
            ? prev.paymentMethods.filter(
                (payment) =>
                  payment.id !== id
              )
            : [],
      }));

      alert(
        "Metode pembayaran berhasil dihapus."
      );
    } catch (error) {
      console.error(
        "Gagal menghapus metode pembayaran:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Gagal menghapus metode pembayaran."
      );
    } finally {
      setSaving(false);
    }
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
            disabled={saving}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#252423] text-white transition hover:bg-[#353331] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            title="Tambah metode pembayaran"
          >
            <Plus
              size={17}
              strokeWidth={2.2}
            />
          </button>
        }
      >
        {/* ===================================================
            PAYMENT LIST
        =================================================== */}

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
                  {/* =================================================
                      INFO
                  ================================================= */}

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

                  {/* =================================================
                      ACTION
                  ================================================= */}

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
                      disabled={saving}
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#e6e3dc] text-[#292725] transition hover:bg-[#ddd9d0] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
                      disabled={saving}
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#f8dfdc] text-[#ed3044] transition hover:bg-[#f3d1ce] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
          PAYMENT METHOD MODAL
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
    payment.type ||
    "";

  // =======================================================
  // CASH
  // =======================================================

  if (method === "tunai") {
    return (
      payment.name ||
      "Tunai"
    );
  }

  // =======================================================
  // QRIS
  //
  // Bisa:
  // qris
  // qris_bni
  // qris_bca
  // =======================================================

  if (
    method === "qris" ||
    method.startsWith("qris_")
  ) {
    return (
      payment.name ||
      "QRIS"
    );
  }

  // =======================================================
  // TRANSFER BANK
  //
  // Bisa:
  // tf_bank
  // tf_bank_bni
  // tf_bank_bca
  // =======================================================

  if (
    method === "tf_bank" ||
    method.startsWith("tf_bank_")
  ) {
    return (
      payment.name ||
      "Transfer Bank"
    );
  }

  // =======================================================
  // E-WALLET
  //
  // Bisa:
  // ewallet
  // ewallet_dana
  // ewallet_gopay
  // =======================================================

  if (
    method === "ewallet" ||
    method.startsWith("ewallet_")
  ) {
    return (
      payment.name ||
      "E-Wallet"
    );
  }

  // =======================================================
  // KARTU
  //
  // Bisa:
  // kartu
  // kartu_bca_debit
  // =======================================================

  if (
    method === "kartu" ||
    method.startsWith("kartu_")
  ) {
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
    payment.type ||
    "";

  const provider =
    payment.provider_note ||
    payment.provider ||
    "";

  // =======================================================
  // TUNAI
  // =======================================================

  if (method === "tunai") {
    return "Pembayaran tunai";
  }

  // =======================================================
  // QRIS
  //
  // qris_bni
  // provider_note = BNI
  //
  // hasil:
  // QRIS • BNI
  // =======================================================

  if (
    method === "qris" ||
    method.startsWith("qris_")
  ) {
    return provider
      ? `QRIS • ${provider}`
      : "Pembayaran QRIS";
  }

  // =======================================================
  // TRANSFER BANK
  // =======================================================

  if (
    method === "tf_bank" ||
    method.startsWith("tf_bank_")
  ) {
    return provider
      ? `Transfer Bank • ${provider}`
      : "Transfer Bank";
  }

  // =======================================================
  // E-WALLET
  // =======================================================

  if (
    method === "ewallet" ||
    method.startsWith("ewallet_")
  ) {
    return provider
      ? `E-Wallet • ${provider}`
      : "Pembayaran E-Wallet";
  }

  // =======================================================
  // KARTU
  // =======================================================

  if (
    method === "kartu" ||
    method.startsWith("kartu_")
  ) {
    return provider
      ? `Kartu • ${provider}`
      : "Pembayaran kartu";
  }

  return (
    provider ||
    "Metode pembayaran"
  );
}

/* =========================================================
   PAYMENT ICON
========================================================= */

function PaymentIcon({
  type,
}) {
  const method =
    type || "";

  let icon = (
    <CreditCard
      size={17}
      strokeWidth={2}
    />
  );

  // =======================================================
  // TUNAI
  // =======================================================

  if (method === "tunai") {
    icon = (
      <Banknote
        size={17}
        strokeWidth={2}
      />
    );
  }

  // =======================================================
  // QRIS
  //
  // qris
  // qris_bni
  // qris_bca
  // =======================================================

  else if (
    method === "qris" ||
    method.startsWith("qris_")
  ) {
    icon = (
      <QrCode
        size={17}
        strokeWidth={2}
      />
    );
  }

  // =======================================================
  // TRANSFER BANK
  // =======================================================

  else if (
    method === "tf_bank" ||
    method.startsWith("tf_bank_")
  ) {
    icon = (
      <Building2
        size={17}
        strokeWidth={2}
      />
    );
  }

  // =======================================================
  // E-WALLET
  // =======================================================

  else if (
    method === "ewallet" ||
    method.startsWith("ewallet_")
  ) {
    icon = (
      <WalletCards
        size={17}
        strokeWidth={2}
      />
    );
  }

  // =======================================================
  // KARTU
  // =======================================================

  else if (
    method === "kartu" ||
    method.startsWith("kartu_")
  ) {
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

