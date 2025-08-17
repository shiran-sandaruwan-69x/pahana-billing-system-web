import * as url from './order_url_helper';
import {get, post} from "../ServiceMethods";

export const getAllOrders = () => get(`${url.ORDER_URL}`);
export const saveOrder = (data:any) => post(`${url.ORDER_URL}/place`, data);
export const printBill = (orderId:string) => get(`${url.ORDER_URL}/bill?orderId=${orderId}`);

