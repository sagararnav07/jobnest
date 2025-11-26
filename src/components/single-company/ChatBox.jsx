import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import {
  getChatUserById,
  getConversation,
  getChatUsers,
  sendMessage,
} from "../../firebase/firebase";
import { UserContext } from "../../context/user-context";
import { useNavigate } from "react-router";

import SendingMessages from "./SendingMessages";
import RecievingMessage from "./RecievingMessage";
import { Link } from "react-router-dom";
import Loading from "../alert/loading";
import { ChatContext } from "../../context/chat-context";

const ChatBox = () => {
  const messagesContainerRef = useRef(null);
  const [value, setValue] = useState("");
  const { currentUser, databaseUser } = useContext(UserContext);
  const { chatId, setChatId } = useContext(ChatContext);
  const [companies, setCompanies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [usersCollection, setUsersCollection] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (chatId != null && currentUser?.email) {
        const list = await getChatUserById(chatId);
        setCompanies(list);
        const thread = await getConversation(list.email);
        setMessages(thread || []);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [currentUser, chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (value.trim() === "" || !companies?.email || !currentUser) {
      return;
    }
    const payload = {
      receiverEmail: companies.email,
      message: value,
    };
    setValue("");
    await sendMessage(payload);
    const thread = await getConversation(companies.email);
    setMessages(thread || []);

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (!currentUser) return;
      const users = await getChatUsers();
      setUsersCollection(users);
    };
    getUser();
  }, [currentUser]);

  const defaultAvatar =
    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  return (
    <>
      <div className="container mx-auto border border-black ">
        <div
          className="flex flex-row  justify-between  bg-white "
          style={{ height: 600 }}
        >
          <div className="flex flex-col bg-gray-50 ">
            <div
              className="flex flex-row pt-4 px-3 justify-center items-center"
              style={{ width: 400 }}
            >
              <div className="w-1/4 ">
                <img
                  src={databaseUser?.photoURL || defaultAvatar}
                  className="object-cover  h-12 w-12 rounded-full"
                  alt=""
                />
              </div>
              <div className="w-full">
                <div className="flex">
                  <div className="text-lg text-blue-800 font-semibold">
                    {databaseUser.displayName}
                  </div>
                  <Link to={"/profile"}>
                    <PencilIcon className="h-5 mt-1  cursor-pointer " />
                  </Link>
                </div>

                <span class="text-gray-500 ">
                  {" "}
                  {databaseUser.category.charAt(0).toUpperCase() +
                    databaseUser.category.slice(1)}
                </span>
              </div>
            </div>

            <div className="my-4 mt-10 px-5 ">
              <input
                type="text"
                placeholder=" 🔍  Search Users"
                className="py-2 px-2 border-2 h-10 border-black rounded-full w-full"
              />
            </div>

            <div className="overflow-y-auto border border-black">
              {usersCollection.length === 0 ? (
                <p className="my-5 mx-11">No companies registered yet.</p>
              ) : (
                usersCollection.map((index) => {
                  return (
                    <div
                      className="flex flex-row py-4 px-3 justify-center items-center border-b"
                      key={index.id}
                    >
                      <div className="w-1/4">
                        <img
                          src={index.photoURL}
                          className="object-cover h-12 w-12 rounded-full"
                          alt=""
                        />
                      </div>

                      <div
                        className="w-full  cursor-pointer"
                        onClick={() => {
                          setChatId(index.id);
                          setIsLoading(true);
                        }}
                      >
                        <div className="text-md font-semibold mx-5 text-blue-700">
                          {index.displayName}
                        </div>
                        <span class="text-gray-500 mx-5">{index.category}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {chatId != null ? (
            <div className="flex justify-between flex-col  mx-36 p-3 w-full">
              {isLoading ? (
                <Loading loading={isLoading} />
              ) : (
                <>
                  <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                    <div className="relative flex items-center space-x-4">
                      <ArrowLeftIcon
                        className="h-6 mr-10 cursor-pointer"
                        onClick={() => {
                          setChatId(null);
                        }}
                      />
                      <div className="relative">
                        {companies && (
                          <img
                            src={companies.photoURL || defaultAvatar}
                            alt=""
                            className="w-16 "
                          />
                        )}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <div className="text-2xl mt-1 flex items-center">
                          {companies && (
                            <Link
                              to={`/companies/${companies.id}`}
                              className="text-gray-700 mr-3"
                            >
                              {companies.displayName}
                            </Link>
                          )}
                        </div>
                        {companies && (
                          <span className="text-sm text-gray-600">
                            {companies.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    id="messages"
                    ref={messagesContainerRef}
                    className=" flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                    style={{ height: 500 }}
                  >
                    {Array.isArray(messages) &&
                      currentUser &&
                      messages.map((message) =>
                        message.sender.email === currentUser.email ? (
                          <SendingMessages
                            key={message._id || message.id}
                            message={message}
                          />
                        ) : (
                          <RecievingMessage
                            key={message._id || message.id}
                            message={message}
                          />
                        )
                      )}
                  </div>
                  <div className="px-4 pt-4 mb-2 sm:mb-0 border-t border-black">
                    <form
                      className="relative flex"
                      onSubmit={handleSendMessage}
                    >
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Write your message!"
                        className="w-full focus:outline-none focus:placeholder-gray-400  text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-full py-3"
                      />
                      <div className="absolute right-0 items-center inset-y-0  sm:flex ">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                        >
                          <span className="font-bold">Send</span>
                          <PaperAirplaneIcon className="h-6 w-6 ml-2 transform rotate-90" />
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex justify-between flex-col  mx-36 p-3 w-full">
              Welcome to Job Nest Chat, Find the users from sidebar to connect
              with them
            </div>
          )}
        </div>
      </div>

      {/* <div className=" border border-gray-300  max-sm:mx-3 container mx-auto mb-10">
        <div className="flex justify-between flex-col  mx-36 p-3">
          <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
            <div className="relative flex items-center space-x-4">
              <ArrowLeftIcon
                className="h-6 mr-10 cursor-pointer"
                onClick={goBack}
              />
              <div className="relative">
                {companies && (
                  <img src={companies.photoURL} alt="" className="w-16 " />
                )}
              </div>
              <div className="flex flex-col leading-tight">
                <div className="text-2xl mt-1 flex items-center">
                  <span className="text-gray-700 mr-3">
                    {companies && companies.displayName}
                  </span>
                </div>
                <span className="text-sm text-gray-600">Company</span>
              </div>
            </div>
          </div>
          <div
            id="messages"
            className=" flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            style={{ height: 500 }}
          >
            {Array.isArray(allMessage.send) &&
              Array.isArray(allMessage.receive) &&
              [...allMessage.send, ...allMessage.receive]
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((message) =>
                  message.sender.email === currentUser.email ? (
                    <SendingMessages key={message.id} message={message} />
                  ) : (
                    <RecievingMessage key={message.id} message={message} />
                  )
                )}
          </div>
          <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <form className="relative flex" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Write your message!"
                className="w-full focus:outline-none focus:placeholder-gray-400  text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              />
              <div className="absolute right-0 items-center inset-y-0  sm:flex">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                >
                  <span className="font-bold">Send</span>
                  <PaperAirplaneIcon className="h-6 w-6 ml-2 transform rotate-90" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default ChatBox;
