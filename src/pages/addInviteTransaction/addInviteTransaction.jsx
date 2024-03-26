import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import "./addInviteTransaction.css"
import "react-phone-input-2/lib/style.css";
import { Button, DatePicker, Input, QRCode, Select, message } from "antd";
import { addCustomerApi, addInviteTransactionApi, getCustomersApi, getInvitationsApi } from "../../services/Apis";

const AddInviteTransaction = () => {
    const [loadingData, setloadingData] = useState(false);
    const [loadingAdd, setloadingAdd] = useState(false);
    const [invitations, setinvitations] = useState([]);
    const [customers, setcustomers] = useState([])
    const [qrObject, setqrObject] = useState({});
    const addTransactionSchema = yup.object().shape({
      customer_id: yup.string().required("اسم العميل مطلوب"),
      invitation_id: yup.string().required("اسم الدعوة مطلوب"),
      
    });
  
    const {
      register: register,
      handleSubmit: handleSubmit,
      formState: { isLoading, touchedFields, dirtyFields, errors },
      setValue,
      reset,
      control,
    } = useForm({
      resolver: yupResolver(addTransactionSchema),
    });
  
    const getAllInvitation = () => {
      try {
        setloadingData(true);
        getInvitationsApi()
          .then((res) => {
            console.log(res);
            setinvitations(res);
            setloadingData(false);
          })
          .catch((e) => {
            message.error(e.message);
            setloadingData(false);
          });
      } catch (error) {
        message.error(error.message);
      }
    };
    const getAllCustomers = () => {
        try {
          setloadingData(true);
          getCustomersApi()
            .then((res) => {
              console.log(res);
              setcustomers(res);
              setloadingData(false);
            })
            .catch((e) => {
              message.error(e.message);
              setloadingData(false);
            });
        } catch (error) {
          message.error(error.message);
        }
      };
    useEffect(() => {
      getAllInvitation();
      getAllCustomers()
    }, []);
  
    const submitAdd = (data) => {
      console.log("user data =>>>>>", data);
      try {
        let obj = {
            customer_id: data.customer_id,
            invitation_id: data.invitation_id,
            sending_status:'not_sent',
            attendance_status:'not_attend'
        }
        setloadingAdd(true);
        addInviteTransactionApi(obj)
          .then((res) => {
            console.log(res);
            message.success(res.message);
            setloadingAdd(false);
            reset({
             customer_id:null,
             invitation_id:null
            });
          })
          .catch((e) => {
            setloadingAdd(false);
            message.error(e.response.data.message);
          });
      } catch (error) {
        message.error(error.message);
      }
    };
    const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    useEffect(() => {
      console.log(dirtyFields);
      console.log(touchedFields);
      console.log(isLoading);
      console.log(errors);
    }, [dirtyFields, touchedFields, isLoading, errors]);
    return (
      <form
        onSubmit={handleSubmit(submitAdd)}
        dir="rtl"
        className="  bg-white max-w-[700px] w-[90%] flex flex-col gap-4 p-8 rounded-lg shadow-lg h-fit mt-[150px]"
      >
        <label className=" text-2xl ">اضافة دعوة</label>
        <div className=" w-full relative ">
          <p htmlFor="name" className="my-3">
            اسم العميل
          </p>
          <Controller
            name={"customer_id"}
            control={control}
            render={({ field }) => (
                <Select
                loading={loadingData}
                showSearch
                placeholder="اختر العميل"
                className=" w-full"
                size="large"
                dropdownStyle={{ direction: "rtl" }}
                filterOption={filterOption}
                options={customers.map((data) => {
                  return { value: data._id, label: data.customer_name };
                })}
                {...field}
              />
            )}
          />
          <p style={{ color: "red" }} className=" absolute -bottom-6">
            {errors["customer_id"]?.message}
            {/* {(touchedFields["customer_name"])&&errors["customer_name"]?.message} */}
          </p>
        </div>
  
        <div className=" w-full relative  ">
          <p htmlFor="name" className="my-3">
            اسم الدعوة
          </p>
          <Controller
            name={"invitation_id"}
            control={control}
            render={({ field }) => (
              <Select
              loading={loadingData}
                showSearch
                placeholder="اختر الدعوة"
                className=" w-full"
                size="large"
                dropdownStyle={{ direction: "rtl" }}
                filterOption={filterOption}
                options={invitations.map((data) => {
                  return { value: data._id, label: data.invite_name };
                })}
                {...field}
              />
            )}
          />
          <p style={{ color: "red" }} className=" absolute -bottom-6">
            {errors["invitation_id"]?.message}
            {/* {(touchedFields["customer_mobile"])&&errors["customer_mobile"]?.message} */}
          </p>
        </div>
  
        {/* <div id="myqrcode" className=" mt-4 w-full">
            <QRCode
            value={qrObject}
            type='canvas'
            bgColor="#fff"
            style={{
                marginBottom: 0,
            }}
            />
        </div> */}
  
        <div className=" w-full">
          <Button
            loading={loadingAdd}
            size="large"
            type="primary"
            htmlType="submit"
            className="  mt-6 mb-3 bg-violet-600 hover:!bg-violet-500  w-full"
          >
            حفظ
          </Button>
        </div>
      </form>
    );
}

export default AddInviteTransaction