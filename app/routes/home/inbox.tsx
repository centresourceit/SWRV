import { useEffect, useId, useRef, useState } from "react";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { userPrefs } from "~/cookies";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { BaseUrl } from "~/const";
import SideBarNavStore, { SideBarTabs } from "~/state/navigation/sidebar";
export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({ user: cookie.user });
};

/**
 * Represents the Invite component.
 * @returns JSX element representing the Invite component.
 */
const Invite = () => {
  const userdata = useLoaderData();
  const userId: string = userdata.user.id;

  const [msgIds, setMsgIds] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  type UserType = {
    name: string;
    avatar: string;
    userid: string;
    index: string;
  };
  const navigator = useNavigate();
  const sidebar = SideBarNavStore((state) => state.changeTab);

  const [user, setUser] = useState<UserType>();

  const init = async () => {
    let req = {
      search: { fromToUser: useId },
    };
    const data = await axios.post(`${BaseUrl}/api/search-chat`, req);
    if (data.data.status == true) {
      const reversedData = data.data.data.reverse(); // Reverse the array

      for (let i: number = 0; i < reversedData.length; i++) {
        let fromId: string = reversedData[i].fromUser.id;
        let toId: string = reversedData[i].toUser.id;

        if (fromId == userId) {
          if (!msgIds.includes(toId)) {
            setMsgIds([...msgIds, toId]);
            setMessages([...messages, reversedData[i]]);
          }
        }

        if (toId == userId) {
          if (!msgIds.includes(fromId)) {
            setMsgIds([...msgIds, fromId]);
            setMessages([...messages, reversedData[i]]);
          }
        }
      }
    }
    // if (data.data.status == true) {
    //   for (let i: number = 0; i < data.data.data.length; i++) {
    //     let fromId: string = data.data.data[i].fromUser.id;
    //     let toId: string = data.data.data[i].toUser.id;
    //     if (fromId == userId) {
    //       if (!msgIds.includes(toId)) {
    //         setMsgIds([...msgIds, toId]);
    //         setMessages([...messages, data.data.data[i]]);
    //       }
    //     }
    //     if (toId == userId) {
    //       if (!msgIds.includes(fromId)) {
    //         setMsgIds([...msgIds, fromId]);
    //         setMessages([...messages, data.data.data[i]]);
    //       }
    //     }
    //   }
    // }
  };

  useEffect(() => {
    init();
  });


  return (
    <>
      <div className="my-4">
        {messages.length == 0 ? (
          <div className="w-full bg-white rounded-lg shadow-xl  p-2 overflow-y-scroll no-scrollbar py-10 ">
            <h1 className="text-center text-2xl">No Message</h1>
            <p className="text-center text-md">
              Search user and start message.
            </p>
            <div className="text-center mt-6">
              <button
                className="text-white bg-primary py-1 px-2 text-xl font-semibold rounded-md"
                onClick={() => {
                  sidebar(SideBarTabs.FindCampaigns);
                  navigator("/home/findcampaign");
                }}
              >
                Search
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 flex-col xl:flex-row">
            <div className="w-full flex lg:flex-row flex-col gap-4">
              <div className="w-full bg-white rounded-lg shadow-xl lg:w-80 p-2 max-h-screen overflow-y-scroll no-scrollbar min-h-screen">
                {messages.map((val: any, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (1024 > window.innerWidth) {
                          setTimeout(() => {
                            window.scrollBy(0, window.innerHeight * 1.1)
                          }, 500);
                        }
                        setMsgIds((val) => []);
                        setMessages((val) => []);
                        setUser({
                          name:
                            val.fromUser.id == userId
                              ? val.toUser.name.toString().split("@")[0]
                              : val.fromUser.name.toString().split("@")[0],
                          avatar:
                            val.fromUser.id == userId
                              ? val.toUser.pic
                              : val.fromUser.pic,
                          userid:
                            val.fromUser.id == userId
                              ? val.toUser.id
                              : val.fromUser.id,
                          index: index.toString(),
                        });
                      }}
                    >
                      <UserMessage
                        active={user?.index == index.toString() ? true : false}
                        name={
                          val.fromUser.id == userId
                            ? val.toUser.name.toString().split("@")[0]
                            : val.fromUser.name.toString().split("@")[0]
                        }
                        message={`${val.fromUser.id == userId ? "you: " : ""} ${val.comment}`}
                        url={
                          val.fromUser.id == userId
                            ? val.toUser.pic
                            : val.fromUser.pic
                        }
                      ></UserMessage>
                    </div>
                  );
                })}
              </div>
              {user != undefined ? (
                <ChatBox
                  avatar={user.avatar}
                  id={user.userid}
                  userId={userId}
                  name={user.name}
                  useravatar={userdata.user.pic}
                ></ChatBox>
              ) : null}
            </div>
            {user != undefined ? <UserCard id={user.userid}></UserCard> : null}
          </div>
        )}
      </div>
    </>
  );
};

