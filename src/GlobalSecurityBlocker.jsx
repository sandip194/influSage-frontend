import { useEffect } from "react";

const GlobalSecurityBlocker = () => {
  useEffect(() => {
    const stopDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Block only drag & drop events
    ["dragstart", "dragover", "drop", "dragenter"].forEach((evt) =>
      window.addEventListener(evt, stopDrag, true)
    );

    return () => {
      ["dragstart", "dragover", "drop", "dragenter"].forEach((evt) =>
        window.removeEventListener(evt, stopDrag, true)
      );
    };
  }, []);

  return null;
};

export default GlobalSecurityBlocker;
