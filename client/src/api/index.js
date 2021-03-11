import axios from 'axios'


export const signUp = (formData) => axios.post("http://localhost:8080/users/signup/", formData)
export const saveUser = (token) => axios.post("http://localhost:8080/users/saveuser/", token)
export const signIn = (formData) => axios.post("http://localhost:8080/users/signin/", formData)

export const GoogleSignIn = (formData) => axios.post("http://localhost:8080/users/google-signin/", formData)
export const FacebookSignIn = (formData) => axios.post("http://localhost:8080/users/facebook-signin/", formData)

export const forgetpassword = (formData) => axios.post("http://localhost:8080/users/forget-password/", formData)
export const resetpassword = (formData) => axios.post("http://localhost:8080/users/reset-password/", formData)

export const getprofile = (formData) => axios.get("http://localhost:8080/users/get-profile/", formData)
export const updateprofile = (formData) => axios.patch("http://localhost:8080/users/update-profile/", formData)