import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import "./addCustomer.css";
import "react-phone-input-2/lib/style.css";
import { Button, DatePicker, Input, QRCode, Select, message } from "antd";
import { addCustomerApi, getInvitationsApi } from "../../services/Apis";

const AddCustomer = () => {
  const [loadingData, setloadingData] = useState(false);
  const [loadingAdd, setloadingAdd] = useState(false);
  const [invitations, setinvitations] = useState([]);
  const [qrObject, setqrObject] = useState({});
  const addUserSchema = yup.object().shape({
    customer_name: yup.string().required("اسم العميل مطلوب"),
    customer_mobile: yup
      .string(" رقم الهاتف غير صحيح")
      .min(11, " رقم الهاتف غير صحيح")
      .matches(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        " رقم الهاتف غير صحيح"
      )
      .required(" رقم الهاتف مطلوب"),
  });

  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { isLoading, touchedFields, dirtyFields, errors },
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(addUserSchema),
  });

  const getAllInvitation = () => {
    try {
      setloadingData(true);
      getInvitationsApi()
        .then((res) => {
          console.log(res);
          setinvitations(res[0]?.data);
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
  }, []);

  const submitAdd = (data) => {
    console.log("user data =>>>>>", data);
    try {
      setloadingAdd(true);
      addCustomerApi(data)
        .then((res) => {
          console.log(res);
          message.success(res.message);
          setloadingAdd(false);
          reset({
            customer_name: "",
            customer_mobile: ""
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
      className="  bg-white max-w-[700px] w-[90%] flex flex-col gap-4 p-8 rounded-lg shadow-lg h-fit mt-[60px]"
    >
      <label className=" text-2xl ">اضافة عميل</label>
      <div className=" w-full relative ">
        <p htmlFor="name" className="my-3">
          اسم العميل
        </p>
        <Controller
          name={"customer_name"}
          control={control}
          render={({ field }) => (
            <Input
              size="large"
              placeholder="ادخل اسم العميل"
              {...field}
              className="w-full"
            />
          )}
        />
        <p style={{ color: "red" }} className=" absolute -bottom-6">
          {errors["customer_name"]?.message}
          {/* {(touchedFields["customer_name"])&&errors["customer_name"]?.message} */}
        </p>
      </div>

      <div className=" w-full relative  ">
        <p htmlFor="name" className="my-3">
          رقم الهاتف
        </p>
        <Controller
          name={"customer_mobile"}
          control={control}
          render={({ field }) => (
            <PhoneInput
              containerClass=" w-full"
              inputStyle={{ direction: "rtl" }}
              inputClass=" !w-full !pr-[48px] !h-[40px]"
              searchClass=" !w-full"
              dropdownClass=" !text-center"
              autocompleteSearch
              enableSearch
              //   inputProps={}
              {...field}
              country={"eg"}
            />
          )}
        />
        <p style={{ color: "red" }} className=" absolute -bottom-6">
          {errors["customer_mobile"]?.message}
          {/* {(touchedFields["customer_mobile"])&&errors["customer_mobile"]?.message} */}
        </p>
      </div>

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
};

export default AddCustomer;
