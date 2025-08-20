import React from "react";
import {Edit, Trash} from "lucide-react";
import { Table, Button} from "antd";

interface TaskListProps {
  tasks?: any;
  onEdit: (record?: any) => void;
  onDelete: (record?: any) => void;
  isLoading:boolean;
}

const OrderList = ({
                    tasks,
  onEdit,
  onDelete,
                    isLoading
}: TaskListProps) => {

  const columns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Item Name & Description", dataIndex: "description", key: "description" },
    { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice"},
    { title: "QTY On Hand", dataIndex: "qtyOnHand", key: "qtyOnHand"},
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
          <div className="flex gap-2">
            <Button type="link"  size="small" icon={<Edit size={20} />} onClick={() => onEdit(record)} />
            <Button type="link" size="small" icon={<Trash size={20} />} danger onClick={() => onDelete(record)} />
          </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-md shadow-sm">
      <Table
          dataSource={tasks}
          columns={columns}
          rowKey="itemCode"
          pagination={false}
          loading={isLoading}
      />
    </div>
  );
};

export default OrderList;