export default Invite;

/**
 * Represents the properties of a user message component.
 * @typedef {Object} UserMessageProps
 * @property {string} url - The URL of the user.
 * @property {string} name - The name of the user.
 * @property {string} message - The message content.
 * @property {boolean} active - Indicates whether the user message is active or not.
 */
type UserMessageProps = {
  url: string;
  name: string;
  message: string;
  active: boolean;
};

/**
 * A functional component that renders a user message with an avatar, name, and message content.
 * @param {UserMessageProps} props - The props object containing the necessary data for rendering the user message.
 * @returns The JSX element representing the user message.
 */
const UserMessage = (props: UserMessageProps) => {
  const avatar =
    props.url == "" ||
      props.url == "0" ||
      props.url == null ||
      props.url == undefined
      ? "/images/avatar/user.png"
      : props.url;
  return (
    <>
      <div
        className={`flex w-full py-2 my-1 border-b-2 rounded-md cursor-pointer ${props.active ? "bg-gray-200 px-4" : "border-slate-200"
          }`}
      >
        <img
          src={avatar}
          alt="user images"
          className="w-10 h-10 object-cover rounded-lg shrink-0"
        />
        <div className="w-2"></div>
        <div>
          <p className="text-md font-medium  leading-none text-slate-800">
            {props.name}
          </p>
          <p className="text-sm mt-2 font-normal leading-none text-slate-600">
            {props.message}
          </p>
        </div>
      </div>
    </>
  );
};

/**
 * Represents the properties of a message component.
 * @typedef {Object} MessageProps
 * @property {boolean} user - Indicates whether the message is from the user or not.
 * @property {string} message - The content of the message.
 * @property {string} time - The timestamp of the message.
 * @property {string} avatar - The URL of the avatar image for the user.
 */
type MessageProps = {
  user: boolean;
  message: string;
  time: string;
  avatar: string;
};

/**
 * A functional component that renders a message with an avatar, time, and message content.
 * @param {MessageProps} props - The props object containing the necessary data for rendering the message.
 * @returns The JSX element representing the message.
 */
const Message = (props: MessageProps) => {
  return (
    <>
      <div className="w-full flex items-start my-4">
        <div className={`grow ${props.user ? "" : "hidden"}`}></div>
        <img
          src={props.avatar}
          alt="avatar"
          className={`w-10 h-10 rounded-md ${props.user ? "order-3" : ""}`}
        />
        <div className={`w-4 ${props.user ? "order-2" : ""}`}></div>
        <div className="max-w-4/5 bg-gray-200 rounded-md p-2 order-1">
          <p
            className={`text-xs text-gray-700 font-normal ${props.user ? "text-right" : "text-left"
              }`}
          >
            {props.time}
          </p>
          <p
            className={`text-md text-gray-900 font-normal text-left ${props.user ? "text-right" : "text-left"
              }`}
          >
            {props.message}
          </p>
        </div>
      </div>
    </>
  );
};

type UserCardProps = {
  id: string;
};

/**
 * A functional component that renders a user card based on the provided props.
 * @param {UserCardProps} props - The props object containing the necessary data for rendering the user card.
 * @returns The rendered user card component.
 */
