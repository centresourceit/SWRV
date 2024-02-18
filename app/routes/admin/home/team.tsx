import {
  faEdit,
  faEye,
  faFill,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BaseUrl } from "~/const";
import { ToastContainer, toast } from "react-toastify";

import styles from "react-toastify/dist/ReactToastify.css";
import { UploadFile } from "~/utils";
import { NOTICEAlerts } from "~/components/utils/alert";
import { usePagination } from "~/hooks/usepagination";
import Pagination from "~/components/pagination";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

/**
 * Loader function that retrieves team data from the server.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<LoaderResult>} A promise that resolves to the team data.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const team = await axios({
    method: "post",
    url: `${BaseUrl}/api/get-team`,
  });
  return json({ team: team.data.data[0] });
};

const Team = () => {
  const team = useLoaderData().team;
  const pagination = usePagination(team);

  const [img, setImale] = useState<File | null>(null);
  let imgref = useRef<HTMLInputElement | null>(null);
  const [imgerror, setImgerror] = useState<string | null>(null);

  const [viewBox, setViewBox] = useState<boolean>(false);
  const [viewDate, setViewData] = useState<any>({});

  const [editBox, setEditBox] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const positonRef = useRef<HTMLInputElement>(null);

  const [editDate, setEditData] = useState<any>({
    name: nameRef.current?.value || "",
    description: descriptionRef.current?.value || "",
    dob: dobRef.current?.value || "",
    imageUrl: imageUrlRef.current?.value || "",
    number: numberRef.current?.value || "",
    positon: positonRef.current?.value || "",
  });

  const [error, setError] = useState<string>("");

  /**
   * Edit a team by making a POST request to the server with the team ID.
   * @param {number} id - The ID of the team to edit.
   * @returns None
   */
  const edit = async (id: number) => {
    const view = await axios({
      method: "post",
      url: `${BaseUrl}/api/get-team-byid`,
      data: { id: id },
    });
    setEditBox((val) => true);
    setEditData((val: any) => view.data.data[0]);
  };

  /**
   * Deletes a record with the specified ID.
   * @param {number} id - The ID of the record to delete.
   * @returns None
   */
  const [delBox, setDelBox] = useState<boolean>(false);
  const [delDate, setDelData] = useState<any>({});
  const del = async (id: number) => {
    const view = await axios({
      method: "post",
      url: `${BaseUrl}/api/get-team-byid`,
      data: { id: id },
    });
    setDelBox((val) => true);
    setDelData((val: any) => view.data.data[0]);
  };

  /**
   * Deletes a team with the given ID from the server.
   * @param {number} id - The ID of the team to delete.
   * @returns None
   */
  const delButton = async (id: number) => {
    const res = await axios({
      method: "post",
      url: `${BaseUrl}/api/del-team`,
      data: { id: id },
    });
    if (res.data.status) {
      toast.success("Successfully Deleted.", { theme: "dark" });
    } else {
      toast.error(res.data.message, { theme: "dark" });
    }
    setDelBox((val) => false);
    window.location.reload();
  };
  /**
   * Fetches team data by ID from the server and updates the view state.
   * @param {number} id - The ID of the team to fetch.
   * @returns None
   */
  const view = async (id: number) => {
    const view = await axios({
      method: "post",
      url: `${BaseUrl}/api/get-team-byid`,
      data: { id: id },
    });
    setViewBox((val) => true);
    setViewData((val: any) => view.data.data[0]);
  };

  /**
   * Submits the form data to update a team member.
   * @param {number} id - The ID of the team member to update.
   * @returns None
   */
  const submit = async (id: number) => {
    if (
      nameRef.current?.value == null ||
      nameRef.current?.value == undefined ||
      nameRef.current?.value == ""
    ) {
      setError("Enter the name.");
    } else if (
      dobRef.current?.value == null ||
      dobRef.current?.value == undefined ||
      dobRef.current?.value == ""
    ) {
      setError("Enter the date.");
    } else if (
      numberRef.current?.value == null ||
      numberRef.current?.value == undefined ||
      numberRef.current?.value == ""
    ) {
      setError("Enter the number.");
    } else if (
      positonRef.current?.value == null ||
      positonRef.current?.value == undefined ||
      positonRef.current?.value == ""
    ) {
      setError("Enter the position.");
    } else if (
      descriptionRef.current?.value == null ||
      descriptionRef.current?.value == undefined ||
      descriptionRef.current?.value == ""
    ) {
      setError("Enter the description.");
    } else {
      let sendata: any = {
        name: nameRef.current?.value,
        number: numberRef.current?.value,
        positon: positonRef.current?.value,
        dob: dobRef.current?.value,
        description: descriptionRef.current?.value,
        id: id,
      };
      if (img == null) {
        sendata["imageUrl"] = editDate.imageUrl;
      } else {
        const imageurl = await UploadFile(img);
        if (imageurl.status) {
          sendata["imageUrl"] = imageurl.data;
        } else {
          return setError(imageurl.data);
        }
      }

      const res = await axios({
        method: "post",
        url: `${BaseUrl}/api/upd-team`,
        data: sendata,
      });
      if (res.data.status) {
        toast.success("Successfully Updated.", { theme: "dark" });
      } else {
        toast.error(res.data.message, { theme: "dark" });
      }
      setEditBox((val) => false);
      window.location.reload();
    }
  };

  const [newBox, setNewBox] = useState<boolean>(false);
  const nameNewRef = useRef<HTMLInputElement>(null);
  const numberNewRef = useRef<HTMLInputElement>(null);
  const descriptionNewRef = useRef<HTMLTextAreaElement>(null);
  const dobNewRef = useRef<HTMLInputElement>(null);
  const positonNewRef = useRef<HTMLInputElement>(null);

  /**
   * Submits a new entry to the server.
   * Validates the input fields and displays an error message if any field is empty or invalid.
   * If all fields are valid, it uploads the image file, constructs the data object, and sends a POST request to the server.
   * If the request is successful, it displays a success message and reloads the page.
   * @returns None
   */
  const submitNew = async () => {
    if (
      nameNewRef.current?.value == null ||
      nameNewRef.current?.value == undefined ||
      nameNewRef.current?.value == ""
    ) {
      setError("Enter the name.");
    } else if (
      dobNewRef.current?.value == null ||
      dobNewRef.current?.value == undefined ||
      dobNewRef.current?.value == ""
    ) {
      setError("Enter the date.");
    } else if (
      numberNewRef.current?.value == null ||
      numberNewRef.current?.value == undefined ||
      numberNewRef.current?.value == ""
    ) {
      setError("Enter the number.");
    } else if (
      positonNewRef.current?.value == null ||
      positonNewRef.current?.value == undefined ||
      positonNewRef.current?.value == ""
    ) {
      setError("Enter the positon.");
    } else if (
      descriptionNewRef.current?.value == null ||
      descriptionNewRef.current?.value == undefined ||
      descriptionNewRef.current?.value == ""
    ) {
      setError("Enter the description.");
    } else if (img == null || img == undefined) {
      setError("Select the image..");
    } else {
      const imageurl = await UploadFile(img);
      if (imageurl.status) {
        let sendata: any = {
          name: nameNewRef.current?.value,
          number: numberNewRef.current?.value,
          positon: positonNewRef.current?.value,
          dob: dobNewRef.current?.value,
          description: descriptionNewRef.current?.value,
          imageUrl: imageurl.data,
        };
        const res = await axios({
          method: "post",
          url: `${BaseUrl}/api/add-team`,
          data: sendata,
        });
        if (res.data.status) {
          toast.success("Successfully added.", { theme: "dark" });
        } else {
          toast.error(res.data.message, { theme: "dark" });
        }
        setNewBox((val) => false);
        window.location.reload();
      } else {
        setError(imageurl.data);
      }
    }
  };

  /**
   * Renders a component that displays a team roster with options to add, edit, and delete team members.
   * @returns JSX elements representing the team roster component.
   */
  return (
    <>
      {/* view box */}
      <div
        className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${viewBox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-[#31353f] rounded-lg p-4">
          <div className="mx-auto">
            <div className="w-full grid place-items-center mb-4">
              <img
                src={viewDate.imageUrl}
                alt="avatar"
                className="w-56 h-56 object-cover object-center rounded-md"
              />
            </div>
            <div className="text-white grid place-items-center">
              <p>{viewDate.name} </p>
              <p>{viewDate.positon}</p>
              <p>{viewDate.number}</p>
              <p>{viewDate.description}</p>
              <p>
                {new Date(viewDate.dob).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>
            <div className="grid place-items-center">
              <div
                onClick={() => setViewBox(false)}
                className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="w-6"
                ></FontAwesomeIcon>
                <p>CLOSE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* del box */}
      <div
        className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${delBox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-[#31353f] rounded-lg p-4">
          <div className="mx-auto">
            <div className="text-white">
              <p>Are you Sure you want to delete {delDate.name}?</p>
            </div>
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>
            <div className="flex w-full justify-between">
              <div
                onClick={() => setDelBox(false)}
                className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300 hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="w-6"
                ></FontAwesomeIcon>
                <p>CLOSE</p>
              </div>
              <div
                onClick={() => delButton(delDate.id)}
                className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300hover:border hover:border-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-green-500 text-gray-300 cursor-pointer`}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="w-6"
                ></FontAwesomeIcon>
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* edit box */}
      <div
        className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${editBox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-[#31353f] rounded-lg p-4 w-80">
          <div className="mx-auto">
            <div className="w-full grid place-items-center mb-4">
              <img
                src={img == null ? editDate.imageUrl : URL.createObjectURL(img)}
                alt="avatar"
                className="w-40 h-40 object-cover object-center rounded-md"
              />
            </div>
            <div className="hidden">
              <input
                type="file"
                accept="image/*"
                ref={imgref}
                onChange={(value) => {
                  let file_size = parseInt(
                    (value!.target.files![0].size / 1024 / 1024).toString()
                  );
                  if (file_size < 4) {
                    setImgerror(null);
                    setImale(value!.target.files![0]);
                  } else {
                    setImgerror("Image file size must be less then 4 mb");
                  }
                }}
              />
            </div>
            <div className="text-white">
              {imgerror == "" ||
                imgerror == null ||
                imgerror == undefined ? null : (
                <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
                  {imgerror}
                </div>
              )}
              <div className="grid place-items-center">
                <button
                  onClick={() => {
                    imgref.current?.click();
                  }}
                  className="text-white bg-green-600 rounded-md py-1 px-2 mx-auto text-sm"
                >
                  UPLOAD IMAGE
                </button>
              </div>
              <input
                ref={nameRef}
                type={"text"}
                name="name"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the name.."
                autoComplete="off"
                value={editDate.name}
                onChange={(e) =>
                  setEditData((data: any) => ({
                    ...data,
                    name: e.target.value,
                  }))
                }
              />
              <input
                ref={numberRef}
                type={"number"}
                name="number"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the number.."
                autoComplete="off"
                value={editDate.number}
                onChange={(e) =>
                  setEditData((data: any) => ({
                    ...data,
                    number: e.target.value,
                  }))
                }
              />
              <input
                ref={positonRef}
                type={"text"}
                name="positon"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the position.."
                autoComplete="off"
                value={editDate.positon}
                onChange={(e) =>
                  setEditData((data: any) => ({
                    ...data,
                    positon: e.target.value,
                  }))
                }
              />
              <input
                ref={dobRef}
                type={"date"}
                name="dob"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the dob.."
                autoComplete="off"
                value={editDate.dob.substring(0, 10)}
                onChange={(e) =>
                  setEditData((data: any) => ({ ...data, dob: e.target.value }))
                }
              />
              <textarea
                ref={descriptionRef}
                name="description"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the description.."
                autoComplete="off"
                value={editDate.description}
                onChange={(e) =>
                  setEditData((data: any) => ({
                    ...data,
                    description: e.target.value,
                  }))
                }
              ></textarea>
            </div>
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>
            <div className="flex w-full justify-between">
              <div
                onClick={() => setEditBox(false)}
                className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300 hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="w-6"
                ></FontAwesomeIcon>
                <p>CLOSE</p>
              </div>
              <div
                onClick={() => submit(editDate.id)}
                className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300hover:border hover:border-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-green-500 text-gray-300 cursor-pointer`}
              >
                <FontAwesomeIcon
                  icon={faFill}
                  className="w-6"
                ></FontAwesomeIcon>
                <p>SUBMIT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* add box */}
      <div
        className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center ${newBox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-[#31353f] rounded-lg p-4 w-80">
          <div className="mx-auto">
            <div
              className={`${img == null ? "hidden" : ""
                } w-full grid place-items-center mb-4`}
            >
              <img
                src={
                  img == null
                    ? "/images/avatar/user.png"
                    : URL.createObjectURL(img)
                }
                alt="avatar"
                className="w-40 h-40 object-cover object-center rounded-md"
              />
            </div>
            <div className="hidden">
              <input
                type="file"
                accept="image/*"
                ref={imgref}
                onChange={(value) => {
                  let file_size = parseInt(
                    (value!.target.files![0].size / 1024 / 1024).toString()
                  );
                  if (file_size < 4) {
                    setImgerror(null);
                    setImale(value!.target.files![0]);
                  } else {
                    setImgerror("Image file size must be less then 4 mb");
                  }
                }}
              />
            </div>
            <div className="text-white">
              {imgerror == "" ||
                imgerror == null ||
                imgerror == undefined ? null : (
                <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
                  {imgerror}
                </div>
              )}
              <div className="grid place-items-center">
                <button
                  onClick={() => {
                    imgref.current?.click();
                  }}
                  className="text-white bg-green-600 rounded-md py-1 px-2 mx-auto text-sm"
                >
                  UPLOAD IMAGE
                </button>
              </div>
              <input
                ref={nameNewRef}
                type={"text"}
                name="name"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the name.."
                autoComplete="off"
              />
              <input
                ref={numberNewRef}
                type={"number"}
                name="number"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the number.."
                autoComplete="off"
              />
              <input
                ref={positonNewRef}
                type={"text"}
                name="positon"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the position.."
                autoComplete="off"
              />
              <input
                ref={dobNewRef}
                type={"date"}
                name="dob"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the dob.."
                autoComplete="off"
              />
              <textarea
                ref={descriptionNewRef}
                name="description"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the description.."
                autoComplete="off"
              ></textarea>
            </div>
            {error == "" || error == null || error == undefined ? null : (
              <NOTICEAlerts message={error}></NOTICEAlerts>
            )}
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>
            <div className="flex w-full justify-between">
              <div
                onClick={() => setNewBox(false)}
                className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300 hover:border hover:border-rose-400 hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="w-6"
                ></FontAwesomeIcon>
                <p>CLOSE</p>
              </div>
              <div
                onClick={submitNew}
                className={`text-sm flex gap-2 items-center my-1 b  py-1 px-2 rounded-md border border-gray-300hover:border hover:border-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-green-500 text-gray-300 cursor-pointer`}
              >
                <FontAwesomeIcon
                  icon={faFill}
                  className="w-6"
                ></FontAwesomeIcon>
                <p>SUBMIT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grow bg-[#1b2028] my-2 rounded-md p-4 w-full">
        <div className="flex">
          <h1 className="text-white font-medium text-xl">Team</h1>
          <div className="grow"></div>
          <button
            onClick={() => setNewBox(true)}
            className="bg-green-600 py-1 px-2 text-sm text-white rounded-md"
          >
            ADD NEW
          </button>
        </div>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="overflow-x-hidden no-scrollbar">
          <div className="bg-[#31353f]  rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap">
            <div className="w-14">Id</div>
            <div className="grow"></div>
            <div className="w-32">Name</div>
            <div className="grow"></div>
            <div className="w-24">Position</div>
            <div className="grow"></div>
            <div className="w-32">Action</div>
          </div>
          {pagination.paginatedItems.map((val: any, index: number) => {
            return (
              <div
                key={index}
                className="bg-[#31353f] hover:bg-slate-800 rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap"
              >
                <div className="w-14">{val.id}</div>
                <div className="grow"></div>
                <div className="w-32">{val.name}</div>
                <div className="grow"></div>
                <div className="w-24">{val.positon}</div>
                <div className="grow"></div>
                <div className="w-32 flex text-bold text-md gap-4">
                  <div
                    className="text-cyan-500 cursor-pointer"
                    onClick={() => edit(val.id)}
                  >
                    <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                  </div>
                  <div className="text-emerald-500 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faEye}
                      onClick={() => view(val.id)}
                    ></FontAwesomeIcon>
                  </div>
                  <div className="text-rose-500 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => del(val.id)}
                    ></FontAwesomeIcon>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Pagination
          ChangePerPage={pagination.ChangePerPage}
          activePage={pagination.activePage}
          changeActivePage={pagination.changeActivePage}
          firstPage={pagination.firstPage}
          getMaxPage={pagination.getMaxPage}
          getTotalItemsLength={pagination.getTotalItemsLength}
          goToPage={pagination.goToPage}
          itemPerPage={pagination.itemPerPage}
          lastPage={pagination.lastPage}
          nextPage={pagination.nextPage}
          paginatedItems={pagination.paginatedItems}
          prevPage={pagination.prevPage}
          totalPages={pagination.totalPages}
        ></Pagination>
        <ToastContainer></ToastContainer>
      </div>
    </>
  );
};

export default Team;
