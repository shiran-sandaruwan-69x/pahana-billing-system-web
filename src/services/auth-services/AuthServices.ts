import * as url from './auth_url_helper';
import {SignInType} from "../../auth/auth-types/AuthTypes";
import {post} from "../ServiceMethods";

export const signIn = (data:SignInType) => post(`${url.SIGN_IN}`, data);

