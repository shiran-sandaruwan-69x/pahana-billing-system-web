import React, {useEffect, useState} from "react";
import {Form, Input, Button, Row, Col, Modal} from "antd";
import {toast} from "react-toastify";
import {editItem, saveItem} from "../../services/item-services/ItemServices";
const { TextArea } = Input;

interface TaskFormProps {
    isFormOpen:boolean;
    toggleModal:()=>void;
    isEditing?: boolean;
    task:any;
    getItems:()=>void;
}
const ItemForm: React.FC<TaskFormProps> = ({
                                               isFormOpen,
                                               toggleModal,
                                               isEditing,
                                               task,
                                               getItems
                                           }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

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

    // create and update item
    const handleSubmit = async (values: any) => {
        const formattedValues: any = {
            itemCode:task?.itemCode,
            ...values
        };
        if (task?.itemCode) {
            try {
                setIsLoading(true);
                await editItem(task?.itemCode,formattedValues);
                getItems();
                toast.success('Updated successfully!');
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
                await saveItem(values);
                getItems();
                toast.success('Created successfully!');
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
            title={isEditing ? "Edit Item" : "Create New Item"}
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
                            label="Item Name And Description"
                            name="description"
                            rules={[{ required: true, message: "Please enter the item name and description" }]}
                        >
                            <TextArea rows={4} placeholder="Enter item name and description" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24}>
                        <Form.Item
                            label="Unit Price"
                            name="unitPrice"
                            rules={[{ required: true, message: "Please enter the unit price" }]}
                        >
                            <Input type="number" step="0.01" placeholder="Enter unit price" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24}>
                        <Form.Item
                            label="Qty On Hand"
                            name="qtyOnHand"
                            rules={[{ required: true, message: "Please enter the qty on hand" }]}
                        >
                            <Input type="number" placeholder="Enter qty on hand" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row className="flex justify-end items-center">
                    <Col xs={24} sm={12} className="sm:mt-10">
                        <Form.Item className="flex justify-end">
                        <Button loading={isLoading} color="default" variant="solid" htmlType="submit">
                            {isEditing ? "Update Item" : "Create Item"}
                        </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ItemForm;
