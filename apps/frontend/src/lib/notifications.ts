export const showOrderNotification = (
  title: string,
  body: string
) => {
  console.log("Notification triggered", title);

  if (!("Notification" in window)) {
    console.log("Notification API not supported");
    return;
  }

  console.log(
    "Permission:",
    Notification.permission
  );

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
    });
  }
};

export const playOrderSound = () => {
  const audio = new Audio(
    "/sounds/mixkit-bell-notification-933.wav"
  );

  audio.play().catch(() => {});
};