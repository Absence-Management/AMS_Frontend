import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationIcon = ({ unreadCount }) => (
  <div className="relative">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M21.164 15.3665C21.164 14.9523 20.8282 14.6165 20.414 14.6165C19.9998 14.6165 19.664 14.9523 19.664 15.3665H20.414H21.164ZM19.664 18.1415C19.664 18.5557 19.9998 18.8915 20.414 18.8915C20.8282 18.8915 21.164 18.5557 21.164 18.1415H20.414H19.664ZM14.3556 20.8665L13.7135 20.479L13.7123 20.4811L14.3556 20.8665ZM13.2973 22.6332L12.6539 22.2477L12.6529 22.2495L13.2973 22.6332ZM14.2973 25.3415L14.0601 26.053L14.0606 26.0532L14.2973 25.3415ZM26.5723 25.3415L26.809 26.0532L26.8095 26.053L26.5723 25.3415ZM27.5723 22.6332L28.2159 22.2481L28.2157 22.2477L27.5723 22.6332ZM26.514 20.8665L27.1574 20.4811L27.1561 20.479L26.514 20.8665ZM25.989 17.2165H26.739L26.739 17.2145L25.989 17.2165ZM20.414 15.3665H19.664V18.1415H20.414H21.164V15.3665H20.414ZM20.4306 11.6665V10.9165C16.9498 10.9165 14.1306 13.7356 14.1306 17.2165H14.8806H15.6306C15.6306 14.5641 17.7782 12.4165 20.4306 12.4165V11.6665ZM14.8806 17.2165H14.1306V18.9665H14.8806H15.6306V17.2165H14.8806ZM14.8806 18.9665H14.1306C14.1306 19.1616 14.0879 19.4459 14.0045 19.7484C13.921 20.0513 13.8125 20.3149 13.7135 20.479L14.3556 20.8665L14.9978 21.254C15.1904 20.9347 15.3445 20.5317 15.4505 20.1471C15.5567 19.7622 15.6306 19.338 15.6306 18.9665H14.8806ZM14.3556 20.8665L13.7123 20.4811L12.6539 22.2477L13.2973 22.6332L13.9407 23.0186L14.999 21.2519L14.3556 20.8665ZM13.2973 22.6332L12.6529 22.2495C12.2231 22.9712 12.1331 23.784 12.4 24.5066C12.6671 25.2296 13.264 25.7876 14.0601 26.053L14.2973 25.3415L14.5345 24.63C14.1306 24.4954 13.9025 24.2451 13.8071 23.9868C13.7116 23.7282 13.7215 23.3868 13.9417 23.0169L13.2973 22.6332ZM14.2973 25.3415L14.0606 26.0532C18.1976 27.4293 22.672 27.4293 26.809 26.0532L26.5723 25.3415L26.3356 24.6298C22.5059 25.9037 18.3637 25.9037 14.534 24.6298L14.2973 25.3415ZM26.5723 25.3415L26.8095 26.053C28.3921 25.5255 29.0689 23.6736 28.2159 22.2481L27.5723 22.6332L26.9287 23.0183C27.2924 23.626 27.0025 24.4075 26.3351 24.63L26.5723 25.3415ZM27.5723 22.6332L28.2157 22.2477L27.1574 20.4811L26.514 20.8665L25.8706 21.2519L26.9289 23.0186L27.5723 22.6332ZM26.514 20.8665L27.1561 20.479C27.0577 20.3159 26.9491 20.0508 26.8653 19.7458C26.7815 19.4412 26.739 19.1571 26.739 18.9665H25.989H25.239C25.239 19.3343 25.3131 19.7585 25.4189 20.1434C25.5247 20.528 25.6786 20.9338 25.8718 21.254L26.514 20.8665ZM25.989 18.9665H26.739V17.2165H25.989H25.239V18.9665H25.989ZM25.989 17.2165L26.739 17.2145C26.7295 13.7522 23.8953 10.9165 20.4306 10.9165V11.6665V12.4165C23.066 12.4165 25.2318 14.5808 25.239 17.2186L25.989 17.2165ZM23.189 25.6832H22.439C22.439 26.794 21.5248 27.7082 20.414 27.7082V28.4582V29.2082C22.3532 29.2082 23.939 27.6224 23.939 25.6832H23.189ZM20.414 28.4582V27.7082C19.8656 27.7082 19.3533 27.4785 18.986 27.1112L18.4556 27.6415L17.9253 28.1718C18.558 28.8045 19.4457 29.2082 20.414 29.2082V28.4582ZM18.4556 27.6415L18.986 27.1112C18.6186 26.7438 18.389 26.2316 18.389 25.6832H17.639H16.889C16.889 26.6514 17.2926 27.5392 17.9253 28.1718L18.4556 27.6415Z"
        fillOpacity="0.8"
        fill="#16151C"
      />
    </svg>
    {unreadCount > 0 && (
      <span className="absolute top-1 right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    )}
  </div>
);

export function NotificationDropdown() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="navbar-notification flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <NotificationIcon unreadCount={unreadCount} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[22rem] sm:w-[26rem] bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] border border-[#e3e8ef] overflow-hidden z-50">
          <div className="px-5 py-4 border-b border-[#e3e8ef] flex justify-between items-center bg-white">
            <h3 className="font-semibold text-[#030712] font-poppins text-[0.9375rem]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[0.8125rem] font-medium text-[#143888] hover:text-[#0f2d6e] transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#9ca3af] text-[0.875rem]">
                <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-[#e3e8ef] border-t-[#143888] mb-3"></div>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-3 text-[#d1d5db]">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor"/>
                </svg>
                <p className="text-[#4a5567] text-[0.9375rem] font-medium mb-1">No notifications</p>
                <p className="text-[#9ca3af] text-[0.8125rem]">You're all caught up!</p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => {
                      if (!notif.is_read) {
                        markAsRead(notif.id);
                      }
                    }}
                    className={`relative p-4 sm:px-5 hover:bg-[#f8faff] cursor-pointer transition-colors border-b border-[#e3e8ef] last:border-b-0 ${
                      !notif.is_read ? "bg-[#f4f7ff]" : "bg-white"
                    }`}
                  >
                    {!notif.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#143888] rounded-r-md"></div>
                    )}
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className={`text-[0.875rem] font-semibold leading-snug truncate ${!notif.is_read ? 'text-[#030712]' : 'text-[#4a5567]'}`}>
                            {notif.title}
                          </p>
                          {!notif.is_read && (
                            <span className="shrink-0 w-2 h-2 mt-1.5 bg-[#143888] rounded-full shadow-[0_0_0_3px_rgba(20,56,136,0.1)]"></span>
                          )}
                        </div>
                        <p className={`text-[0.8125rem] leading-relaxed line-clamp-2 ${!notif.is_read ? 'text-[#374151]' : 'text-[#6b7280]'}`}>
                          {notif.body}
                        </p>
                        <p className="text-[0.75rem] text-[#9ca3af] mt-2 font-medium flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-3 border-t border-[#e3e8ef] bg-[#f8faff] text-center">
            <button className="text-[0.8125rem] font-semibold text-[#143888] hover:text-[#0f2d6e] transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
