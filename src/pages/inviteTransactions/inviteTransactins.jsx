import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Divider, Input, Modal, Pagination, Radio, Row, Table, Tooltip, message } from 'antd';
import { MdInfo, MdInfoOutline, MdWhatsapp } from 'react-icons/md';
import { getInviteTransactionApi } from '../../services/Apis';
import "./inviteTransactins.css"
import { Context } from '../../context/AppContext';
function InviteTransactins() {
    const [selectionType, setSelectionType] = useState('checkbox');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviteTransactions, setinviteTransactions] = useState([])
    const [loadingData, setloadingData] = useState(false)
    const [pageSize, setpageSize] = useState(5)
    const [pageNumber, setpageNumber] = useState(1)
    const [totalPages, settotalPages] = useState(0)
    const [inviteDetailsModal, setinviteDetailsModal] = useState(false)
    const [inviteDetails, setinviteDetails] = useState({})
     const {
        setChecklist,
        checklist,
        handleSendMessage,
        loadingBtn,
        socket
     } = useContext(Context)
useEffect(() => {
    if (socket) {
     socket.on("updatedData",(data) => {
        setinviteTransactions(prev =>[...prev.map((d)=>d._id === data._id?{...d,sending_status:data?.sending_status}:d)])
     })   
    }
}, [socket])

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
     console.log(inviteTransactions);
    }, [inviteTransactions])
    const getAllinviteTransactions = () =>{
      try {
        setloadingData(true)
        getInviteTransactionApi(pageNumber,pageSize).then((res)=>{
          console.log(res);
          let newData = res[0]?.data?.map((e,i)=>{return{key:i,...e}})
          let total = res[0]?.metaData[0]?.totalPages
          setinviteTransactions(newData)
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
  
    const handleCheckboxChange =(data)=>{
     console.log(data);
     setChecklist([...data?.filter((d)=>d.sending_status == "not_sent")?.map((e)=>{return {[e.customerDetails.customer_mobile]:`السيد ${e.customerDetails.customer_name} انت مدعو لحضور ${e.inviteDetails.invite_desc}` , id:e._id }})])
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
    useEffect(() => {
    getAllinviteTransactions()
    }, [pageNumber])
  
  
    const columns = [
      {
        title: 'اسم العميل',
        render:(records) => <span>{records?.customerDetails?.customer_name}</span>
      },
      {
        title: 'رقم الهاتف',
        render:(records) => <span>{records?.customerDetails?.customer_mobile}</span>
      },
      {
        title: 'الدعوة',
        render:(records) => <span>{records?.inviteDetails?.invite_name}</span>
      },
      {
        title: 'تاريخ نهاية الدعوة',
        render:(records) => <span>{records?.inviteDetails?.to_date?.split('T')[0]}</span>
    
      },
      {
        title: 'حالة الحضور',
        dataIndex: 'attendance_status',
        render:(record)=> <span className={`${record == 'attend'?'text-[green]':'text-[red]'}`}>{record == 'attend'?'تم الحضور':'لم يحضر'}</span>
      },
      {
        title: 'حالة الارسال',
        dataIndex: 'sending_status',
        render:(record)=> <span className={`${record == 'sent'?'text-[green]':'text-[red]'}`}>{record == 'sent'?'تم الارسال':'لم يرسل اليه'}</span>
    
      },
      {
        title: '',
        render:(record) => <span onClick={()=>openInviteModal(record?.inviteDetails)} className=' cursor-pointer !w-full flex justify-start items-center'>
          <Tooltip title="تفاصيل الدعوة">
    
          <MdInfoOutline fontSize={22} className=' text-violet-600'/>
          </Tooltip>
        </span>
      },
    ];
    
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        handleCheckboxChange(selectedRows)
      },
      getCheckboxProps: (record) => ({
        disabled: record.sending_status === 'sent',
        // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <>
      <div className=' w-full px-5'>
        <div className=' my-4'>
          <Button loading={loadingBtn} onClick={handleSendMessage}  type='primary' size='large' className='  bg-violet-600 flex items-center hover:!bg-violet-500' icon={<MdWhatsapp fontSize={20}/>}>ارسال</Button>
        </div>
        <Table
         loading={loadingData}
          pagination={false}
          direction='rtl'
          style={{direction:'rtl'}}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          className=' shadow-lg'
          columns={columns}
          dataSource={inviteTransactions}
        />
        <div className=' bg-white p-3' dir='rtl'>
        <Pagination style={{direction:'ltr'}} responsive onChange={changePage} defaultCurrent={pageNumber} total={totalPages} />
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

export default InviteTransactins