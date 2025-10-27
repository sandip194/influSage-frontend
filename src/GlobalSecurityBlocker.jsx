import { useEffect } from "react";

const GlobalSecurityBlocker = () => {
  useEffect(() => {
    const stopDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const stopContextMenu = (e) => {
      const tag = e.target.tagName;
      if (tag === "IMG") {
        e.preventDefault();
      }
    };

    const stopClickOpen = (e) => {
      const tag = e.target.tagName;
      if (tag === "A" || tag === "IMG") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    ["dragstart", "dragover", "drop", "dragenter"].forEach((evt) =>
      window.addEventListener(evt, stopDrag, true)
    );

    document.addEventListener("contextmenu", stopContextMenu, true);

    document.addEventListener("click", stopClickOpen, true);

    return () => {  
      ["dragstart", "dragover", "drop", "dragenter"].forEach((evt) =>
        window.removeEventListener(evt, stopDrag, true)
      );
      document.removeEventListener("contextmenu", stopContextMenu, true);
      document.removeEventListener("click", stopClickOpen, true);
    };
  }, []);

  return null;
};

export default GlobalSecurityBlocker;
