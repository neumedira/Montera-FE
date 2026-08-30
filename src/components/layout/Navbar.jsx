
import { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import NotificationModal from "../modal/NotificationModal";
import NewOrderModal from "../modal/NewOrderModal";

import logoBlack from "../../assets/logoblack.png";

import api from "../../api/axios";
import echo from "../../echo";

export default function Navbar() {
  // =========================================================
  // NOTIFICATION MODAL
  // =========================================================

  const [
    isNotificationOpen,
    setIsNotificationOpen,
  ] = useState(false);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  // =========================================================
  // NEW ORDER POPUP
  // =========================================================

  const [
    newOrder,
    setNewOrder,
  ] = useState(null);

  // =========================================================
  // LOGOUT
  // =========================================================

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  const navigate =
    useNavigate();

  // =========================================================
  // FETCH UNREAD NOTIFICATIONS
  // =========================================================

  const fetchNotifications =
    async () => {
      try {
        const response =
          await api.get(
            "admin/notifications"
          );

        console.log(
          "🔔 NOTIFICATIONS API:",
          response.data
        );

        const data =
          response.data?.data;

        setNotifications(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "❌ Gagal mengambil notifications:",
          error
        );

        console.error(
          "❌ Notification response:",
          error.response?.data
        );

        setNotifications([]);
      }
    };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================================================
  // REALTIME NOTIFICATION
  // =========================================================

  useEffect(() => {
    console.log(
      "🔔 Connecting to admin-notifications..."
    );

    const channel =
      echo.channel(
        "admin-notifications"
      );

    console.log(
      "📡 ECHO CHANNEL CREATED:",
      channel
    );

    // =======================================================
    // SUBSCRIBED
    // =======================================================

    channel.subscribed(() => {
      console.log(
        "✅ SUBSCRIBED: admin-notifications"
      );
    });

    // =======================================================
    // LISTEN EVENT
    // =======================================================

    channel.listen(
      ".notification.created",
      (event) => {
        console.log(
          "🔥 REALTIME NOTIFICATION RECEIVED:",
          event
        );

        console.log(
          "📦 EVENT PAYLOAD:",
          event?.notification
        );

        const notification =
          event?.notification;

        if (!notification) {
          console.warn(
            "⚠️ notification payload kosong:",
            event
          );

          return;
        }

        // =================================================
        // ADD TO NOTIFICATION LIST
        // =================================================

        setNotifications(
          (current) => {
            const exists =
              current.some(
                (item) =>
                  Number(
                    item.id
                  ) ===
                  Number(
                    notification.id
                  )
              );

            if (exists) {
              return current;
            }

            return [
              notification,
              ...current,
            ];
          }
        );

        // =================================================
        // SHOW NEW ORDER POPUP
        // =================================================

        setNewOrder(
          notification
        );
      }
    );

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      console.log(
        "🔔 Leaving admin-notifications..."
      );

      echo.leave(
        "admin-notifications"
      );
    };
  }, []);

  // =========================================================
  // AUTO CLOSE NEW ORDER POPUP
  // =========================================================

  useEffect(() => {
    if (!newOrder) {
      return;
    }

    console.log(
      "📢 SHOW NEW ORDER POPUP:",
      newOrder
    );

    const timer =
      setTimeout(() => {
        setNewOrder(null);
      }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [newOrder]);

  // =========================================================
  // AUTO MARK NOTIFICATIONS AS READ
  // WHEN MODAL OPENS
  // =========================================================

  useEffect(() => {
    if (
      !isNotificationOpen ||
      notifications.length === 0
    ) {
      return;
    }

    const unreadNotifications =
      notifications.filter(
        (notification) =>
          notification?.is_read !==
            true &&
          notification?.is_read !==
            1
      );

    if (
      unreadNotifications.length ===
      0
    ) {
      return;
    }

    const markOpenedAsRead =
      async () => {
        try {
          await Promise.all(
            unreadNotifications.map(
              (notification) =>
                api.patch(
                  `admin/notifications/${notification.id}/read`
                )
            )
          );

          setNotifications(
            (current) =>
              current.map(
                (notification) => ({
                  ...notification,
                  is_read: true,
                })
              )
          );

          console.log(
            "✅ Notification otomatis ditandai read."
          );
        } catch (error) {
          console.error(
            "❌ Gagal menandai notification sebagai read:",
            error
          );
        }
      };

    markOpenedAsRead();
  }, [
    isNotificationOpen,
    notifications,
  ]);

  // =========================================================
  // UNREAD COUNT
  // =========================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification?.is_read !==
          true &&
        notification?.is_read !==
          1
    ).length;

  // =========================================================
  // CLOSE NEW ORDER POPUP
  // =========================================================

  const handleCloseNewOrder =
    () => {
      console.log(
        "❌ CLOSE NEW ORDER POPUP"
      );

      setNewOrder(null);
    };

  // =========================================================
  // CLOSE NOTIFICATION MODAL
  // =========================================================

  const handleCloseNotification =
    () => {
      setIsNotificationOpen(
        false
      );
    };

  // =========================================================
  // OPEN NOTIFICATION MODAL
  // =========================================================

  const handleOpenNotification =
    () => {
      setIsNotificationOpen(
        true
      );
    };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    const token =
      localStorage.getItem(
        "admin_token"
      );

    try {
      if (token) {
        await api.post(
          "/admin/logout",
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error(
        "Logout API gagal:",
        error
      );
    } finally {
      localStorage.removeItem(
        "admin_token"
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );

      setIsLoggingOut(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className="
          fixed
          top-0
          left-0
          right-0
          z-50
          flex
          h-[66px]
          items-center
          justify-between
          bg-[#252423]
          px-5
          text-white
          md:px-8
        "
      >

        {/* ===================================================
            LOGO
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              overflow-hidden
              rounded-md
              bg-[#fffdf7]
            "
          >
            <img
              src={logoBlack}
              alt="Montera Logo"
              className="
                h-[21px]
                w-[21px]
                object-contain
              "
            />
          </div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                text-[18px]
                font-bold
              "
            >
              Montera
            </span>

            <span
              className="
                text-[13px]
                text-[#777572]
              "
            >
              Admin
            </span>
          </div>
        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-5
          "
        >

          {/* =================================================
              NOTIFICATION
          ================================================= */}

          <button
            type="button"
            onClick={
              handleOpenNotification
            }
            className="
              relative
              text-[#b8b6b1]
              transition
              hover:text-white
            "
            aria-label="Notifikasi"
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -right-3
                  -top-3
                  flex
                  h-[20px]
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F23B48]
                  px-1
                  text-[11px]
                  font-bold
                  text-white
                "
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={
              handleLogout
            }
            disabled={
              isLoggingOut
            }
            className="
              flex
              items-center
              gap-2
              text-[13px]
              text-[#a9a7a2]
              transition
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <LogOut size={17} />

            <span>
              {isLoggingOut
                ? "Keluar..."
                : "Keluar"}
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================
          SPACER
      ===================================================== */}

      <div className="h-[66px]" />

      {/* =====================================================
          NOTIFICATION LIST
      ===================================================== */}

      <NotificationModal
        isOpen={
          isNotificationOpen
        }
        onClose={
          handleCloseNotification
        }
        notifications={
          notifications
        }
      />

      {/* =====================================================
          REALTIME NEW ORDER POPUP
      ===================================================== */}

      <NewOrderModal
        isOpen={
          Boolean(newOrder)
        }
        onClose={
          handleCloseNewOrder
        }
        orderId={
          newOrder?.order_number ||
          "ORDER BARU"
        }
      />
    </>
  );
}
