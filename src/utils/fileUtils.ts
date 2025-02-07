import { toast } from "react-toastify";

let cachedIpElem: null | HTMLElement = null;

export function pickFiles({
  accept,
  multiple = true,
  maxMBs = 10,
  onChange,
}: {
  accept?: string;
  multiple?: boolean;
  maxMBs?: number;
  onChange?: (files: File[]) => void;
}) {
  if (!cachedIpElem)
    cachedIpElem = document.getElementById("c-global-file-input");
  if (!cachedIpElem) return;

  if (accept) cachedIpElem.setAttribute("accept", accept);
  if (multiple !== undefined)
    cachedIpElem.setAttribute("multiple", multiple.toString());

  if (typeof onChange === "function") {
    cachedIpElem.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;

      const files: File[] = [];
      for (const file of target.files) {
        if (maxMBs && !isNaN(maxMBs) && file.size / 1024 / 1024 > maxMBs) {
          toast.error(`File size exceeds ${maxMBs}MBs`);
          continue;
        }
        files.push(file);
      }

      if (files.length) onChange(files);

      // reset the value to have onchane trigger even if same file selected in succession
      target.value = "";
    };
  }

  cachedIpElem.click();
}
