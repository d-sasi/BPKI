import { toast } from "react-toastify";

export const notify = (text, type) => {
  
  const s = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  if (type === "success") {
    toast.success(text, {s});
  } 
  else if (type === "warning") {
    toast.warn(text, {s});
  } 
  else {
    toast.error(text, {s});
  }
};
