import { Button, Modal, Spinner } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { globalErrorHandler } from "../../utils/errorHandler";
import { HiOutlineExclamationCircle } from "react-icons/hi";

let _setData: any = null;

function Loader() {
  return (
    <div className="mr-3">
      <Spinner size="sm" light />
    </div>
  );
}

function handleCb(cb: any) {
  if (typeof cb !== "function") return () => cb;
  return function () {
    const res = cb();
    if (res instanceof Promise) {
      return new Promise((resolve) => {
        res.catch(globalErrorHandler).finally(resolve as any);
      });
    }
    return res;
  };
}

interface Props {
  message: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => any;
  onCancel?: () => any;
  variant?: "danger" | "warning" | "success" | "info";
}

export function AlertPopup(props: Props) {
  if (typeof _setData === "function") {
    _setData(props);
  }
}

function AlertPopupModal() {
  const [data, setData] = useState<Props | null>(null);
  const [okLoading, setOkLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const {
    variant = "info",
    message,
    okText = "Ok",
    cancelText = "Cancel",
    onOk,
    onCancel,
  } = data ?? {};

  useEffect(() => {
    _setData = setData;
  }, []);

  const onClose = useCallback(() => {
    setData(null);
  }, []);

  const _onOk = useCallback(() => {
    const res = handleCb(onOk)();
    if (res instanceof Promise) {
      setOkLoading(true);
      res.finally(() => {
        setOkLoading(false);
        onClose();
      });
    } else onClose();
  }, [onOk]);

  const _onCancel = () => {
    const res = handleCb(onCancel);
    if (res instanceof Promise) {
      setCancelLoading(true);
      res.finally(() => {
        setCancelLoading(false);
        onClose();
      });
    } else onClose();
  };

  return (
    <Modal show={data !== null} size="md" popup onClose={onClose} dismissible>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {message}
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="light" onClick={_onCancel}>
              {cancelLoading ? <Loader /> : null}
              {cancelText}
            </Button>
            <Button
              color={
                variant === "danger"
                  ? "failure"
                  : variant === "info"
                  ? "dark"
                  : variant
              }
              onClick={_onOk}
            >
              {okLoading ? <Loader /> : null}
              {okText}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AlertPopupModal;
