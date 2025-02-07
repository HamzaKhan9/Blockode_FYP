import { useEffect } from "react";
import { Banner } from "flowbite-react";
import { MdAnnouncement } from "react-icons/md";
import { getErrorMessage, globalErrorHandler } from "../../utils/errorHandler";

interface Props {
  error: any;
}

const ErrorFallback: React.FC<Props> = ({ error }) => {
  useEffect(() => {
    globalErrorHandler(error);
    //TODO: send error to sentry
  }, []);

  return (
    <Banner>
      <div className="flex w-full justify-center">
        <div className="flex w-max justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
          <div className="mx-auto flex items-center">
            <p className="flex text-sm font-normal text-gray-500 dark:text-gray-400">
              <MdAnnouncement className="mr-4 h-4 w-4 mt-1 text-danger" />
              <span className="[&_p]:inline">
                An unexpected error occurred:{" "}
                <span className="text-danger">{getErrorMessage(error)}</span>
                <br />
                <br />
                Please try{" "}
                <a
                  href="#"
                  className="decoration-600 dark:decoration-500 inline font-medium text-cyan-600 underline decoration-solid underline-offset-2 hover:no-underline dark:text-cyan-500"
                  onClick={() => window.location.reload()}
                >
                  refreshing
                </a>{" "}
                the page.
              </span>
            </p>
          </div>
        </div>
      </div>
    </Banner>
  );
};

export default ErrorFallback;
