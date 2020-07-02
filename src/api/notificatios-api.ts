import { Notify } from 'quasar';

export const showNotificationInfo = (text: string, caption?: string) => {
  Notify.create({
    caption,
    message: text,
    icon: 'mdi-information',
    position: 'top',
    color: 'accent',
    textColor: 'primary',
    timeout: 10000,
    progress: true,
    closeBtn: true,
  });
};

export const showNotificationError = (text: string, caption?: string) => {
  Notify.create({
    caption,
    message: text,
    icon: 'mdi-information',
    position: 'top',
    timeout: 5000,
    progress: true,
    closeBtn: true,
    type: 'negative',
    textColor: 'black',
  });
};
