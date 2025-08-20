import React, { useState, useEffect } from "react";
import {Plus} from "lucide-react";
import {Button, Input, Pagination, Col, Row, Modal, Table} from "antd";
import OrderList from "./orderList";
import OrderForm from "./orderForm";
import {toast} from "react-toastify";
import DeleteAlertModal from "../common-comp/DeleteAlertModal";
import {deleteItem, getAllItems} from "../../services/item-services/ItemServices";
import {getAllOrders, printBill} from "../../services/order-services/OrderServices";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const OrderManagement: React.FC  = () => {
  const [isTableLoading, setTableLoading] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [allTasks, setAllTasks] = useState( []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [billData, setBillData] = useState<any>(null);

  const toggleModal = () => setIsFormOpen(!isFormOpen);

  useEffect(() => {
    getPlaceOrders();
  }, []);

  const handleCreateTask = () => {
    setEditingTask(null);
    toggleModal();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPlaceOrders = async ()=>{
    try {
      const response:any = await getAllOrders();
      console.log('response',response)
      setAllTasks(response?.orders);
    }catch (error){
      toast.error('Internal server error');
    }
  }

  const generatePDF = (bill: any, orderId?: string) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Bill for Order ${orderId}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${bill.customerName}`, 14, 30);
    doc.text(`Total: Rs ${bill.fullTotal?.toFixed(2)}`, 14, 38);

    const tableData = bill.orderDetails?.map((item: any) => [
      item.itemNo,
      item.qty,
      item.itemPrice,
      item.price,
    ]) || [];

    autoTable(doc, {
      startY: 50,
      head: [["Item No", "Qty", "Unit Price", "Total"]],
      body: tableData,
    });

    doc.save(`Bill-${orderId}.pdf`);
  };

  const viewBill = async (orderId?: string) => {
    try {
      const response: any = await printBill(orderId);
      console.log("response", response);

      const bill = response ?? {};
      setBillData(bill);

      Modal.info({
        title: `Bill for Order ${orderId}`,
        content: (
            <div>
              <p>
                <strong>Customer:</strong> {bill.customerName}
              </p>
              <p>
                <strong>Total:</strong> Rs : {bill.fullTotal?.toFixed(2)}
              </p>
              <Table
                  dataSource={bill.orderDetails}
                  columns={[
                    { title: "Item No", dataIndex: "itemNo", key: "itemNo" },
                    { title: "Qty", dataIndex: "qty", key: "qty" },
                    { title: "Unit Price", dataIndex: "itemPrice", key: "itemPrice" },
                    { title: "Total", dataIndex: "price", key: "price" },
                  ]}
                  pagination={false}
                  rowKey="itemNo"
              />
            </div>
        ),
        width: 600,
        footer: [
          <div className="flex justify-end items-center mt-10">
            <Button
                key="download"
                color="default" variant="solid"
                onClick={() => generatePDF(bill, orderId)}
            >
              Print Bill
            </Button>,
            <Button className="ml-2" key="close" onClick={() => Modal.destroyAll()}>
              Close
            </Button>,
          </div>
        ],
      });
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  return (
      <div className="container mx-auto p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Orders Management</h1>

        <div className="flex justify-between items-center mb-6">
          <Row className="w-full flex gap-1">
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="flex justify-end">
              <Button onClick={handleCreateTask} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Order
              </Button>
            </Col>
          </Row>
        </div>

        <OrderList
            tasks={allTasks}
            viewBill={viewBill}
            isLoading={isTableLoading}
        />

        <div className="flex justify-center mt-4">
          <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={allTasks?.length}
              onChange={handlePageChange}
              showSizeChanger={false}
          />
        </div>

        {isFormOpen && (
            <OrderForm
                isFormOpen={isFormOpen}
                toggleModal={toggleModal}
                isEditing={false}
                task={editingTask}
                getPlaceOrders={getPlaceOrders}
            />
        )}

      </div>
  );
};

export default OrderManagement;
