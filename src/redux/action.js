// eslint-disable-next-line
import {SET_USER,DELETE_USER,EDIT_COMMENT,DELETE_COMMENT} from './actionType'

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

const editComment = (comment) => ({
  type: EDIT_COMMENT,
  payload: {
    comment
  }
})


export {setUser,deleteUser,editComment}