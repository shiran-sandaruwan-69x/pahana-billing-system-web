import React, {useEffect, useState} from "react";
import {Form, Input, Button, Row, Col, Modal, Select} from "antd";
import {toast} from "react-toastify";
import {editItem, getAllItems, saveItem} from "../../services/item-services/ItemServices";
import {getAllCustomers} from "../../services/customer-services/CustomerServices";
import {saveOrder} from "../../services/order-services/OrderServices";
const { TextArea } = Input;

interface OderFormProps {
    isFormOpen:boolean;
    toggleModal:()=>void;
    isEditing?: boolean;
    task:any;
    getItems:()=>void;
}
const { Option } = Select;
const OrderForm: React.FC<OderFormProps> = ({
                                               isFormOpen,
                                               toggleModal,
                                               isEditing,
                                               task,
                                               getItems
                                           }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [items, setItems] = useState<any>([]);
    useEffect(() => {
        if (task) {
            form.setFieldsValue({
                ...task
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: true,
            });
        }
    }, [task, form]);

    useEffect(()=>{
        fetchCustomers();
        fetchItems();
    },[])

    const fetchCustomers = async () => {
        try {
            const response:any = await getAllCustomers();
            if (Array.isArray(response?.customers) && response?.customers.length > 0){
                const data:any = response?.customers.map((item:any)=>({
                    label:item.name,
                    value:item.customerId,
                }))
                setCustomers(data);
            }
        } catch (error) {
            toast.error('Internal server error');
        }
    };

    const fetchItems = async () => {
        try {
            const response:any = await getAllItems();
            if (Array.isArray(response?.items) && response?.items.length > 0){
                const data:any = response?.items.map((item:any)=>({
                label:item.description,
                value:item.itemCode,
                }))
                setItems(data);
            }

        } catch (error) {
            toast.error('Internal server error');
        }
    };

    // create order
    const handleSubmit = async (values: any) => {
        console.log('values',values)
        const formattedValues: any = {
            customerId:values.customer,
            orderDetails: values.orderDetails.map((detail: any) => ({
                itemCode: detail.itemCode,
                qty: parseInt(detail.qty as any),
                unitPrice: parseFloat(detail.unitPrice as any),
            })),
        };
        try {
            setIsLoading(true);
            await saveOrder(formattedValues);
            getItems();
            toast.success('Order place successfully!');
            form.resetFields();
            toggleModal();
        }catch (error){
            toast.error('Internal server error');
        }finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title={isEditing ? "Edit Order" : "Create New Order"}
            style={{ top: 20 }}
            open={isFormOpen}
            onCancel={() => toggleModal()}
            footer={null}
            width={800}
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical" className="w-full mx-auto">

                <Row>
                    <Col xs={24}>
                        <Form.Item
                            label="customerId"
                            name="customer"
                            rules={[{ required: true, message: 'Please select a customer!' }]}
                        >
                            <Select placeholder="Select a user to assign">
                                {customers.map((item:any) => (
                                    <Option key={item.value} value={item.value}>
                                        {`${item?.label} - ${item?.value}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24}>
                        <Form.List name="orderDetails" rules={[{ validator: async (_, details) => {
                                if (!details || details.length === 0) {
                                    return Promise.reject(new Error('At least one item is required!'));
                                }
                            } }]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="flex gap-4 mb-4">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'itemCode']}
                                                rules={[{ required: true, message: 'Please select an item!' }]}
                                                className="flex-1"
                                            >
                                                <Select placeholder="Select Item">
                                                    {items.map((item:any) => (
                                                        <Select.Option key={item.value} value={item.value}>
                                                            {item.label} ({item.value})
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'qty']}
                                                rules={[{ required: true, message: 'Please input a valid quantity!' }]}
                                                className="flex-1"
                                            >
                                                <Input type="number" placeholder="Quantity" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'unitPrice']}
                                                rules={[{ required: true, message: 'Please input a valid unit price!' }]}
                                                className="flex-1"
                                            >
                                                <Input type="number" step="0.01" placeholder="Unit Price" />
                                            </Form.Item>
                                            <Button danger onClick={() => remove(name)}>Remove</Button>
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block>
                                        Add Item
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Col>
                </Row>

                <Row className="flex justify-end items-center">
                    <Col xs={24} sm={12} className="sm:mt-10">
                        <Form.Item className="flex justify-end">
                        <Button loading={isLoading} color="default" variant="solid" htmlType="submit">
                            {isEditing ? "Update Order" : "Create Order"}
                        </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default OrderForm;
