import { createContext } from "react";
import { SonnerNotificationProvider, type NotificationAdapter } from "../../shared";

export const NotificationContext = createContext<NotificationAdapter | null>(null);
const notificationProvider = new SonnerNotificationProvider();

export const NotificationProvider = ({ children, container }: { children: React.ReactNode, container: React.ReactNode }) => {
  return (
    <NotificationContext.Provider value={notificationProvider}>
      {container}
      {children}
    </NotificationContext.Provider>
  );
};