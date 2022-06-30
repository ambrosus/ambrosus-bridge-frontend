import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing((state) => !state);
  }

  return [isShowing, toggle];
};

export default useModal;
