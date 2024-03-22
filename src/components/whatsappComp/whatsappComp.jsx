import React, { useContext, useEffect, useState } from "react";
import "./whatsappComp.css";
import { Badge, Button, Modal, QRCode, Switch, Tooltip, message } from "antd";
import { MdWhatsapp } from "react-icons/md";
import { Context } from "../../context/AppContext";
import reactStringReplace from "react-string-replace";
import { FaRegCheckCircle } from "react-icons/fa";

const WhatsappComp = () => {
  
  const {
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
    setActiveStatus,
    activeStatus,
    setpercent
  } = useContext(Context);

  const handleGenerateQR = () => {
    // Send a message to the server
    if (navigator.onLine) {
      setAuth(false);
      socket.on("QRCODE", async (qr) => {
        socket.on("Authenticated", (data) => {
          setAuth(data);
          localStorage.removeItem("Auth");
        });
        console.log("QrCode", qr);
        localStorage.removeItem("Auth");
        setAuth(false)
        setActiveLoading(false);
        if (qr) {
          console.log(socket.id);
          console.log(qr);
          setLoadingQr(false);
          setActiveStatus("مفتوح");
          setQrData(qr);
        } else {
          setLoadingQr(true);
        }
      });
      setTimeout(() => {
        socket.off("success");
      }, 1000);
    } else {
      // toast.error("Network error");
      message.error("Network error");
    }
  };
  const handleLogout = () => {
    if (navigator.onLine) {
      setQrData("");
      setLoadingQr(true);
      console.log("handle logout");
      socket.emit("Logout");
      window.localStorage.removeItem("Auth");
      setAuth(false);
      // setOpenWhatsapp(false)
      message.success("logout successfuly");
      // setTimeout(() => {
      //   socket.close();
      //   setSocket(null)
      //   // setWhatsMessage("")
      // }, 1000)
      setTimeout(() => {
        socket.off("success");
        handleGenerateQR();
      }, 1000);
    } else {
      message.error("Network error");
    }
    // setTimeout(()=>{
    //   window.location.reload()
    //   // socket.emit('connect')
    // },5000)
  };

  useEffect(() => {
    const allData = new Map([])
    checklist.forEach((val)=>{
      Object.keys(val).map((key)=>{
        console.log(key);
        if (key !== "id") {       
          allData.set(key,val[key]);
        }
      })
      console.log(allData);
    })
    console.log(checklist);
  }, [checklist]);

  useEffect(() => {
    if (localStorage.getItem("Auth")) {
      setAuth(localStorage.getItem("Auth"));
    }
  }, [auth]);

  useEffect(() => {
    // setIsExclDownload(false);
    if (!socket) {
      console.log("socket not available");
      return;
    }
    console.log(navigator.onLine);
    const room = "room1";
    // socket.emit("join",room)
    socket.on("connect", () => {
      console.log("Connected to server");
      // console.log(socket.room);
    });
    setAuth(localStorage.getItem("auth"));
    if (!auth || !localStorage.getItem("auth")) {
      handleGenerateQR();
      // handleRefresh()
    } else {
      // setLoader(true);
    }
    // if (auth) {
    //   // setLoading(true);
    // }
    socket.once("downloadResult", (data) => {
      console.log(data);
    });
    socket.on("loading", (load) => {
      // setLoadingQr(load);
      setLoader(load);
    });
    socket.on("error", (error) => {
      console.log(error.message);
      console.log("error");
      message.error(error)
    });
    socket.on("messageProgress", (data) => {
      console.log(data);
      // setpercent(data.progress);
    });
    socket.on("ping", () => {
      console.log("ping to server");
    });
    socket.on("reconnect", (attempt) => {
      console.log("reconnect");
    });
    socket.on("reconnect_attempt", (attempt) => {
      console.log("reconnect_attempt");
    });
    socket.on("reconnect_error", (error) => {
      console.log("reconnect_error");
    });
    socket.on("reconnect_failed", () => {
      console.log("reconnect_failed");
    });
    socket.once("errors", (msg) => {
      console.log(msg);
      // toast.error(msg, { theme: "colored" });
    });
    setTimeout(() => {
      socket.off("error");
    }, 5000);

    // if(refresh===true && !auth){
    //   setTimeout(() => {
    //   socket.emit('refresh', false)
    //     setRefresh(false)
    //   }, 60000);
    // }

    socket.on("isAuth", (isAuth) => {
      if (navigator.onLine) {
        setActiveStatus("مفتوح");
        console.log(`client Auth is: ${isAuth}`);
        window.localStorage.setItem("Auth", isAuth);
        setAuth(isAuth);
        if (isAuth) {
          setActiveLoading(false);
        }
        setActiveLoading(false);
        setLoader(false);
      } else {
        // toast.error("Network error");
        message.error("Network error");
      }
      // clearTimeout(timer)
    });

    // socket.on('disconnect', () => {
    //   console.log('Disconnected from server');
    // });

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
      socket.off("QRCODE");
      socket.off("sendMessages");
      socket.off("success");
      socket.off("error");
      socket.off("messageProgress");
      // clearTimeout(timer)
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      console.log("socket disconnected");
      console.log(socket);
      if (socket) {
        socket.close();
        // setSocket(null)
        setActive(!active);
        setActiveStatus("مغلق");
      }
    };
  }, [socket]);

  const handleOpenWhatsModal = () => {
    // if(auth){
    //   setLoader(true);
    // }
    if (!active) {
      message.warning("برجاء فتح جلسة للواتس");
      return;
    }
    if (activeLoading) {
      message.warning("برجاء الانتظار حتي يتم فتح الجلسة");
      return;
    }
    setOpenWhatsapp(true);
    // setLoader(true)
    // setLoadingQr(true)
    setSendMessage(false);

    // createNewWebSocket()
  };

  const handleCloseWhatsModal = () => {
    if (socket) {
      setSendMessage(false);
      setWhatsMessage("");
      setActiveLoading(false);
      setOpenWhatsapp(false);
      setLoadingBtn(false);
      setChecklist([]);
      setMessagesToAll([]);
    }
  };
  
  

  return (
    <>
      <div className=" flex items-center gap-4">
        <Tooltip placement="bottomRight" title="فتح جلسة للواتس">
          <Switch
            onChange={onChangeActive}
            loading={activeLoading}
            className=" "
          />
        </Tooltip>
        <div>{activeStatus}</div>
        <Tooltip title="تسجيل الدخول للواتس">
          <Badge
            onClick={handleOpenWhatsModal}
            dot={true}
            className=""
            offset={[-2, 5]}
            size="default"
            color={auth?"green":"red"}
          >
            <MdWhatsapp className=" text-violet-600 text-3xl cursor-pointer" />
          </Badge>
        </Tooltip>
      </div>
      <Modal
        // title='تسجيل الدخول للواتس'
        width={"750px"}
        footer={null}
        style={{ direction: "rtl" }}
        open={openWhatsapp}
        closable={false}
      >
        <div className=" py-6 flex max-[688px]:flex-col justify-center gap-3 items-center ">
        {!loader ? (
          <>
          {!auth && !localStorage.getItem("Auth") ? (
            <>
          {loadingQr ? (
            <div style={{ margin: "65px 72px" }}>
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            <QRCode
              status={activeLoading ? "loading" : "active"}
              value={qrData}
              size={220}
            />
          )}
          <div className=" mr-2">
            <div className="whatsAppTitle">استخدام واتساب على الكمبيوتر</div>
            <div className="_1MxED"></div>
            <ol className="_1G5cu list-decimal">
              <li className="_3JRy8">افتح واتساب على هاتفك</li>
              <li className="_3JRy8 ">
                <span dir="rtl" className="_11JPr inline-block">
                  انقر على{" "}
                  <strong className=" inline-block">
                    <span dir="rtl" className="_11JPr inline-block">
                      القائمة
                      <span className="l7jjieqr fewfhwl7 inline-block">
                        <svg height="24px" viewBox="0 0 24 24" width="24px">
                          <rect
                            fill="#f2f2f2"
                            height="24"
                            rx="3"
                            width="24"
                          ></rect>
                          <path
                            d="m12 15.5c.825 0 1.5.675 1.5 1.5s-.675 1.5-1.5 1.5-1.5-.675-1.5-1.5.675-1.5 1.5-1.5zm0-2c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5zm0-5c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5z"
                            fill="#818b90"
                          ></path>
                        </svg>
                      </span>
                    </span>
                  </strong>{" "}
                  أو على{" "}
                  <strong className=" inline-block">
                    <span dir="rtl" className="_11JPr inline-block">
                      الإعدادات{" "}
                      <span className="l7jjieqr fewfhwl7 inline-block">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <rect
                            fill="#F2F2F2"
                            width="24"
                            height="24"
                            rx="3"
                          ></rect>
                          <path
                            d="M12 18.69c-1.08 0-2.1-.25-2.99-.71L11.43 14c.24.06.4.08.56.08.92 0 1.67-.59 1.99-1.59h4.62c-.26 3.49-3.05 6.2-6.6 6.2zm-1.04-6.67c0-.57.48-1.02 1.03-1.02.57 0 1.05.45 1.05 1.02 0 .57-.47 1.03-1.05 1.03-.54.01-1.03-.46-1.03-1.03zM5.4 12c0-2.29 1.08-4.28 2.78-5.49l2.39 4.08c-.42.42-.64.91-.64 1.44 0 .52.21 1 .65 1.44l-2.44 4C6.47 16.26 5.4 14.27 5.4 12zm8.57-.49c-.33-.97-1.08-1.54-1.99-1.54-.16 0-.32.02-.57.08L9.04 5.99c.89-.44 1.89-.69 2.96-.69 3.56 0 6.36 2.72 6.59 6.21h-4.62zM12 19.8c.22 0 .42-.02.65-.04l.44.84c.08.18.25.27.47.24.21-.03.33-.17.36-.38l.14-.93c.41-.11.82-.27 1.21-.44l.69.61c.15.15.33.17.54.07.17-.1.24-.27.2-.48l-.2-.92c.35-.24.69-.52.99-.82l.86.36c.2.08.37.05.53-.14.14-.15.15-.34.03-.52l-.5-.8c.25-.35.45-.73.63-1.12l.95.05c.21.01.37-.09.44-.29.07-.2.01-.38-.16-.51l-.73-.58c.1-.4.19-.83.22-1.27l.89-.28c.2-.07.31-.22.31-.43s-.11-.35-.31-.42l-.89-.28c-.03-.44-.12-.86-.22-1.27l.73-.59c.16-.12.22-.29.16-.5-.07-.2-.23-.31-.44-.29l-.95.04c-.18-.4-.39-.77-.63-1.12l.5-.8c.12-.17.1-.36-.03-.51-.16-.18-.33-.22-.53-.14l-.86.35c-.31-.3-.65-.58-.99-.82l.2-.91c.03-.22-.03-.4-.2-.49-.18-.1-.34-.09-.48.01l-.74.66c-.39-.18-.8-.32-1.21-.43l-.14-.93a.426.426 0 00-.36-.39c-.22-.03-.39.05-.47.22l-.44.84-.43-.02h-.22c-.22 0-.42.01-.65.03l-.44-.84c-.08-.17-.25-.25-.48-.22-.2.03-.33.17-.36.39l-.13.88c-.42.12-.83.26-1.22.44l-.69-.61c-.15-.15-.33-.17-.53-.06-.18.09-.24.26-.2.49l.2.91c-.36.24-.7.52-1 .82l-.86-.35c-.19-.09-.37-.05-.52.13-.14.15-.16.34-.04.51l.5.8c-.25.35-.45.72-.64 1.12l-.94-.04c-.21-.01-.37.1-.44.3-.07.2-.02.38.16.5l.73.59c-.1.41-.19.83-.22 1.27l-.89.29c-.21.07-.31.21-.31.42 0 .22.1.36.31.43l.89.28c.03.44.1.87.22 1.27l-.73.58c-.17.12-.22.31-.16.51.07.2.23.31.44.29l.94-.05c.18.39.39.77.63 1.12l-.5.8c-.12.18-.1.37.04.52.16.18.33.22.52.14l.86-.36c.3.31.64.58.99.82l-.2.92c-.04.22.03.39.2.49.2.1.38.08.54-.07l.69-.61c.39.17.8.33 1.21.44l.13.93c.03.21.16.35.37.39.22.03.39-.06.47-.24l.44-.84c.23.02.44.04.66.04z"
                            fill="#818b90"
                          ></path>
                        </svg>
                      </span>
                    </span>
                  </strong>{" "}
                  وحدّد <strong>الأجهزة المرتبطة</strong>
                </span>
              </li>
              <li className="_3JRy8">
                <span dir="rtl" className="_11JPr">
                  انقر على <strong>ربط جهاز</strong>
                </span>
              </li>
              <li className="_3JRy8">
                <span>وجّه هاتفك نحو هذه الشاشة لتصوير الرمز المربّع</span>
              </li>
            </ol>
          </div>
            </>
          ):(
            <>
            <div className=" mt-5">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  flexWrap:"wrap",
                  gap: 15,
                }}
              >
                <div className=" w-full flex justify-center flex-col items-center gap-3">
                <FaRegCheckCircle className=" text-8xl text-green-500" />
                <span className=" text-2xl"> اهلا بك في واتس آب !!</span>
                </div>
                <Tooltip
                  placement="bottom"
                  title=" تسجيل خروج من الواتس آب"
                  color="black"
                >
                  <Button
                    htmlType="button"
                    type="primary"
                    className=" mt-3 bg-violet-600 hover:!bg-violet-500"
                    onClick={() => handleLogout()}
                  >
                   تسجيل الخروج
                  </Button>
                </Tooltip>
                {/* <Button
                  htmlType="button"
                  onClick={handleCloseWhatsModal}
                >
                 اغلاق
                </Button> */}
              </div>
            </div>
          </>
          )}
          </>

        ):(
          <>
          <div
            style={{
              margin: "0px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              flexDirection: "column",
            }}
          >
            <div className="lds-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <h3  dir="rtl" className=" text-xl mt-5">
              برجاء الانتظار لمزامنة الرسائل....
            </h3>
          </div>
        </>
        )}
          
        </div>
        <div className=" w-full flex justify-end items-center mt-4">
          <Button
            className="hover:!text-[#000] hover:!border-[#ccc]"
            onClick={handleCloseWhatsModal}
          >
            اغلاق
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default WhatsappComp;
