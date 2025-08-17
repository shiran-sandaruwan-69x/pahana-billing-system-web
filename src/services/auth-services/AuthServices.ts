import * as url from './auth_url_helper';
import {post} from "../ServiceMethods";

export const signIn = (data:any) => post(`${url.SIGN_IN}`, data);

