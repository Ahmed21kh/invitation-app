import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Input, Modal, Pagination, Radio, Row, Table, Tooltip, message } from 'antd';
import { MdInfo, MdInfoOutline, MdWhatsapp } from 'react-icons/md';
import { getAllCustomersApi, getCustomersApi } from '../../services/Apis';
import "./customers.css"
import { Controller, useForm } from 'react-hook-form';

const Customers = () => {
  const [selectionType, setSelectionType] = useState('checkbox');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setcustomers] = useState([])
  const [loadingData, setloadingData] = useState(false)
  const [pageSize, setpageSize] = useState(10)
  const [pageNumber, setpageNumber] = useState(1)
  const [totalPages, settotalPages] = useState(0)
  const [inviteDetailsModal, setinviteDetailsModal] = useState(false)
  const [inviteDetails, setinviteDetails] = useState({})
  const [searchQuery, setsearchQuery] = useState('')
  const {register, getValues , setValue , handleSubmit , control , watch,reset} = useForm()
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
   console.log(customers);
  }, [customers])
  const getAllCustomers = () =>{
    try {
      setloadingData(true)
      getAllCustomersApi(pageNumber,pageSize,searchQuery).then((res)=>{
        console.log(res);
        let newData = res?.data?.map((e,i)=>{return{key:i,...e}})
        let total = res?.metaData[0]?.total
        setcustomers(newData)
        settotalPages(total)
       setloadingData(false)
      }).catch((e)=>{
       setloadingData(false)
        message.error(e.message)
      })
      
    } catch (error) {
      setloadingData(false)
      message.error(error.message)
    }
  }

  const changePage=(e)=>{
    console.log(e);
    setpageNumber(e)
  }
const openInviteModal = (data)=>{
setinviteDetailsModal(true)
setinviteDetails(data);
}
const closeInviteModal = ()=>{
setinviteDetailsModal(false)
setinviteDetails({});
}

const handleClearSearch = ()=>{
 reset({
  customer_name: '',
  customer_mobile: ''
 })
 setsearchQuery('')
}
const handleSearch = (data)=>{
  console.log(data);
  const {customer_name, customer_mobile} = data;
 let x = ''
 if(customer_name){
   x += `&customer_name=${customer_name}&`
 }
 if(customer_mobile){
   x += `&customer_mobile=${customer_mobile}&`
 }
 setsearchQuery(x)
 setpageNumber(1)
}
  useEffect(() => {
  getAllCustomers()
  }, [pageNumber , searchQuery])


  const columns = [
    {
      title: 'اسم العميل',
      dataIndex: 'customer_name',
    },
    {
      title: 'رقم الهاتف',
      dataIndex: 'customer_mobile',
    }
  ];
  
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      // disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <>
     <div className=' w-full h-full px-5 pt-[80px] overflow-auto '>
    <form onSubmit={handleSubmit(handleSearch)} className=' my-4'>
          <Row  dir='rtl'  gutter={[24,24]}>
             <Col xs={24} md={12} lg={4}>
              <Controller control={control} name='customer_name' render={({field})=>(

                <Input {...field}  placeholder='ابحث باسم العميل' size='large' />
              )} />
             </Col>
             <Col xs={24} md={12} lg={4}>
             <Controller control={control} name='customer_mobile' render={({field})=>(
             <Input placeholder='ابحث برقم الهاتف' size='large' {...field} />
             )}/>
             </Col>
             <Col xs={24} md={12} lg={6}>
              <Row gutter={[24,24]}>
                <Col xs={24} md={12} lg={12}>
                  <Button type='primary' size='large' htmlType='submit'  className=' w-full bg-violet-600 flex items-center justify-center hover:!bg-violet-500' onClick={handleSubmit(handleSearch)}>بحث</Button>
                </Col>
                <Col xs={24} md={12} lg={12}>
                  <Button type='primary' size='large'  className=' w-full bg-white text-violet-600 border-violet-600 flex items-center justify-center hover:!bg-white hover:!text-violet-600' onClick={handleClearSearch}>مسح</Button>
                </Col>
              </Row>               
             </Col>
          </Row>
        </form>
      <Table
       loading={loadingData}
        pagination={false}
        direction='rtl'
        style={{direction:'rtl'}}
        scroll={{
          x: 1000,
          y:430
        }}
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
        className=' shadow-lg mt-8'
        columns={columns}
        dataSource={customers}
      />
      <div className=' bg-white p-3' dir='rtl'>
      <Pagination style={{direction:'ltr'}} responsive current={pageNumber} onChange={changePage} defaultCurrent={pageNumber} total={totalPages} />
      </div>
    </div>
    {/* send message modal */}
    <Modal style={{direction:'rtl'}} footer={null} title="ارسال الدعوة للعميل" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
         <div className=' p-5'>
           <Input.TextArea rows={3}  className=' w-full' placeholder='اكتب الرسالة التي تريد ارسالها....' />
         </div>
         <div className=' flex gap-3 justify-end py-3 items-center'>
          <Button type='primary' className=' bg-violet-500 flex items-center hover:!bg-violet-600' onClick={handleOk}>ارسال</Button>
          <Button onClick={handleCancel} className=' hover:!text-[#000] hover:!border-[#ccc]'>اغلاق</Button>

         </div>
      </Modal>

      {/* details invite modal  */}

      <Modal style={{direction:'rtl'}} footer={null} title=" تفاصيل الدعوة" open={inviteDetailsModal}  onCancel={closeInviteModal}>
         <Row gutter={[24,24]} className='py-5'>
          <Col xs={24} lg={12}>
            <p className=' text-md text-gray-300'>اسم الدعوة</p>
            <span className=' text-lg'>{inviteDetails?.invite_name}</span>
          </Col>
          <Col xs={24} lg={12}>
          <p className=' text-md text-gray-300'>تفاصيل الدعوة</p>
            <span className=' text-lg'>{inviteDetails?.invite_desc}</span>
          </Col>
          <Col xs={24} lg={12}>
          <p className=' text-md text-gray-300'>تاريخ البداية</p>
            <span className=' text-lg'>{inviteDetails?.from_date?.split("T")[0]}</span>
          </Col>
          <Col xs={24} lg={12}>
          <p className=' text-md text-gray-300'>تاريخ النهاية</p>
            <span className=' text-lg'>{inviteDetails?.to_date?.split("T")[0]}</span>
          </Col>
         </Row>
         <div className=' flex gap-3 justify-end py-3 items-center'>
          <Button onClick={closeInviteModal} className=' hover:!text-[#000] hover:!border-[#ccc]'>اغلاق</Button>
         </div>
      </Modal>
    </>
  );
}

export default Customers
