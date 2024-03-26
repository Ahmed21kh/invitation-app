import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import "./addInvitation.css"
import "react-phone-input-2/lib/style.css";
import { Button, DatePicker, Input, QRCode, message } from "antd";
import { addInviteApi } from "../../services/Apis";
import moment from "moment";

const AddInvitation = () => {
  const [loadingAdd, setloadingAdd] = useState(false)
  const addUserSchema = yup.object().shape({
    invite_name: yup.string().matches(/^[a-zA-Zا-ي]+(\s[a-zA-Zا-ي]+)*$/, 'الاسم يجب ان يحتوي علي حروف فقط').required("اسم المناسبة مطلوب"),
    from_date: yup.date().typeError("تاريخ البداية مطلوب").required("تاريخ البداية مطلوب"),
    to_date: yup.date().typeError("تاريخ النهاية مطلوب").required("تاريخ النهاية مطلوب"),
    invite_desc: yup.string().required('وصف الدعوة مطلوب'),
  });

  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: {isLoading ,touchedFields, dirtyFields, errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(addUserSchema),
  });
  const submitAdd = (data) => {
      console.log("user data =>>>>>", data);
      const {invite_name , to_date ,from_date ,invite_desc} = data ;
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
     const obj = {to_date:new Date(to_date).toLocaleDateString('en-CA'), from_date:new Date(from_date).toLocaleDateString('en-CA'), invite_desc,invite_name}
     console.log(obj);
    try {
      setloadingAdd(true)
      addInviteApi(obj).then((res)=>{
        console.log(res);
        message.success(res.message)
        setloadingAdd(false)
        reset({
          invite_name:"",
          to_date:null,
          from_date:null,
          invite_desc:""
      })
      }).catch((e)=>{
        message.error(e.response.data.message)
        setloadingAdd(false)
      })
      
    } catch (error) {
      message.error(error.message)
    }
  };

  useEffect(() => {
  console.log(watch());
  }, [watch()])
useEffect(() => {
console.log(dirtyFields);
console.log(touchedFields);
console.log(isLoading);
console.log(errors);
}, [dirtyFields,touchedFields,isLoading,errors])
  return (
    <form
      onSubmit={handleSubmit(submitAdd)}
      dir="rtl"
      className="  bg-white max-w-[700px] w-[90%] flex flex-col gap-4 p-8 rounded-lg shadow-lg h-fit my-[100px]"
    >
      <label className=" text-2xl ">اضافة مناسبة</label>
      <div className=" w-full relative ">
        <p htmlFor="name" className="my-3">
          اسم المناسبة
        </p>
        <Controller
          name={"invite_name"}
          control={control}
          render={({ field }) => (
            <Input
              size="large"
              placeholder="ادخل اسم المناسبة"
              {...field}
              className="w-full"
            />
          )}
        />
        <p style={{ color: "red" }} className=" absolute -bottom-6">
          {errors["invite_name"]?.message}
          {/* {(touchedFields["invite_name"])&&errors["invite_name"]?.message} */}
        </p>
      </div>
      <div className=" w-full relative  ">
        <p htmlFor="name" className="my-3">
           تاريخ البداية
        </p>
        <Controller
          name={"from_date"}
          control={control}
          render={({ field }) => (
           <DatePicker
           placeholder="ادخل تاريخ البداية" 
           className=" w-full"
           size="large"
            {...field}
           />
          )}
        />
        <p style={{ color: "red" }} className=" absolute -bottom-6">
          {errors["from_date"]?.message}
          {/* {(touchedFields["phoneNumber"])&&errors["phoneNumber"]?.message} */}
        </p>
      </div>
      <div className=" w-full relative  ">
        <p htmlFor="name" className="my-3">
           تاريخ النهاية
        </p>
        <Controller
          name={"to_date"}
          control={control}
          render={({ field }) => (
           <DatePicker
           placeholder="ادخل تاريخ النهاية" 
           className=" w-full"
           size="large"
            {...field}
           />
          )}
        />
        <p style={{ color: "red" }} className=" absolute -bottom-6">
          {errors["to_date"]?.message}
          {/* {(touchedFields["phoneNumber"])&&errors["phoneNumber"]?.message} */}
        </p>
      </div>
      <div className=" w-full relative ">
        <p htmlFor="name" className="my-3">
          وصف المناسبة
        </p>
        <Controller
          name={"invite_desc"}
          control={control}
          render={({ field }) => (
            <Input.TextArea
              size="large"
              placeholder="ادخل وصف المناسبة"
              {...field}
              className="w-full"
            />
          )}
        />
        <p style={{ color: "red" }} className=" absolute -bottom-6">
          {errors["invite_desc"]?.message}
          {/* {(touchedFields["invite_desc"])&&errors["invite_desc"]?.message} */}
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
      <Button loading={loadingAdd} size="large" type="primary" htmlType="submit" className="  mt-6 mb-3 bg-violet-600 hover:!bg-violet-500  w-full" >حفظ</Button>
      </div>
    </form>
  );
}

export default AddInvitation
