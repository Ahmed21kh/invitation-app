import axios from "axios"


export const addCustomerApi = async (obj) => {
 const {data} =await axios.post(`/api/add-customer`,obj);
return data
}

export const addInviteApi = async (obj) => {
    const {data} = await axios.post('/api/add-invitation',obj);
    return data
}

export const getInvitationsApi = async () => {
    const {data} = await axios.get(`/api/all-invitations`);
    return data
}

export const getCustomersApi = async () => {
    const {data} = await axios.get(`/api/all-customers`);
    return data
}

export const getAllCustomersApi = async (num,size,x) => {
    const {data} = await axios.get(`/api/get-customers?page=${num}&limit=${size}${x}`);
    return data
}
export const addInviteTransactionApi = async (obj) => {
    const {data} = await axios.post('/api/add-invitation_transaction',obj);
    return data
}

export const getInviteTransactionApi = async (num,size,x) => {
    const {data} = await axios.get(`/api/get-invitation_transactions?page=${num}&limit=${size}${x}`);
    return data
}