import React, { useEffect, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdInsertInvitation, MdOutlineInsertInvitation } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { Layout, Menu, Switch, Tooltip, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./DashboardLayout.css"
import WhatsappComp from "../components/whatsappComp/whatsappComp";
const { Header, Content, Sider } = Layout;

const items = [
  // { icon: BiCategory, title: "الرئيسيه", route: "/" },
  { icon: AiOutlineUserAdd, title: "اضافة عميل", route: "/add-customer" },
  {
    icon: MdOutlineInsertInvitation,
    title: "اضافة مناسبة",
    route: "/add-invite",
  },
  {
    icon: MdOutlineInsertInvitation,
    title: "اضافة دعوة",
    route: "/add-inviteTransaction",
  },
  // { icon: HiOutlineUsers, title: "العملاء", route: "/customers" },
  { icon: HiOutlineUsers, title: "الدعوات", route: "/inviteTransactions" },

].map((item, index) => ({
  key: item.route,
  icon: React.cloneElement(item.icon({ fontSize: "22px",style:{fontSize:20} })),
  label: `${item.title}`,
}));

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setactiveKey] = useState(location.pathname == '/'?'/add-customer':location.pathname);

  const handleNavigate = (e) => {
    // console.log(e);
    navigate(e.key);
    setactiveKey(e.key);
  };
  useEffect(() => {
  console.log(activeKey);
  }, [activeKey])
  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname == '/') {
    setactiveKey('/add-customer');
    }else {
      setactiveKey(location.pathname);
    }
  }, [location.pathname]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout hasSider>
      <Sider
        className=" !bg-white !shadow-lg"
        style={{
          direction: "rtl",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          fontSize: 22,
        }}
      >
        <div className=" my-[20px] flex justify-center gap-3 items-center text-[#000] font-semibold">
          {" دعـــــــــوة "}
          <span className=" text-violet-600 font-semibold !text-3xl">آب</span>
          
        </div>
        <Menu
          theme="light"
          mode="inline"
          onClick={handleNavigate}
          style={{ fontSize: 18 }}
          defaultSelectedKeys={[activeKey]}
          items={items}
          activeKey={location.pathname =='/'?'/add-customer':activeKey}
        />
      </Sider>
      <Layout
        style={{
          marginRight: 200,
        }}
      >
        <Header
          style={{
            background: colorBgContainer,
          }}
          className=" shadow-md px-4 flex items-center"
        >
           <WhatsappComp/>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
          className=" flex justify-center py-[50px] h-[90vh]"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
