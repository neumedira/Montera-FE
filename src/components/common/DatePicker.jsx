import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

// =====================================================
// CONSTANT
// =====================================================

const MONTHS = [
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

const DAYS = [
  "Mg",
  "Sn",
  "Sl",
  "Rb",
  "Km",
  "Jm",
  "Sb",
];

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// PARSE DATE
// =====================================================

const parseDate = (date) => {
  if (!date) return null;

  const [year, month, day] =
    date.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
};

// =====================================================
// DISPLAY DATE
// =====================================================

const formatDisplayDate = (date) => {
  if (!date) {
    return "DD / MM / YYYY";
  }

  const [year, month, day] =
    date.split("-");

  return `${day} / ${month} / ${year}`;
};

// =====================================================
// DATE PICKER
// =====================================================

export default function DatePicker({
  mode = "single",

  // SINGLE
  value = "",
  onChange,

  // RANGE
  startDate = "",
  endDate = "",
}) {
  const [open, setOpen] =
    useState(false);

  const [selectingEnd, setSelectingEnd] =
    useState(false);

  const containerRef =
    useRef(null);

  // ===================================================
  // CURRENT MONTH
  // ===================================================

  const getInitialMonth = () => {
    const initialDate =
      mode === "range"
        ? startDate
        : value;

    if (initialDate) {
      const date =
        parseDate(initialDate);

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      );
    }

    return new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
  };

  const [currentMonth, setCurrentMonth] =
    useState(getInitialMonth);

  // ===================================================
  // CLOSE WHEN CLICK OUTSIDE
  // ===================================================

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
        setSelectingEnd(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ===================================================
  // OPEN
  // ===================================================

  const handleOpen = () => {
    setOpen(true);

    const initialDate =
      mode === "range"
        ? startDate
        : value;

    if (initialDate) {
      const date =
        parseDate(initialDate);

      setCurrentMonth(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        )
      );
    }

    if (
      mode === "range" &&
      !startDate
    ) {
      setSelectingEnd(false);
    }
  };

  // ===================================================
  // PREVIOUS MONTH
  // ===================================================

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  // ===================================================
  // NEXT MONTH
  // ===================================================

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  // ===================================================
  // SELECT DATE - SINGLE
  // ===================================================

  const handleSingleDate = (
    date
  ) => {
    onChange(formatDate(date));

    setOpen(false);
  };

  // ===================================================
  // SELECT DATE - RANGE
  // ===================================================

  const handleRangeDate = (
    date
  ) => {
    const selected =
      formatDate(date);

    // Belum ada tanggal awal
    if (!startDate) {
      onChange(selected, "");

      setSelectingEnd(true);

      return;
    }

    // Sudah ada tanggal awal,
    // tapi belum ada tanggal akhir
    if (
      startDate &&
      !endDate
    ) {
      // Kalau tanggal kedua lebih kecil
      // dari tanggal pertama,
      // jadikan dia tanggal awal
      if (selected < startDate) {
        onChange(
          selected,
          startDate
        );

        setOpen(false);
        setSelectingEnd(false);

        return;
      }

      onChange(
        startDate,
        selected
      );

      setOpen(false);
      setSelectingEnd(false);

      return;
    }

    // Kalau range sudah lengkap,
    // mulai range baru
    onChange(selected, "");

    setSelectingEnd(true);
  };

  // ===================================================
  // SELECT DATE
  // ===================================================

  const handleSelectDate = (
    date
  ) => {
    if (mode === "single") {
      handleSingleDate(date);
      return;
    }

    handleRangeDate(date);
  };

  // ===================================================
  // CLEAR
  // ===================================================

  const handleClear = (event) => {
    event.stopPropagation();

    if (mode === "single") {
      onChange("");
      return;
    }

    onChange("", "");

    setSelectingEnd(false);
  };

  // ===================================================
  // CALENDAR DATA
  // ===================================================

  const year =
    currentMonth.getFullYear();

  const month =
    currentMonth.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = [];

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(
      new Date(
        year,
        month,
        day
      )
    );
  }

  // ===================================================
  // TODAY
  // ===================================================

  const today = new Date();

  const isToday = (date) => {
    if (!date) return false;

    return (
      date.getFullYear() ===
        today.getFullYear() &&
      date.getMonth() ===
        today.getMonth() &&
      date.getDate() ===
        today.getDate()
    );
  };

  // ===================================================
  // SINGLE SELECTED
  // ===================================================

  const isSingleSelected = (
    date
  ) => {
    if (!date || !value) {
      return false;
    }

    return (
      formatDate(date) === value
    );
  };

  // ===================================================
  // RANGE SELECTED
  // ===================================================

  const isRangeStart = (
    date
  ) => {
    if (!date || !startDate) {
      return false;
    }

    return (
      formatDate(date) ===
      startDate
    );
  };

  const isRangeEnd = (
    date
  ) => {
    if (!date || !endDate) {
      return false;
    }

    return (
      formatDate(date) ===
      endDate
    );
  };

  const isInRange = (
    date
  ) => {
    if (
      !date ||
      !startDate ||
      !endDate
    ) {
      return false;
    }

    const current =
      formatDate(date);

    return (
      current > startDate &&
      current < endDate
    );
  };

  // ===================================================
  // DISPLAY VALUE
  // ===================================================

  const displayValue =
    mode === "single"
      ? formatDisplayDate(value)
      : startDate && endDate
      ? `${formatDisplayDate(
          startDate
        )} — ${formatDisplayDate(
          endDate
        )}`
      : startDate
      ? `${formatDisplayDate(
          startDate
        )} — pilih tanggal akhir`
      : "DD / MM / YYYY — DD / MM / YYYY";

  const hasValue =
    mode === "single"
      ? !!value
      : !!startDate || !!endDate;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >

      {/* =================================================
          INPUT CONTAINER
      ================================================= */}

      <button
        type="button"
        onClick={handleOpen}
        className="
          flex
          h-[44px]
          w-full
          items-center
          justify-between
          rounded-xl
          border
          border-[#E7E1D5]
          bg-[#FFFCF4]
          px-3
          shadow-sm
          transition
          hover:border-[#CFC8BA]
          focus:outline-none
        "
      >

        <span
          className={`
            text-sm
            ${
              hasValue
                ? "text-[#4A4742]"
                : "text-[#8D8A83]"
            }
          `}
        >
          {displayValue}
        </span>

        <div className="flex items-center gap-1">

          {/* CLEAR */}
          {hasValue && (
            <span
              onClick={handleClear}
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                text-[#9B9891]
                transition
                hover:bg-[#EDE9E0]
                hover:text-[#292825]
              "
              title="Hapus tanggal"
            >
              <X size={15} />
            </span>
          )}

          <CalendarDays
            size={17}
            strokeWidth={1.6}
            className="text-[#8D8A83]"
          />

        </div>

      </button>


      {/* =================================================
          CALENDAR
      ================================================= */}

      {open && (
        <div
          className="
            absolute
            left-0
            top-[52px]
            z-50
            w-[320px]
            rounded-2xl
            border
            border-[#E7E1D5]
            bg-[#FFFCF4]
            p-4
            shadow-[0_12px_30px_rgba(39,38,36,0.12)]
          "
        >

          {/* =================================================
              RANGE STATUS
          ================================================= */}

          {mode === "range" && (
            <div className="mb-3">

              <p className="text-xs font-semibold text-[#8D8982]">
                {selectingEnd
                  ? "Pilih tanggal akhir"
                  : startDate
                  ? "Pilih tanggal"
                  : "Pilih tanggal mulai"}
              </p>

            </div>
          )}


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-4 flex items-center justify-between">

            <button
              type="button"
              onClick={
                handlePreviousMonth
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                text-[#6F6B65]
                transition
                hover:bg-[#EDE9E0]
              "
            >
              <ChevronLeft
                size={17}
              />
            </button>


            <p className="text-sm font-bold text-[#302E2B]">
              {MONTHS[month]} {year}
            </p>


            <button
              type="button"
              onClick={
                handleNextMonth
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                text-[#6F6B65]
                transition
                hover:bg-[#EDE9E0]
              "
            >
              <ChevronRight
                size={17}
              />
            </button>

          </div>


          {/* =================================================
              DAY HEADER
          ================================================= */}

          <div className="mb-2 grid grid-cols-7">

            {DAYS.map(
              (day) => (
                <div
                  key={day}
                  className="
                    flex
                    h-8
                    items-center
                    justify-center
                    text-[11px]
                    font-semibold
                    text-[#AAA59D]
                  "
                >
                  {day}
                </div>
              )
            )}

          </div>


          {/* =================================================
              DAYS
          ================================================= */}

          <div className="grid grid-cols-7 gap-y-1">

            {calendarDays.map(
              (date, index) => {

                if (!date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="h-9"
                    />
                  );
                }

                const selected =
                  mode === "single"
                    ? isSingleSelected(
                        date
                      )
                    : isRangeStart(
                        date
                      ) ||
                      isRangeEnd(
                        date
                      );

                const inRange =
                  mode === "range" &&
                  isInRange(date);

                const todayDate =
                  isToday(date);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() =>
                      handleSelectDate(
                        date
                      )
                    }
                    className={`
                      relative
                      flex
                      h-9
                      items-center
                      justify-center
                      text-xs
                      transition

                      ${
                        inRange
                          ? "bg-[#E9E5DC] text-[#4A4742]"
                          : "rounded-full hover:bg-[#EDE9E0]"
                      }
                    `}
                  >

                    {/* RANGE BACKGROUND */}
                    {inRange && (
                      <span
                        className="
                          absolute
                          inset-y-1
                          left-0
                          right-0
                          bg-[#E9E5DC]
                        "
                      />
                    )}


                    {/* SELECTED CIRCLE */}
                    {selected && (
                      <span
                        className="
                          absolute
                          inset-1
                          rounded-full
                          bg-[#272624]
                        "
                      />
                    )}


                    {/* DATE NUMBER */}
                    <span
                      className={`
                        relative
                        z-10
                        ${
                          selected
                            ? "font-semibold text-white"
                            : "text-[#4A4742]"
                        }
                        ${
                          todayDate &&
                          !selected
                            ? "font-bold underline underline-offset-2"
                            : ""
                        }
                      `}
                    >
                      {date.getDate()}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        </div>
      )}

    </div>
  );
}