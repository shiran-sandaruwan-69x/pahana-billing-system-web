import * as url from './customer_url_helper';
import {get, post} from "../ServiceMethods";

export const getAllCustomers = (data:any) => get(`${url.CUSTOMER_URL}`);
export const saveCustomer = (data:any) => post(`${url.CUSTOMER_URL}/add`, data);
export const editCustomer = (customerId:string,data:any) => post(`${url.CUSTOMER_URL}/edit?id=${customerId}`, data);
export const deleteCustomer = (customerId:string) => get(`${url.CUSTOMER_URL}/delete?id=${customerId}`);

