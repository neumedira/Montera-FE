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

export default function PaymentMethods({ data, setData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  const paymentMethods = Array.isArray(data?.paymentMethods)
    ? data.paymentMethods
    : [];

  /* =======================================================
     OPEN ADD MODAL
  ======================================================= */

  const openAddModal = () => {
    setEditingId(null);
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  /* =======================================================
     OPEN EDIT MODAL
  ======================================================= */

  const openEditModal = (payment) => {
    setEditingId(payment.id);
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingPayment(null);
  };

  /* =======================================================
     SAVE PAYMENT
  ======================================================= */

  const handleSavePayment = (paymentData) => {
    if (editingId) {
      /* EDIT */

      setData((prev) => ({
        ...prev,

        paymentMethods: Array.isArray(prev.paymentMethods)
          ? prev.paymentMethods.map((payment) =>
              payment.id === editingId
                ? {
                    ...payment,
                    ...paymentData,
                    id: editingId,
                  }
                : payment
            )
          : [],
      }));
    } else {
      /* ADD */

      setData((prev) => ({
        ...prev,

        paymentMethods: [
          ...(Array.isArray(prev.paymentMethods)
            ? prev.paymentMethods
            : []),

          {
            ...paymentData,
            id: Date.now(),
          },
        ],
      }));
    }

    closeModal();
  };

  /* =======================================================
     DELETE PAYMENT
  ======================================================= */

  const deletePayment = (id) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus metode pembayaran ini?"
    );

    if (!confirmed) return;

    setData((prev) => ({
      ...prev,

      paymentMethods: Array.isArray(prev.paymentMethods)
        ? prev.paymentMethods.filter(
            (payment) => payment.id !== id
          )
        : [],
    }));
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      {/* =====================================================
          PAYMENT SECTION
      ===================================================== */}

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
            paymentMethods.map((payment) => (
              <div
                key={payment.id}
                className="flex min-h-[62px] items-center justify-between gap-3 rounded-[11px] bg-[#f7f4ec] px-3 py-2.5"
              >
                {/* INFO */}

                <div className="flex min-w-0 items-center gap-2.5">
                  <PaymentIcon type={payment.type} />

                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-bold text-[#292725]">
                      {payment.name}
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-[#aaa59d]">
                      {getPaymentDescription(payment)}
                    </p>
                  </div>
                </div>

                {/* ACTION */}

                <div className="flex shrink-0 items-center gap-1.5">
                  {/* STATUS */}

                  <div
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-[8px] ${
                      payment.enabled
                        ? "bg-[#dcf8e8] text-[#00a85a]"
                        : "bg-[#e4e1da] text-[#aaa59d]"
                    }`}
                    title={
                      payment.enabled
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
                      openEditModal(payment)
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
                      deletePayment(payment.id)
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
            ))
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
        />
      )}
    </>
  );
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

/* =========================================================
   PAYMENT DESCRIPTION
========================================================= */

function getPaymentDescription(payment) {
  switch (payment.type) {
    case "tunai":
      return "Pembayaran tunai";

    case "qris":
      return payment.provider
        ? `QRIS • ${payment.provider}`
        : "Pembayaran QRIS";

    case "tf_bank":
      return payment.bankName
        ? `Transfer Bank • ${payment.bankName}`
        : "Transfer Bank";

    case "ewallet":
      return payment.ewalletType
        ? `E-Wallet • ${payment.ewalletType}`
        : "Pembayaran E-Wallet";

    case "kartu":
      return payment.cardProvider
        ? `${payment.cardType || "Kartu"} • ${payment.cardProvider}`
        : "Pembayaran kartu";

    default:
      return (
        payment.description ||
        "Metode pembayaran"
      );
  }
}