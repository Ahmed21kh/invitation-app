import { message } from "antd";
import { createContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
export const Context = createContext();


export function AppContext({ children }) {
  const [openWhatsapp, setOpenWhatsapp] = useState(false);
  const [messagesToAll, setMessagesToAll] = useState([]);
  const [loadingQr, setLoadingQr] = useState(false);
  const [loader, setLoader] = useState(false);
  const [qrData, setQrData] = useState(" ");
  const [whatsMessage, setWhatsMessage] = useState("");
  const [sendMessage, setSendMessage] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [active, setActive] = useState(false);
  const [activeStatus, setActiveStatus] = useState("مغلق");
  const [activeLoading, setActiveLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [auth, setAuth] = useState(
    localStorage.getItem("Auth") ? localStorage.getItem("Auth") : false
  );
  const activeRef = useRef(null);
  const authRef = useRef(null);
  const listRef = useRef(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [percent, setpercent] = useState(0)
  
  const createNewWebSocket = () => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
      withCredentials: true,
      secure: true,
      transports: ["websocket"],
      reconnection: true,
      autoConnect: true,
      reconnectionDelay: 1000,
      closeOnBeforeunload: true,
      forceNew: true,
      multiplex: true,
      reconnectionAttempts: 5,
      rejectUnauthorized: false,
      timeout: 10000,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
      // closeOnBeforeunload:false,
      reconnectionDelayMax: 10000,
      auth: {
        token: "ssadsadsadasdsadsadsadsadsadsadsadsadsads",
      },
      query: {
        "my-key": "my-value",
      },
    });

    setSocket(newSocket);
  };
  useEffect(() => {
    console.log(process.env.REACT_APP_SOCKET_URL);
    console.log(socket);
  }, [socket]);
  const onChangeActive = (e) => {
    console.log(e);
    if (!e) {
      // setActiveLoading(true)
      setActive(!active);
      setSendMessage(false);
      // handleCloseWhatsModal();
      if (socket) {
        socket.close();
        setSocket(null);
        // setActive(false)
      }
    } else {
      setActiveLoading(true);
      setActive(!active);
      if (process.env.REACT_APP_SOCKET_URL) {
        createNewWebSocket();
      }
    }
  };
  const handleSendMessage = () => {
    if (checklist.length === 0) {
      message.warning("يجب عليك تحديد العملاء لارسال الرسائل");
      return;
    }
    if (!active) {
      message.warning("برجاء فتح جلسة للواتس");
      return;
    }
    if (activeLoading) {
      message.warning("برجاء الانتظار حتي يتم فتح الجلسة");
      return;
    }
    if (!auth && !localStorage.getItem("Auth")) {
      message.warning("برجاء تسجيل الدخول للواتس اولا");
      return;
    }
    if (checklist.length > 0) {
      const List = [];
      const allData = new Map([])
      checklist.forEach((val)=>{
        Object.keys(val).map((key)=>{
          console.log(key);
          if (key !== "id") {
            allData.set(key,{mesg:val[key],id:val.id});
          }
        })
        console.log(allData);
      })
      setLoadingBtn(true);

    allData.forEach((value, key) => {
        console.log({key,value});
        List.push({key,value:value?.mesg,id:value.id});
      });
        socket.emit("sendMediaToAll", {
          whatsappList:List,
        });
      }
      socket.once("error", (data) => {
       message.error(data);
      setLoadingBtn(false);

      })
    socket.once("success", (data) => {
      message.success(data);
      setOpenWhatsapp(false);
      setLoadingBtn(false);
    });
  };
  const contextValue = {
    setActiveLoading,
    activeLoading,
    active,
    setActive,
    setOpenWhatsapp,
    openWhatsapp,
    setMessagesToAll,
    messagesToAll,
    setLoadingQr,
    loadingQr,
    setQrData,
    qrData,
    setWhatsMessage,
    whatsMessage,
    setSendMessage,
    sendMessage,
    setChecklist,
    checklist,
    listRef,
    activeRef,
    authRef,
    auth,
    setAuth,
    socket,
    setSocket,
    loader,
    setLoader,
    loadingBtn,
    setLoadingBtn,
    onChangeActive,
    activeStatus,
    setActiveStatus,
    handleSendMessage

  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export default AppContext;
