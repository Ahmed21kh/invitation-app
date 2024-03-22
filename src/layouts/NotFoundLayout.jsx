import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundLayout = () => {
    const navigate = useNavigate()
  return (
    <section className="flex items-center justify-center h-screen p-16 bg-gray-50 dark:bg-gray-700">
    <div className="container flex flex-col items-center ">
        <div className="flex flex-col gap-6 max-w-md text-center">
            <h2 className="font-extrabold text-9xl text-gray-600 dark:text-gray-100">
                <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl md:text-3xl dark:text-gray-300">.للاسف هذه الصفحة غير متوفرة</p>
            <Button onClick={()=>navigate('/')} type='primary' size='large' className="!px-8 !h-[50px] !py-1 !text-xl !font-semibold !rounded-md !bg-violet-600  !text-gray-50 hover:!bg-violet-500">الرجوع للرئيسية</Button>
        </div>
    </div>
</section>
  )
}

export default NotFoundLayout