const loginEventName = 'LOGIN_EVENT';

export const emitLoggedStatusChanged = () => {
  const loginEvent = new CustomEvent(loginEventName);
  window.dispatchEvent(loginEvent);
};

export const onLoggedStatusChangedEvent = (onLoginEventFunc: any) => {
  window.addEventListener(loginEventName, onLoginEventFunc);
};
