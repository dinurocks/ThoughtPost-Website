import axios from 'axios';

const baseURL="http://localhost:3003/";

export const getUsers=() => {
    return axios.get(baseURL+"getSomething");
}

export const getUsersByID=(id) => {
    return axios.get(baseURL+"getUserId", {params:{id}});
} 

export const addUser=(data)=>{
    return axios.post(baseURL+"postSomething",data);
}

export const checkUserMobPassword=(data) => {
    return axios.put(baseURL+"loginCheck", data)
}
// export const delUser = (id) => {
//     return axios.delete(baseURL+"deleteSomething", {data: {id}});
// }

// export const editUser = (data) => {
//     return axios.put(baseURL+"putSomething", data);
// }
