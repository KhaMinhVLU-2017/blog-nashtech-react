import {SET_USER,DELETE_USER} from '../actionType'

let initialState = {
  fullname: localStorage.getItem('_Fullname')||'',
  token: localStorage.getItem('_Token')||''
}

export default function(state=initialState, action) {
  switch(action.type) {
    case SET_USER:
      let {fullname,token} = action.payload
      return {
        ...state,
        fullname,
        token
      }
    case DELETE_USER:
      try {
        localStorage.clear()
      }catch(e){
        console.log(e)
      }
      return {
        ...state,
        fullname:'',
        token:''
      }
    default:
      return state
  }
}