import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    // TODO callback
    setIsShowing(!isShowing);
  }

  return [isShowing, toggle];
};

export default useModal;
