import { IoIosNotifications } from "react-icons/io";
import { useEffect, useState, useRef } from "react";
import { useNews } from "../context/newsContext";

const Notification = () => {
    const { news } = useNews();
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Show red dot when new news arrives
    useEffect(() => {
        if (news.length > 0) {
            setHasNewNotification(true);
        }
        else
            setHasNewNotification(false);
    }, [news]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsNotificationVisible(false);
            }
        };

        if (isNotificationVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isNotificationVisible]);

    return (
        <div className="relative text-black">
            {/* Notification Icon */}
            <div 
                className="relative cursor-pointer"
                onClick={() => {
                    setIsNotificationVisible(!isNotificationVisible);
                    setHasNewNotification(false); 
                }}
            >
                <IoIosNotifications size={30} color="gray" />
                
                {/* Red dot for new notifications */}
                {hasNewNotification && (
                    <span className="absolute top-0 right-0 flex item-center justify-conter h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative -top-1 inline-flex h-2 w-2 font-bold text-sm rounded-full text-red-600">{news.length < 99 ? news.length : +99}</span>
                    </span>
                )}
            </div>

            {/* Notification Popover */}
            {isNotificationVisible && (
                <div 
                    ref={popoverRef}
                    className="absolute right-0 mt-2 w-64 rounded-lg bg-white p-4 shadow-lg"
                >
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    {news.length > 0 ? (
                        <ul className="mt-2 max-h-48 overflow-y-auto">
                            {news.map((item, index) => (
                                <li key={index} className="border-b py-2 text-sm">
                                    <span className="font-bold">{item.title}:</span> {item.content}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm mt-2">No new notifications</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
