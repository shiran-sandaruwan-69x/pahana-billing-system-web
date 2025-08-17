import React, { useState, useEffect } from "react";
import {Plus} from "lucide-react";
import {Button, Input, Pagination, Col, Row} from "antd";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";
import {toast} from "react-toastify";
import DeleteAlertModal from "../common-comp/DeleteAlertModal";
import {deleteItem, getAllItems} from "../../services/item-services/ItemServices";


const ItemManagement: React.FC  = () => {
  const [isTableLoading, setTableLoading] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [deleteTask, setDeleteTask] = useState<any>(null);
  const [allTasks, setAllTasks] = useState( []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const toggleModal = () => setIsFormOpen(!isFormOpen);
  const toggleEditModal = () => setIsEditFormOpen(!isEditFormOpen);
  const toggleDeleteModal = () => setIsDeleteDialogOpen(!isDeleteDialogOpen);

  useEffect(() => {
    getItems();
  }, []);

  const handleCreateTask = () => {
    setEditingTask(null);
    toggleModal();
  };

  const handleEditTask = (record: any) => {
    setEditingTask(record);
    toggleEditModal();
  };

  const handleDeleteTask = (record: any) => {
    setDeleteTask(record);
    toggleDeleteModal();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const confirmDelete = async () => {
    toggleDeleteModal();
    try {
      const id:string = deleteTask?.itemCode ?? null;
      await deleteItem(id);
      getItems();
    }catch (error){
      toast.error('Internal server error');
    }
  };

  const getItems = async ()=>{
    try {
      const response:any = await getAllItems();
      setAllTasks(response?.items);
    }catch (error){
      toast.error('Internal server error');
    }
  }



  return (
      <div className="container mx-auto p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Items Management</h1>

        <div className="flex justify-between items-center mb-6">
          <Row className="w-full flex gap-1">
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="flex justify-end">
              <Button onClick={handleCreateTask} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Item
              </Button>
            </Col>
          </Row>
        </div>

        <ItemList
            tasks={allTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
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
            <ItemForm
                isFormOpen={isFormOpen}
                toggleModal={toggleModal}
                isEditing={false}
                task={editingTask}
                getItems={getItems}
            />
        )}

        {isEditFormOpen && (
            <ItemForm
                isFormOpen={isEditFormOpen}
                toggleModal={toggleEditModal}
                isEditing
                task={editingTask}
                getItems={getItems}
            />
        )}

        {isDeleteDialogOpen && (
            <DeleteAlertModal
                isFormOpen={isDeleteDialogOpen}
                toggleModal={toggleDeleteModal}
                confirmDelete={confirmDelete}
                message="Are you sure you want to delete this Item?"
            />
        )}

      </div>
  );
};

export default ItemManagement;
