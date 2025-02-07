import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { MdContentCopy, MdTaskAlt } from "react-icons/md";
import { Prism } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  code: string;
  open: boolean;
  onClose?: () => void;
}

function SourceCodeModal({ code, open, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [open, code]);

  return (
    <Modal dismissible show={open} onClose={onClose}>
      <Modal.Header>Generated Javascript Code</Modal.Header>
      <Modal.Body>
        <div className="relative">
          <Prism showLineNumbers language="javascript" style={darcula}>
            {code}
          </Prism>
          <div
            className="absolute right-2 top-2 cursor-pointer text-[20px] text-white"
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                setCopied((copied) => !copied);
              });
            }}
          >
            {copied ? <MdTaskAlt /> : <MdContentCopy />}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SourceCodeModal;
