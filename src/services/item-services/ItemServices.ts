import * as url from './item_url_helper';
import {get, post} from "../ServiceMethods";

export const getAllItems = (data:any) => get(`${url.ITEM_URL}`);
export const saveItem = (data:any) => post(`${url.ITEM_URL}/add`, data);
export const editItem = (itemId:string,data:any) => post(`${url.ITEM_URL}/edit?id=${itemId}`, data);
export const deleteItem = (itemId:string) => get(`${url.ITEM_URL}/delete?id=${itemId}`);

