
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Edit2,
  Check,
  Trash2,
  Search,
} from "lucide-react";

import {
  QRCodeCanvas,
} from "qrcode.react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import ModalEditQR from "../components/kelola-qr/ModalEditQR";
import ModalDeleteQR from "../components/kelola-qr/ModalDeleteQR";

import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "../api/admin";

// =========================================================
// FRONTEND URL
// =========================================================
// Untuk testing dari HP.
// Nanti kalau sudah deploy, bisa diganti via .env.

const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  "http://10.174.91.209:5173";

// =========================================================
// FORMAT DATE
// =========================================================

const formatTanggal = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${date.getDate()} - ${
    months[date.getMonth()]
  } - ${date.getFullYear()}`;
};

// =========================================================
// BUILD CUSTOMER QR URL
// =========================================================
// QR diarahkan ke:
// /scan/{qr_token}

const getCustomerQrUrl = (table) => {
  if (!table?.qr_token) {
    return "";
  }

  return `${FRONTEND_URL}/scan/${table.qr_token}`;
};

// =========================================================
// NORMALIZE TABLE
// =========================================================

const normalizeTable = (table) => {
  return {
    ...table,

    id:
      table.id,

    nama:
      table.table_number ?? "",

    table_number:
      table.table_number ?? "",

    qr_token:
      table.qr_token ?? "",

    // QR TEXT SELALU DIBUAT DARI TOKEN
    qrText:
      getCustomerQrUrl(
        table
      ),

    // Simpan URL backend untuk referensi saja
    qr_code_url:
      table.qr_code_url ?? "",

    isTersedia:
      table.is_active === true ||
      table.is_active === 1 ||
      table.is_active === "1",

    is_active:
      table.is_active === true ||
      table.is_active === 1 ||
      table.is_active === "1",

    tanggal:
      formatTanggal(
        table.created_at
      ),
  };
};

// =========================================================
// PAGE
// =========================================================

export default function KelolaQR() {
  // =======================================================
  // FORM
  // =======================================================

  const [
    inputNama,
    setInputNama,
  ] = useState("");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  // =======================================================
  // DATA
  // =======================================================

  const [
    qrList,
    setQrList,
  ] = useState([]);

  // =======================================================
  // STATE
  // =======================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // =======================================================
  // EDIT
  // =======================================================

  const [
    isModalEditOpen,
    setIsModalEditOpen,
  ] = useState(false);

  const [
    editingItem,
    setEditingItem,
  ] = useState(null);

  // =======================================================
  // DELETE
  // =======================================================

  const [
    isModalDeleteOpen,
    setIsModalDeleteOpen,
  ] = useState(false);

  const [
    deletingItem,
    setDeletingItem,
  ] = useState(null);

  // =========================================================
  // FETCH TABLES
  // =========================================================

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getTables();

      console.log(
        "TABLES API:",
        response
      );

      const rawTables =
        Array.isArray(
          response?.data
        )
          ? response.data
          : [];

      console.log(
        "RAW TABLES:",
        rawTables
      );

      const normalizedTables =
        rawTables.map(
          normalizeTable
        );

      console.log(
        "NORMALIZED TABLES:",
        normalizedTables
      );

      setQrList(
        normalizedTables
      );
    } catch (error) {
      console.error(
        "Gagal mengambil data meja:",
        error
      );

      console.error(
        "Response error:",
        error.response?.data
      );

      setError(
        error.response?.data
          ?.message ||
          "Gagal mengambil data meja."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchTables();
  }, []);

  // =========================================================
  // ADD TABLE / QR
  // =========================================================

  const handleAddQR = async (
    event
  ) => {
    event.preventDefault();

    const tableNumber =
      inputNama.trim();

    if (!tableNumber) {
      return;
    }

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      console.log(
        "CREATE TABLE:",
        {
          table_number:
            tableNumber,
        }
      );

      const response =
        await createTable({
          table_number:
            tableNumber,
        });

      console.log(
        "CREATE TABLE RESPONSE:",
        response
      );

      const createdTable =
        response?.data;

      if (createdTable) {
        const normalized =
          normalizeTable(
            createdTable
          );

        setQrList(
          (prev) => [
            normalized,
            ...prev,
          ]
        );
      } else {
        await fetchTables();
      }

      setInputNama("");

      alert(
        "QR meja berhasil dibuat."
      );
    } catch (error) {
      console.error(
        "Gagal membuat meja:",
        error
      );

      console.error(
        "Response error:",
        error.response?.data
      );

      const message =
        error.response?.data
          ?.message ||
        "Gagal membuat QR meja.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const handleOpenEdit =
    (item) => {
      setEditingItem(item);
      setIsModalEditOpen(true);
    };

  // =========================================================
  // SAVE EDIT
  // =========================================================

  const handleSaveEdit =
    async (updatedData) => {
      if (!updatedData?.id) {
        return;
      }

      if (saving) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        const payload = {
          table_number:
            updatedData.table_number ??
            updatedData.nama ??
            "",

          is_active:
            Boolean(
              updatedData.is_active ??
                updatedData.isTersedia
            ),
        };

        console.log(
          "UPDATE TABLE PAYLOAD:",
          payload
        );

        const response =
          await updateTable(
            updatedData.id,
            payload
          );

        console.log(
          "UPDATE TABLE RESPONSE:",
          response
        );

        const updatedTable =
          response?.data;

        if (updatedTable) {
          const normalized =
            normalizeTable(
              updatedTable
            );

          setQrList(
            (prev) =>
              prev.map(
                (item) =>
                  Number(
                    item.id
                  ) ===
                  Number(
                    normalized.id
                  )
                    ? normalized
                    : item
              )
          );
        } else {
          await fetchTables();
        }

        setIsModalEditOpen(
          false
        );

        setEditingItem(
          null
        );

        alert(
          "Data meja berhasil diperbarui."
        );
      } catch (error) {
        console.error(
          "Gagal memperbarui meja:",
          error
        );

        console.error(
          "Response error:",
          error.response?.data
        );

        alert(
          error.response?.data
            ?.message ||
            "Gagal memperbarui data meja."
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================================================
  // OPEN DELETE
  // =========================================================

  const handleOpenDelete =
    (item) => {
      setDeletingItem(item);
      setIsModalDeleteOpen(true);
    };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const handleConfirmDelete =
    async () => {
      if (!deletingItem?.id) {
        return;
      }

      if (saving) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        console.log(
          "DELETE TABLE ID:",
          deletingItem.id
        );

        await deleteTable(
          deletingItem.id
        );

        setQrList(
          (prev) =>
            prev.filter(
              (item) =>
                Number(
                  item.id
                ) !==
                Number(
                  deletingItem.id
                )
            )
        );

        setIsModalDeleteOpen(
          false
        );

        setDeletingItem(
          null
        );

        alert(
          "QR meja berhasil dihapus."
        );
      } catch (error) {
        console.error(
          "Gagal menghapus meja:",
          error
        );

        console.error(
          "Response error:",
          error.response?.data
        );

        alert(
          error.response?.data
            ?.message ||
            "Gagal menghapus QR meja."
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredQrList =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return qrList;
      }

      return qrList.filter(
        (item) =>
          String(
            item.table_number ||
              item.nama ||
              ""
          )
            .toLowerCase()
            .includes(
              query
            )
      );
    }, [
      qrList,
      searchQuery,
    ]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen text-[#222222] font-sans relative">

        <Navbar />

        <main className="pt-6 pb-28 max-w-[1000px] mx-auto px-6">

          <div className="py-4">

            <h1 className="text-2xl font-extrabold tracking-tight text-[#222222]">
              Kelola QR TABLE
            </h1>

            <p className="mt-1 text-sm text-gray-500 font-medium">
              Memuat data meja...
            </p>

          </div>

        </main>

        <BottomNavigation />

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#222222] font-sans relative">

      <Navbar />

      <main className="pt-6 pb-28 max-w-[1000px] mx-auto px-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#222222]">
              Kelola QR TABLE
            </h1>

            <p className="mt-1 text-sm text-gray-500 font-medium">
              {qrList.length} QR
            </p>

          </div>

          {/* SEARCH */}

          <div className="relative flex items-center w-full sm:w-64">

            <Search
              size={16}
              className="absolute left-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari nomor meja..."
              value={
                searchQuery
              }
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              className="w-full pl-9 pr-4 py-2 bg-[#FAF6EE] border border-gray-200/80 rounded-full text-xs outline-none placeholder-gray-400 focus:border-black transition-colors"
            />

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-xs font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={
                fetchTables
              }
              className="mt-1 text-xs font-bold underline text-red-600"
            >
              Coba lagi
            </button>

          </div>
        )}

        {/* =================================================
            FORM TAMBAH QR
        ================================================= */}

        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-gray-200/60 mb-6">

          <label className="text-xs font-bold text-[#222222] block mb-2">
            Tambah QR Meja
          </label>

          <form
            onSubmit={
              handleAddQR
            }
            className="flex gap-2"
          >

            <input
              type="text"
              placeholder="Nomor Meja"
              value={
                inputNama
              }
              onChange={(event) =>
                setInputNama(
                  event.target.value
                )
              }
              disabled={
                saving
              }
              className="flex-1 px-4 py-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl text-sm outline-none placeholder-gray-400 focus:border-black disabled:opacity-50"
              required
            />

            <button
              type="submit"
              disabled={
                saving ||
                !inputNama.trim()
              }
              className="bg-[#222222] text-white p-2.5 rounded-xl hover:bg-black transition-colors flex items-center justify-center shrink-0 w-11 disabled:cursor-not-allowed disabled:opacity-50"
              title="Tambah QR Meja"
            >
              <Plus
                size={20}
              />
            </button>

          </form>

        </div>

        {/* =================================================
            DAFTAR QR
        ================================================= */}

        <div className="space-y-3">

          {filteredQrList.map(
            (item) => {

              // =============================================
              // PENTING:
              // QR SELALU MENGGUNAKAN QR TOKEN
              // =============================================

              const qrValue =
                getCustomerQrUrl(
                  item
                );

              const isActive =
                item.is_active;

              return (
                <div
                  key={
                    item.id
                  }
                  className={`bg-[#FAF6EE] p-3.5 rounded-2xl border border-gray-200/60 shadow-sm flex items-center justify-between transition-all ${
                    !isActive
                      ? "opacity-60 bg-gray-200/50"
                      : ""
                  }`}
                >

                  {/* QR + INFO */}

                  <div className="flex items-center space-x-3.5">

                    {/* QR CODE */}

                    <div className="w-14 h-14 flex items-center justify-center rounded-lg border border-gray-200/60 bg-white overflow-hidden">

                      {qrValue ? (
                        <QRCodeCanvas
                          value={
                            qrValue
                          }
                          size={
                            50
                          }
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                        />
                      ) : (
                        <span className="text-[8px] text-gray-400 text-center px-1">
                          QR tidak tersedia
                        </span>
                      )}

                    </div>

                    {/* INFO MEJA */}

                    <div>

                      <h3 className="font-bold text-base text-[#222222]">
                        {item.table_number}
                      </h3>

                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {item.tanggal}
                      </p>

                    </div>

                  </div>

                  {/* ACTION */}

                  <div className="flex flex-col space-y-1.5 items-center">

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenEdit(
                          item
                        )
                      }
                      disabled={
                        saving
                      }
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit"
                    >
                      <Edit2
                        size={15}
                      />
                    </button>

                    {/* STATUS */}

                    <div
                      className={`p-1.5 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-200 text-gray-400"
                      }`}
                      title={
                        isActive
                          ? "Aktif"
                          : "Nonaktif"
                      }
                    >
                      <Check
                        size={15}
                        strokeWidth={3}
                      />
                    </div>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenDelete(
                          item
                        )
                      }
                      disabled={
                        saving
                      }
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Hapus"
                    >
                      <Trash2
                        size={15}
                      />
                    </button>

                  </div>

                </div>
              );
            }
          )}

          {/* EMPTY */}

          {filteredQrList.length ===
            0 && (
            <div className="text-center py-12 text-gray-400 text-sm">

              {searchQuery
                ? "Nomor meja tidak ditemukan."
                : "Belum ada meja yang dibuat."}

            </div>
          )}

        </div>

      </main>

      {/* =================================================
          MODAL EDIT
      ================================================= */}

      <ModalEditQR
        isOpen={
          isModalEditOpen
        }
        onClose={() => {
          if (saving) {
            return;
          }

          setIsModalEditOpen(
            false
          );

          setEditingItem(
            null
          );
        }}
        onSave={
          handleSaveEdit
        }
        editingItem={
          editingItem
        }
        saving={saving}
      />

      {/* =================================================
          MODAL DELETE
      ================================================= */}

      <ModalDeleteQR
        isOpen={
          isModalDeleteOpen
        }
        onClose={() => {
          if (saving) {
            return;
          }

          setIsModalDeleteOpen(
            false
          );

          setDeletingItem(
            null
          );
        }}
        onConfirm={
          handleConfirmDelete
        }
        itemName={
          deletingItem?.table_number ||
          deletingItem?.nama
        }
        saving={saving}
      />

      <BottomNavigation />

    </div>
  );
}

