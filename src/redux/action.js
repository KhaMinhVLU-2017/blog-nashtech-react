// eslint-disable-next-line
import {SET_USER,DELETE_USER} from './actionType'

const setUser = (fullname,token) => ({
  type: SET_USER,
  payload: {
    fullname,
    token
  }
})

const deleteUser = ()=>({
  type: DELETE_USER
})



export {setUser,deleteUser}