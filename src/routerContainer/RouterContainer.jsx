import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import AddCustomer from '../pages/addCustomer/addCustomer'
import AddInvitation from '../pages/addInvitation/addInvitation'
import Customers from '../pages/customers/customers'
import InviteTransactins from '../pages/inviteTransactions/inviteTransactins'
import AddInviteTransaction from '../pages/addInviteTransaction/addInviteTransaction'
import NotFoundLayout from '../layouts/NotFoundLayout'

const RouterContainer = () => {
  return (
   <Routes>
    <Route element={<DashboardLayout/>}>
    <Route path='/' element={<Navigate to={'/add-customer'}/>} />
     <Route path='/add-customer' element={<AddCustomer/>} />
     <Route path='/add-inviteTransaction' element={<AddInviteTransaction/>} />
     <Route path='/add-invite' element={<AddInvitation/>} />
     <Route path='/customers' element={<Customers/>} />
     <Route path='/inviteTransactions' element={<InviteTransactins/>} />
    </Route>
    <Route path='*' element={<NotFoundLayout/>}/>
   </Routes>
  )
}

export default RouterContainer
