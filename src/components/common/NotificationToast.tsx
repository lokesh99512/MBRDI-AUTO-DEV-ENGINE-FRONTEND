import { Toast, ToastContainer } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeNotification } from '@/features/notifications/notificationSlice';
import { useEffect } from 'react';

const NotificationToast = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.autoHide) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  const getVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
      default:
        return 'bi-info-circle-fill';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          bg={getVariant(notification.type)}
          onClose={() => dispatch(removeNotification(notification.id))}
          className="text-white"
        >
          <Toast.Header closeVariant="white" className={`bg-${getVariant(notification.type)} text-white`}>
            <i className={`bi ${getIcon(notification.type)} me-2`}></i>
            <strong className="me-auto">{notification.title || notification.type.toUpperCase()}</strong>
          </Toast.Header>
          <Toast.Body>{notification.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationToast;
