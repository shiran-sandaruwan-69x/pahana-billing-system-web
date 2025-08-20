import React from "react";
import {Receipt} from "lucide-react";
import { Table, Button} from "antd";

interface TaskListProps {
  tasks?: any;
  viewBill: (orderId?: string) => void;
  isLoading:boolean;
}

const OrderList = ({
                    tasks,
                       viewBill,
                    isLoading
}: TaskListProps) => {

  const columns = [
    { title: "Customer ID", dataIndex: "customerId", key: "customerId" },
    { title: "Customer Name & Description", dataIndex: "customerName", key: "customerName" },
    { title: "Order ID", dataIndex: "orderId", key: "orderId"},
    { title: "Order Date", dataIndex: "date", key: "date"},
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
          <div className="flex gap-2">
            <Button type="link"  size="small" icon={<Receipt size={20} />} onClick={() => viewBill(record?.orderId)} />
          </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-md shadow-sm">
      <Table
          dataSource={tasks}
          columns={columns}
          rowKey="orderId"
          pagination={false}
          loading={isLoading}
      />
    </div>
  );
};

export default OrderList;