const UserCard = (props: UserCardProps) => {
  const [userdata, setUserdata] = useState<any>(null);
  const init = async () => {
    const userdata = await axios({
      method: "post",
      url: `${BaseUrl}/api/getuser`,
      data: { id: props.id },
    });
    if (userdata.data.status == true) {
      setUserdata(userdata.data.data[0]);
    }
  };
  useEffect(() => {
    init();
  }, []);
  const navigator = useNavigate();
  return (
    <>
      {userdata == undefined ? (
        <div className="bg-white rounded-lg shadow-xl shrink-0">
          <h1 className="text-center font-semibold text-rose-500 p-4">
            No user found
          </h1>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl flex w-full xl:w-80 xl:flex-col flex-col sm:flex-row items-start p-4 xl:px-0 xl:pt-0">
          <div className="w-80 h-80 shrink-0 mx-auto">
            <img
              src={userdata.pic}
              alt="error"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <div className="px-4 mt-6 sm:mt-0 grow w-full">
            <p className="text-left font-semibold text-lg text-slate-800">
              {userdata.userName.toString().split("@")[0]}
            </p>
            <p className="text-left font-semibold text-sm text-slate-600 mt-4">
              Bio
            </p>
            <p className="text-left font-normal text-sm text-slate-600 mt-4">
              {userdata.bio}
            </p>

            <button
              onClick={() => {
                navigator(`/home/myuser/${userdata.id}`);
              }}
              className=" mt-2 w-full py-2 text-center text-primary font-semibold text-lg bg-[#01FFF4] rounded-md"
            >
              View profile
            </button>
            <div className="h-[1px] bg-slate-400 my-4 w-full"></div>
            {/* <div className="flex">
                                <p className="text-left font-semibold text-sm text-slate-600 mt-4">Attachments</p>
                                <div className="grow"></div>
                                <button className=" mt-2 py-2 px-4 text-center text-primary font-semibold text-sm bg-[#01FFF4] rounded-md">View Campaign</button>
                            </div>
                            <div className="flex mt-2">
                                <div className="shrink-0"><img src="/images/inf/inf14.png" alt="user images" className="w-10 h-10 object-cover rounded-lg" /></div>
                                <div className="w-4"></div>
                                <p className="text-sm font-normal leading-none text-slate-600">Want to awaken your body after a hectic work week? Or, enjoy that after-shower glow by sealing in moisture?</p>
                            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Represents the properties of a chat box component.
 * @typedef {Object} ChatBoxProps
 * @property {string} id - The unique identifier of the chat box.
 * @property {string} userId - The unique identifier of the user associated with the chat box.
 * @property {string} avatar - The URL of the avatar image for the chat box.
 * @property {string} name - The name of the chat box.
 * @property {string} useravatar - The URL of the avatar image for the user associated with the chat box.
 */
type ChatBoxProps = {
  id: string;
  userId: string;
  avatar: string;
  name: string;
  useravatar: string;
};

/**
 * A chat box component that allows users to send and receive messages.
 * @param {ChatBoxProps} props - The props for the chat box component.
 * @returns The rendered chat box component.
 */
const ChatBox = (props: ChatBoxProps) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const chatText = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<any[]>([]);
  const [changedata, setChangeData] = useState<boolean>(false);

  const init = async () => {
    setMessage([]);
    let user1 = {
      search: {
        fromUser: props.id,
        toUser: props.userId,
      },
    };

    let user2 = {
      search: {
        fromUser: props.userId,
        toUser: props.id,
      },
    };

    const user1data = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-chat`,
      data: user1,
    });

    const user2data = await axios({
      method: "post",
      url: `${BaseUrl}/api/search-chat`,
      data: user2,
    });

    setMessage((prevState) => [
      ...prevState,
      ...user1data.data.data,
      ...user2data.data.data,
    ]);
    setMessage((prevState) =>
      prevState.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      )
    );

  };

  useEffect(() => {
    chatBoxRef!.current!.scrollTop = chatBoxRef.current?.scrollHeight!;
    init();
  }, [changedata]);

  const sendMessage = async (msg: string) => {
    let req = {
      campaignDraftId: "0",
      fromUserId: props.userId,
      toUserId: props.id,
      comment: msg,
    };

    const data = await axios({
      method: "post",
      url: `${BaseUrl}/api/add-chat`,
      data: req,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Options": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Content-Type-Options": "*",
        "Content-Type": "application/json",
        Accept: "*",
      },
    });
    setChangeData(!changedata);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl w-full p-4 max-h-screen flex flex-col">
        <div className="flex items-center">
          <img
            src={props.avatar}
            className="w-10 h-10 rounded-md"
            alt="avatar"
          />
          <div className="w-4"></div>
          <p className="text-md font-semibold text-slate-900 ">{props.name}</p>
        </div>
        <div className="w-full h-[2px] my-2 bg-slate-300"></div>
        <div
          ref={chatBoxRef}
          className="w-full h-full overflow-y-scroll grow no-scrollbar"
        >
          {message.map((val: any, index: number) => {
            return (
              <div key={index}>
                <Message
                  avatar={
                    val.fromUser.id == props.userId
                      ? props.useravatar
                      : props.avatar
                  }
                  message={val.comment}
                  time={val.updatedAt}
                  user={val.fromUser.id == props.userId}
                ></Message>
              </div>
            );
          })}
        </div>
        <div className="w-full px-4 py-2">
          <div className=" bg-gray-200 rounded-md px-2 py-2 flex">
            <input
              ref={chatText}
              type="text"
              className="py-1 w-full px-2 bg-transparent outline-none"
              placeholder="type something"
            />
            <div className="w-4"></div>
            <button
              className="bg-primary rounded-md text-white  text-md py-1 px-4 font-semibold"
              onClick={async () => {
                if (
                  chatText.current?.value == null ||
                  chatText.current?.value == undefined ||
                  chatText.current?.value == ""
                ) {
                } else {
                  await sendMessage(chatText.current?.value);
                  chatText!.current!.value = "";
                }
              }}
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
