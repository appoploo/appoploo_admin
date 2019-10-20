import { createAction } from "redux-actions"
import { LOGIN, LOGOUT, UPDATE_TOKEN } from "../names"

export const login = createAction(LOGIN)
export const logout = createAction(LOGOUT)
export const updateToken = createAction(UPDATE_TOKEN)
