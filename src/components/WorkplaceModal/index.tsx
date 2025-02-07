import {
  Avatar,
  Button,
  Label,
  Modal,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useCallback, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import AsyncSelect from "../AsyncSelect";
import { pickFiles } from "../../utils/fileUtils";
import { globalErrorHandler } from "../../utils/errorHandler";
import ProfileService from "../../services/profile";

interface WorkplaceModalProps {
  openModal: any;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setInstitution: React.Dispatch<React.SetStateAction<any>>;
  setWorkplace: React.Dispatch<React.SetStateAction<any>>;
}

function WorkplaceModal({
  openModal,
  setOpenModal,
  setInstitution,
  setWorkplace,
}: WorkplaceModalProps) {
  const { heading, type } = openModal;
  const [logo, setLogo] = useState<File>();
  const [address, setAddress] = useState<any>({});

  const [submitLoading, setSubmitLoading] = useState(false);
  function onCloseModal() {
    setOpenModal(false);
  }

  const handlePictureUpload = useCallback(() => {
    pickFiles({
      accept: "image/*",
      multiple: false,
      maxMBs: 10,
      onChange: (files) => {
        setLogo(files[0]);
      },
    });
  }, []);

  const handleSaveWorkplace = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const addressObj = {
      formatted_address: address?.data?.formatted_address,
      location: address?.data?.geometry?.location,
    };
    console.log(addressObj);
    try {
      setSubmitLoading(true);
      const formData = new FormData(e.target);
      if (logo) {
        formData.append("workplace_logo", logo);
      }
      formData.append("type", type?.toLowerCase());
      formData.append("workplace_address", JSON.stringify(addressObj));
      const res = await ProfileService.save_workplace(formData);
      const returnValues = {
        value: e.target?.workplace_domain?.value,
        label: e.target?.workplace_name?.value,
      };
      if (type === "Workplace") {
        setWorkplace(returnValues);
      } else {
        setInstitution(returnValues);
      }
      setOpenModal(false);
      console.log(res);
    } catch (err) {
      globalErrorHandler(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Modal
        dismissible
        show={openModal}
        size="xl"
        onClose={onCloseModal}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {heading || ""}
            </h3>
            {/* @ts-ignore */}
            <form
              id="innerForm"
              className="flex max-w-md flex-col gap-4 mt-8 m-auto"
              autoComplete="off"
              aria-autocomplete="off"
              onSubmit={handleSaveWorkplace}
            >
              <div className="relative m-auto">
                <Avatar
                  placeholderInitials={"LOGO"}
                  img={logo ? URL.createObjectURL(logo) : ""}
                  alt={"avatar"}
                  size="lg"
                  rounded
                />

                <button
                  type="button"
                  onClick={handlePictureUpload}
                  className="absolute bottom-0 -right-1 flex justify-center items-center h-7 w-7 rounded-full bg-black bg-primaryDark bg-opacity-50 hover:bg-opacity-75"
                >
                  <MdModeEditOutline />
                </button>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="workplace_name" value={`${type} Name`} />
                </div>
                <TextInput name="workplace_name" id="workplace_name" required />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="workplace_address"
                    value={`${type} Address`}
                  />
                </div>
                <AsyncSelect
                  name="workplace_address"
                  placeholder="Start typing to search for the address"
                  loadOptions={async (val) => {
                    const responses = await ProfileService.fetch_places({
                      query: val,
                    });
                    return (responses || []).map((r: any) => ({
                      value: r.formatted_address,
                      label: r.formatted_address,
                      data: r,
                    }));
                  }}
                  value={address}
                  onChange={(val) => setAddress(val)}
                  showAddNew={false}
                  showIcon={false}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="workplace_description"
                    value={`${type} Description`}
                  />
                </div>
                <Textarea
                  id="workplace_description"
                  name="workplace_description"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="workplace_domain" value={`${type} Website`} />
                </div>
                <TextInput
                  id="workplace_domain"
                  name="workplace_domain"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="workplace_email"
                    value={`${type} Contact Email`}
                  />
                </div>
                <TextInput
                  id="workplace_email"
                  name="workplace_email"
                  required
                />
              </div>

              <div className="w-full flex justify-end">
                <Button
                  form="innerForm"
                  type="submit"
                  className="mt-4 !bg-primaryDark hover:!bg-primary"
                  isProcessing={submitLoading}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default WorkplaceModal;
