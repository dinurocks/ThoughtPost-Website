import axios from "axios";
// const FormData = require("form-data");

const baseURL = "http://localhost:3003/";

export const getUsers = () => {
  return axios.get(baseURL + "getSomething");
};

export const getUsersByID = (id) => {
  return axios.get(baseURL + "getUserId", { params: { id } });
};

export const addUser = (data) => {
  return axios.post(baseURL + "postSomething", data);
};

export const checkUserMobPassword = (data) => {
  return axios.put(baseURL + "loginCheck", data);
};

export const feedpost = (formData) => {
  // const config = {
  //   headers: { "Content-Type": "multipart/form-data" },
  //   formData,
  // };
  return axios.post(baseURL + "feedPost", formData);
};

export const showUserPost = () => {
  return axios.get(baseURL + "getUserPosts");
};

export const delUser = (id) => {
  return axios.delete(baseURL + "deleteUser", { data: { id } });
};

export const likePost = (data) => {
  return axios.post(baseURL + "likePost", data);
};

export const getLikePost = () => {
  return axios.get(baseURL + "getLikePost");
};

export const updatePostLike = (data) => {
  return axios.post(baseURL + "updatePostLike", data);
};

export const updateFollowUsers = (data) => {
  return axios.post(baseURL + "updateUserFollowing", data);
};

export const updateSharedPosts = (data) => {
  return axios.post(baseURL + "updateSharedPosts", data);
};

export const profileInfo = (id) => {
  return axios.get(baseURL + "profileInfo", { params: { id } });
};

export const updateProfileInfo = (newFd) => {
  return axios.post(baseURL + "updateProfileInfo", newFd);
};

export const updatePostUserName = (id, name, userPhoto) => {
  return axios.get(baseURL + "updatePostUserName", {
    params: { id, name, userPhoto },
  });
};

export const updateUserFollowingName = (id, name) => {
  return axios.get(baseURL + "updateUserFollowingName", {
    params: { id, name },
  });
};

export const updateUserSharedName = (id, name) => {
  return axios.get(baseURL + "updateUserSharedName", {
    params: { id, name },
  });
};
