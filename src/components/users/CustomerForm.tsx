import React, {useEffect, useState} from "react";
import {Form, Input, Button, Row, Col, Modal} from "antd";
import { User, Mail } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {toast} from "react-toastify";
import {editCustomer, saveCustomer} from "../../services/customer-services/CustomerServices";


interface UserFormProps {
    isFormOpen:boolean;
    toggleModal:()=>void;
    user?: any;
    isEditing?: boolean;
    getAllTableCustomers:()=>void;
}

const CustomerForm: React.FC<UserFormProps> = ({
                                               isFormOpen,
                                               toggleModal,
                                               user,
                                               isEditing ,
                                               getAllTableCustomers
                                           }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: true,
            });
        }
    }, [user, form]);

    const handleSubmit = async (values: any) => {
        if (user?.customerId){
           try {
               const data:any = {
                   customerId:user?.customerId,
                   ...values
               }
               setIsLoading(true);
               await editCustomer(user?.customerId,data);
               getAllTableCustomers();
               toast.success("Customer updated successfully!");
               form.resetFields();
               toggleModal();
           }catch (error){
               toast.error('Internal server error');
           }finally {
               setIsLoading(false);
           }
        }else {
            try {
                setIsLoading(true);
                await saveCustomer(values);
                 getAllTableCustomers();
                toast.success("Customer created successfully!");
                form.resetFields();
                toggleModal();
            }catch (error){
                toast.error('Internal server error');
            }finally {
                setIsLoading(false);
            }
        }

    };


    return (
        <Modal
            title={isEditing ? "Edit Customer" : "Create New Customer"}
            style={{ top: 10 }}
            open={isFormOpen}
            onCancel={toggleModal}
            footer={null}
        >
        <Form className="w-full mx-auto" form={form} onFinish={handleSubmit} layout="vertical">
            <Row>
                <Col xs={24}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter the first name" }]}
                    >
                        <Input prefix={<User size={18} />} placeholder="Enter first name" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter a valid email" },
                            { type: "email", message: "Please enter a valid email address" }
                        ]}
                    >
                        <Input prefix={<Mail size={18} />} placeholder="Enter email address" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[
                            { required: true, message: "Please enter your phone number" },
                            {
                                pattern: /^\+?[1-9]\d{1,14}$/,
                                message: "Please enter a valid phone number",
                            },
                        ]}
                    >
                        <PhoneInput
                            country={"lk"}
                            inputClass="ant-input"
                            enableSearch={true}
                            placeholder="Enter phone number"
                            specialLabel=""
                            containerStyle={{ width: "100%" }}
                            inputStyle={{ width: "100%" }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: "Please enter the address" }]}
                    >
                        <Input prefix={<User size={18} />} placeholder="Enter address" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Form.Item
                        label="Account No"
                        name="accountNo"
                        rules={[{ required: true, message: "Please enter the account no" }]}
                    >
                        <Input prefix={<User size={18} />} placeholder="Enter account no" />
                    </Form.Item>
                </Col>
            </Row>
            <Row className="flex justify-end items-center">
                <Col xs={24} sm={12} className="sm:mt-10">
                    <Form.Item className="flex justify-end">
                        <Button loading={isLoading} color="default" variant="solid" htmlType="submit"
                                iconPosition="end"
                        >
                            {isEditing ? "Update Customer" : "Create Customer"}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        </Modal>
    );
};

export default CustomerForm;
