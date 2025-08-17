import React, {useState, useEffect} from "react";
import {Button, Pagination, Row, Col} from "antd";
import {Plus} from "lucide-react";
import CustomerList from "./CustomerList";
import CustomerForm from "./CustomerForm";
import {toast} from "react-toastify";
import DeleteAlertModal from "../common-comp/DeleteAlertModal";
import {deleteCustomer, getAllCustomers} from "../../services/customer-services/CustomerServices";

const CustomerManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isTableLoading, setTableLoading] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const toggleModal = () => setIsFormOpen(!isFormOpen);
  const toggleEditModal = () => setIsEditFormOpen(!isEditFormOpen);
  const toggleDeleteModal = () => setIsDeleteDialogOpen(!isDeleteDialogOpen);

  useEffect(() => {
    getAllTableCustomers();
  }, []);

  const handleAddUser = () => {
    toggleModal();
  };

  const handleEditUser = (user: any) => {
    setEditUser(user);
    toggleEditModal();
  };

  const handleDeleteUser = (user: any) => {
    setDeleteUser(user);
    toggleDeleteModal();
  };

  const confirmDelete = async () => {
    toggleDeleteModal();
    try {
      const id:string = deleteUser?.customerId ?? null;
      await deleteCustomer(id);
      getAllTableCustomers();
      toast.success("Customer deleted successfully!");
    }catch (error){
      toast.error('Internal server error');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getAllTableCustomers = async ()=>{
    setTableLoading(true);
   try{
     const response:any = await getAllCustomers();
     console.log('response cc',response)
    setUsers(response?.customers);
   }catch (error){
     toast.error('Internal server error');
   }finally {
     setTableLoading(false);
   }
  };

  return (
      <div className="container mx-auto p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Customer Management</h1>

        <div className="flex justify-between items-center mb-6">
          <Row className="w-full flex gap-1">
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="flex justify-end">
              <Button
                  onClick={handleAddUser}
                  className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Create Customer
              </Button>
            </Col>
          </Row>
        </div>

        <CustomerList
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            isLoading={isTableLoading}
        />

        <div className="flex justify-center mt-4">
          <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={users?.length}
              onChange={handlePageChange}
              showSizeChanger={false}
          />
        </div>

        {isFormOpen && (
            <CustomerForm
                isFormOpen={isFormOpen}
                toggleModal={toggleModal}
                user={null}
                isEditing={false}
                getAllTableCustomers={getAllTableCustomers}
            />
        )}

        {isEditFormOpen && (
            <CustomerForm
                isFormOpen={isEditFormOpen}
                toggleModal={toggleEditModal}
                user={editUser}
                isEditing
                getAllTableCustomers={getAllTableCustomers}
            />
        )}

        {isDeleteDialogOpen && (
            <DeleteAlertModal
                isFormOpen={isDeleteDialogOpen}
                toggleModal={toggleDeleteModal}
                confirmDelete={confirmDelete}
                message="Are you sure you want to delete this customer?"
            />
        )}

      </div>
  );
};

export default CustomerManagement;
