import {EDIT_COMMENT,DELETE_COMMENT} from '../actionType'
import { stat } from 'fs';

let initialState = {
  comments:[]
}
// Todo Write for Comment. But I use traditional method for lightweigh
// Technology Redux-Thunk for Comment  "Test Thunk middleware"
export default function (state = initialState, action){
  switch(action.type) {
    case EDIT_COMMENT:
      let {comment} = action.payload
      return {
        ...state,
        comments: [...state.comments,comment]
      }
    case DELETE_COMMENT:
      return {
        ...state
      }
    default:
      return state
  }
}