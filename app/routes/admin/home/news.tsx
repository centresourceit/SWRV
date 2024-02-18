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
import { Fa6SolidMagnifyingGlass, Fa6SolidXmark } from "~/components/icons";

/**
 * Returns an array of link objects that can be used to include stylesheets in an HTML document.
 * @returns {Array} An array of link objects, each containing the "rel" and "href" properties.
 */
export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

/**
 * Loader function that retrieves a neb object by type from an API endpoint.
 * @param {LoaderArgs} props - The loader arguments.
 * @returns {Promise<LoaderResult>} A promise that resolves to a LoaderResult object containing the retrieved neb object.
 */
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const neb = await axios({
    method: "post",
    url: `${BaseUrl}/api/get-neb-bytype`,
    data: {
      type: 2
    }
  });
  return json({ neb: neb.data.data[0] });
};

const NEWSEVENTBLOG = () => {
  const neb = useLoaderData().neb;
  const [items, setItems] = useState<unknown[]>([]);

  const pagination = usePagination(items);

  const init = () => {
    setItems(neb);
  }

  useEffect(() => {
    init();
  }, []);


  const [img, setImale] = useState<File | null>(null);
  let imgref = useRef<HTMLInputElement | null>(null);
  const [imgerror, setImgerror] = useState<string | null>(null);

  const [viewBox, setViewBox] = useState<boolean>(false);
  const [viewDate, setViewData] = useState<any>({});

  const [editBox, setEditBox] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const titleDescRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const shortDescRef = useRef<HTMLTextAreaElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const [editDate, setEditData] = useState<any>({
    title: titleRef.current?.value || "",
    titleDesc: titleDescRef.current?.value || "",
    description: descriptionRef.current?.value || "",
    shortDesc: shortDescRef.current?.value || "",
    imageUrl: imageUrlRef.current?.value || "",
    type: typeRef.current?.value || "",
    dateTime: dateRef.current?.value || "",
  });

  const [error, setError] = useState<string>("");

  /**
   * Edit a specific item by its ID.
   * @param {number} id - The ID of the item to edit.
   * @returns None
   */
  const edit = async (id: number) => {
    const view = await axios({
      method: "post",
      url: `${BaseUrl}/api/get-neb-byid`,
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
      url: `${BaseUrl}/api/get-neb-byid`,
      data: { id: id },
    });
    setDelBox((val) => true);
    setDelData((val: any) => view.data.data[0]);
  };

  /**
   * Deletes a record with the given ID from the server using an HTTP POST request.
   * Displays a success message if the deletion is successful, or an error message if it fails.
   * Reloads the page after the deletion.
   * @param {number} id - The ID of the record to delete.
   * @returns None
   */
  const delButton = async (id: number) => {
    const res = await axios({
      method: "post",
      url: `${BaseUrl}/api/del-neb`,
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
   * Fetches a specific view by its ID from the server and updates the state with the retrieved data.
   * @param {number} id - The ID of the view to fetch.
   * @returns None
   */
  const view = async (id: number) => {
    const view = await axios({
      method: "post",
      url: `${BaseUrl}/api/get-neb-byid`,
      data: { id: id },
    });
    setViewBox((val) => true);
    setViewData((val: any) => view.data.data[0]);
  };

  /**
   * Submits the form data to update a record with the given ID.
   * @param {number} id - The ID of the record to update.
   * @returns None
   */
  const submit = async (id: number) => {
    if (
      titleRef.current?.value == null ||
      titleRef.current?.value == undefined ||
      titleRef.current?.value == ""
    ) {
      setError("Enter the title.");
    } else if (
      titleDescRef.current?.value == null ||
      titleDescRef.current?.value == undefined ||
      titleDescRef.current?.value == ""
    ) {
      setError("Enter the title description.");
    } else if (
      shortDescRef.current?.value == null ||
      shortDescRef.current?.value == undefined ||
      shortDescRef.current?.value == ""
    ) {
      setError("Enter the short description.");
    } else if (
      descriptionRef.current?.value == null ||
      descriptionRef.current?.value == undefined ||
      descriptionRef.current?.value == ""
    ) {
      setError("Enter the description.");
    } else if (
      typeRef.current?.value == null ||
      typeRef.current?.value == undefined ||
      typeRef.current?.value == ""
    ) {
      setError("Enter the type.");
    } else if (
      dateRef.current?.value == null ||
      dateRef.current?.value == undefined ||
      dateRef.current?.value == ""
    ) {
      setError("Enter the date.");
    } else {
      let sendata: any = {
        title: titleRef.current?.value,
        titleDesc: titleDescRef.current?.value,
        shortDesc: shortDescRef.current?.value,
        dateTime: dateRef.current?.value,
        description: descriptionRef.current?.value,
        type: typeRef.current?.value,
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
        url: `${BaseUrl}/api/upd-neb`,
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
  const titleNewRef = useRef<HTMLInputElement>(null);
  const titleDescNewRef = useRef<HTMLTextAreaElement>(null);
  const descriptionNewRef = useRef<HTMLTextAreaElement>(null);
  const shortDescNewRef = useRef<HTMLTextAreaElement>(null);
  const typeNewRef = useRef<HTMLSelectElement>(null);
  const dateNewRef = useRef<HTMLInputElement>(null);

  /**
   * Submits a new entry to the server.
   * Validates the input fields and displays an error message if any field is empty.
   * If all fields are filled, it uploads the image file, constructs the data object,
   * and sends a POST request to the server to add the new entry.
   * If the request is successful, it displays a success message and reloads the page.
   * If there is an error during the image upload or the server request, it displays an error message.
   * @returns None
   */
  const submitNew = async () => {
    if (
      titleNewRef.current?.value == null ||
      titleNewRef.current?.value == undefined ||
      titleNewRef.current?.value == ""
    ) {
      setError("Enter the title.");
    } else if (
      titleDescNewRef.current?.value == null ||
      titleDescNewRef.current?.value == undefined ||
      titleDescNewRef.current?.value == ""
    ) {
      setError("Enter the title description.");
    } else if (
      shortDescNewRef.current?.value == null ||
      shortDescNewRef.current?.value == undefined ||
      shortDescNewRef.current?.value == ""
    ) {
      setError("Enter the short description.");
    } else if (
      descriptionNewRef.current?.value == null ||
      descriptionNewRef.current?.value == undefined ||
      descriptionNewRef.current?.value == ""
    ) {
      setError("Enter the description.");
    } else if (
      typeNewRef.current?.value == null ||
      typeNewRef.current?.value == undefined ||
      typeNewRef.current?.value == ""
    ) {
      setError("Enter the type.");
    } else if (
      dateNewRef.current?.value == null ||
      dateNewRef.current?.value == undefined ||
      dateNewRef.current?.value == ""
    ) {
      setError("Enter the date.");
    } else if (img == null || img == undefined) {
      setError("Select the image..");
    } else {
      const imageurl = await UploadFile(img);
      if (imageurl.status) {
        let sendata: any = {
          title: titleNewRef.current?.value,
          titleDesc: titleDescNewRef.current?.value,
          shortDesc: shortDescNewRef.current?.value,
          dateTime: dateNewRef.current?.value,
          description: descriptionNewRef.current?.value,
          type: typeNewRef.current?.value,
          imageUrl: imageurl.data,
        };

        const res = await axios({
          method: "post",
          url: `${BaseUrl}/api/add-neb`,
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




  // search section start from here

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>();
  const [isSearching, setIsSearching] = useState<boolean>(false);


  /**
   * Performs a search operation by sending a POST request to the specified API endpoint.
   * @returns None
   * @throws {Error} If the search keyword is not provided or is empty.
   * @throws {Error} If the API request fails or returns an error status.
   */
  const search = async () => {
    setIsSearching((val) => true);
    if (searchRef.current?.value == null || searchRef.current?.value == undefined || searchRef.current?.value == "") {
      setIsSearching((val) => false);
      return toast.error("Enter search keyword", { theme: "light" });
    }

    const data = await axios.post(`${BaseUrl}/api/search-neb`, { search: searchRef.current?.value, type: 2 });


    if (!data.data.status) {
      setIsSearching((val) => false);
      return toast.error(data.data.message, { theme: "light" });
    } else {
      setIsSearching((val) => true);
      setIsSearch((val) => true);
      setItems(data.data.data[0]);
    }
    setIsSearching((val) => false);
  }

  /**
   * Clears the search by setting the value of isSearch to false and calling the init function.
   * @returns None
   */
  const clearsearch = () => {
    setIsSearch((val) => false);
    init();
  }


  // search section end here
  return (
    <>
      {/* view box */}
      <div
        className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center overflow-y-scroll py-20 ${viewBox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-[#31353f] rounded-lg p-4 w-96 ">
          <div className="mx-auto">
            <div className="w-full grid place-items-center mb-4">
              <img
                src={viewDate.imageUrl}
                alt="avatar"
                className="w-56 h-56 object-cover object-center rounded-md"
              />
            </div>
            <div className="text-white grid place-items-center">
              <p>{viewDate.title} </p>
              <p>
                {new Date(viewDate.dateTime).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>{viewDate.titleDesc}</p>
              <div className="w-full h-[1px] bg-gray-300 my-2"></div>
              <p>{viewDate.shortDesc}</p>
              <div className="w-full h-[1px] bg-gray-300 my-2"></div>
              <p>{viewDate.description}</p>
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
              <p>Are you Sure you want to delete {delDate.title}?</p>
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
        className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center overflow-y-scroll py-20 ${editBox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-[#31353f] rounded-lg p-4 w-[48rem]">
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
              <p className="text-white text-sm font-semibold text-left">
                Title
              </p>
              <input
                ref={titleRef}
                type={"text"}
                name="name"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the name.."
                autoComplete="off"
                value={editDate.title}
                onChange={(e) =>
                  setEditData((data: any) => ({
                    ...data,
                    title: e.target.value,
                  }))
                }
              />
              <p className="text-white text-sm font-semibold text-left">
                Title Description
              </p>
              <textarea
                ref={titleDescRef}
                className="h-44 py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the title description.."
                autoComplete="off"
                value={editDate.titleDesc}
                onChange={(e) =>
                  setEditData((data: any) => ({
                    ...data,
                    titleDesc: e.target.value,
                  }))
                }
              ></textarea>
              <p className="text-white text-sm font-semibold text-left">
                Short Description
              </p>
              <textarea
                ref={shortDescRef}
                className="h-44 py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the short description.."
                autoComplete="off"
                value={editDate.shortDesc}
                onChange={(e) =>
                  setEditData((data: any) => ({
                    ...data,
                    shortDesc: e.target.value,
                  }))
                }
              ></textarea>

              <p className="text-white text-sm font-semibold text-left">
                Description
              </p>
              <textarea
                ref={descriptionRef}
                className="h-44 py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
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
              <p className="text-white text-sm font-semibold text-left">Date</p>
              <input
                ref={dateRef}
                type={"date"}
                name="dob
                            "
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the date.."
                autoComplete="off"
                value={editDate.dateTime.substring(0, 10)}
                onChange={(e) =>
                  setEditData((data: any) => ({
                    ...data,
                    dateTime: e.target.value,
                  }))
                }
              />
              <p className="text-white text-sm font-semibold text-left">Type</p>
              <select
                ref={typeRef}
                name="type"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none cursor-pointer"
              >
                <option
                  selected={editDate.type == 1 ? true : false}
                  value="1"
                  className="bg-[#31353f] cursor-pointer"
                >
                  BLOG
                </option>
                <option
                  selected={editDate.type == 2 ? true : false}
                  value="2"
                  className="bg-[#31353f] cursor-pointer"
                >
                  NEWS
                </option>
                <option
                  selected={editDate.type == 3 ? true : false}
                  value="3"
                  className="bg-[#31353f] cursor-pointer"
                >
                  EVENT
                </option>
              </select>
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
        className={`fixed h-full w-full bg-slate-800 bg-opacity-40 top-0 left-0 place-items-center py-20 overflow-x-scroll ${newBox ? "grid" : "hidden"
          }`}
      >
        <div className="bg-[#31353f] rounded-lg p-4 w-[48rem]">
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
              <p className="text-white text-sm font-semibold text-left">
                Title
              </p>
              <input
                ref={titleNewRef}
                type={"text"}
                name="name"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the name.."
                autoComplete="off"
              />
              <p className="text-white text-sm font-semibold text-left">
                Title Description
              </p>
              <textarea
                ref={titleDescNewRef}
                className="h-44 py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the title description.."
                autoComplete="off"
              ></textarea>
              <p className="text-white text-sm font-semibold text-left">
                Short Description
              </p>
              <textarea
                ref={shortDescNewRef}
                className="h-44 py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the short description.."
                autoComplete="off"
              ></textarea>

              <p className="text-white text-sm font-semibold text-left">
                Description
              </p>
              <textarea
                ref={descriptionNewRef}
                className="h-44 py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the description.."
                autoComplete="off"
              ></textarea>
              <p className="text-white text-sm font-semibold text-left">Date</p>
              <input
                ref={dateNewRef}
                type={"date"}
                name="dob
                            "
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none"
                placeholder="Enter the date.."
                autoComplete="off"
              />
              <p className="text-white text-sm font-semibold text-left">Type</p>
              <select
                ref={typeNewRef}
                name="type"
                className="py-1 px-2 rounded-md border border-white w-full my-2 bg-transparent outline-none focus:bg-transparent fill-none cursor-pointer"
              >
                <option
                  selected={editDate.type == 1 ? true : false}
                  value="1"
                  className="bg-[#31353f] cursor-pointer"
                >
                  BLOG
                </option>
                <option
                  selected={editDate.type == 2 ? true : false}
                  value="2"
                  className="bg-[#31353f] cursor-pointer"
                >
                  NEWS
                </option>
                <option
                  selected={editDate.type == 3 ? true : false}
                  value="3"
                  className="bg-[#31353f] cursor-pointer"
                >
                  EVENT
                </option>
              </select>
            </div>
            {error == "" || error == null || error == undefined ? null : (
              <div className="bg-red-500 bg-opacity-10 border-2 text-center border-red-500 rounded-md text-red-500 text-md font-normal text-md my-4">
                {error}
              </div>
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
          <div className="flex items-center gap-2 w-full">
            <h1 className="text-white font-medium text-xl">NEWS</h1>
            <div className="grow"></div>
            {
              isSearch ?
                <>
                  <div
                    className="grid place-items-center rounded-md bg-indigo-500 shadow-md h-full p-2 text-white">
                    Found : {items.length} result
                  </div>
                  <button
                    onClick={clearsearch}
                    className="rounded-md bg-rose-500 shadow-md h-full p-2 text-white flex gap-2 items-center">
                    <Fa6SolidXmark></Fa6SolidXmark> Clear
                  </button>
                </>
                :
                isSearching ?
                  <div
                    className="r rounded-md bg-indigo-500 shadow-md h-full p-2 text-white flex gap-2 items-center">
                    <Fa6SolidMagnifyingGlass></Fa6SolidMagnifyingGlass> Searching for text {searchRef.current?.value}
                  </div> :
                  <>
                    <div className="grid place-items-center">
                      <input ref={searchRef} type="text" className="bg-[#eeeeee] rounded-md outline-none focus:outline-none py-1 px-4" placeholder="Enter Search Text.." />
                    </div>
                    <button
                      onClick={search}
                      className="grid place-items-center rounded-md bg-indigo-500 shadow-md h-full p-2 text-white">
                      <Fa6SolidMagnifyingGlass></Fa6SolidMagnifyingGlass>
                    </button>
                  </>
            }
          </div>
          <div className="w-4"></div>
          <button
            onClick={() => setNewBox(true)}
            className="shrink-0 bg-green-600 py-1 px-2 text-sm text-white rounded-md"
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
            <div className="w-24">Type</div>
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
                <div className="w-32">{val.title}</div>
                <div className="grow"></div>
                <div className="w-24">
                  {val.type == 1 ? (
                    <div className="w-14 py-1 text-white text-xs bg-red-500 text-center rounded-md font-medium">
                      BLOG
                    </div>
                  ) : val.type == 2 ? (
                    <div className="w-14 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium">
                      NEWS
                    </div>
                  ) : (
                    <div className="w-14 py-1 text-white text-xs bg-blue-500 text-center rounded-md font-medium">
                      EVENT
                    </div>
                  )}
                </div>
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

export default NEWSEVENTBLOG;
