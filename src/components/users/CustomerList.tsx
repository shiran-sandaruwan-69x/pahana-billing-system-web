import React from "react";
import { Table, Button} from "antd";
import { Edit, Trash } from "lucide-react";

interface UserListProps {
  users?: any[];
  onEdit?: (user: any) => void;
  onDelete?: (user: any) => void;
  isLoading:boolean;
}
const CustomerList: React.FC<UserListProps> = ({
                                             users = [],
                                             onEdit = () => {},
                                             onDelete = () => {},
                                               isLoading
                                           }) => {
  const columns = [
    { title: "Customer ID", dataIndex: "customerId", key: "customerId" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
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
            dataSource={users}
            columns={columns}
            rowKey="customerId"
            pagination={false}
            loading={isLoading}
        />
      </div>
  );
};

export default CustomerList;
