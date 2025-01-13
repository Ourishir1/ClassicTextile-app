import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  DeleteOutlined as DeleteIcon,
  Close as CancelIcon,
} from '@mui/icons-material';
import userService from '../../../Services/UserService';
import { User } from '../../../Models/User';
import { TypeOfCustomer } from '../../../Models/enums/TypeOfCustomer';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  isAdmin: boolean;
}

export default function UserManagement() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [editedRows, setEditedRows] = React.useState<Record<GridRowId, GridRowModel>>({});
  const navigate = useNavigate();

  // Decode token to check admin privileges
  const token = localStorage.getItem("token");
  let isAdmin: boolean | undefined;
  if (token) {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    isAdmin = decodedToken.isAdmin;
  }

  React.useEffect(() => {
    if (!isAdmin) {
      alert("Unauthorized access");
      navigate("/home");
      return;
    }

    userService
      .getAllUsers()
      .then((users: User[]) => {
        setRows(users); // Set users as rows in the grid
      })
      .catch((err) => {
        console.error('Error fetching users: ', err);
        alert(err.response?.data || 'Error fetching users');
      });
  }, [isAdmin, navigate]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = false;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    const updatedRow = rows.find((row) => row.id === id) as User; // Cast to User
    if (updatedRow) {
      userService
        .updateUser(updatedRow)
        .then((updatedUser) => {
          setRows((prevRows) =>
            prevRows.map((row) => (row.id === updatedUser.id ? updatedUser : row))
          );
          setRowModesModel((prevModel) => ({
            ...prevModel,
            [id]: { mode: GridRowModes.View },
          }));
        })
        .catch((err) => {
          console.error('Error saving user:', err);
          alert('Error saving user');
        });
    }
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        setRows(rows.filter((row) => row.id !== id));
        userService.deleteUserById(+id).then().catch()

        alert("User deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete fabric. Please try again.");
      }
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setEditedRows((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as User; // Explicitly cast to User
  
    // Update the rows state immediately
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
  
    // Return the updated row for the DataGrid to handle
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      type: 'number',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    { field: 'firstName', headerName: 'First name', width: 180, editable: true },
    { field: 'lastName', headerName: 'Last name', width: 180, editable: true },
    { field: 'email', headerName: 'Email', width: 180, editable: true },
    { field: 'phoneNumber', headerName: 'Phone number', width: 180, editable: true },
    {
      field: 'typeOfCustomer',
      headerName: 'Type of customer',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: [TypeOfCustomer.DESIGNER, TypeOfCustomer.REGULAR],
    },
    {
      field: 'isAdmin',
      headerName: 'Is Admin',
      width: 220,
      editable: true,
      type: 'boolean',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        background: 'linear-gradient(135deg, rgba(65, 63, 63, 0.9), rgba(65, 63, 63, 0.2))',
        borderRadius: '12px',
        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
        padding: '20px',
        paddingTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(5px)',
        '& .MuiDataGrid-root': {
          backgroundColor: 'transparent',
          borderRadius: '12px',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          color: '#000',
          fontWeight: 600,
        },
        '& .MuiDataGrid-cell': {
          color: '#000',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '& .MuiDataGrid-row': {
          transition: 'background-color 0.3s ease',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          color: '#000',
        },
        '& .MuiDataGrid-pagination': {
          color: '#000',
        },
      }}
    >
      <h1>All the users</h1>
      <br />
      <DataGrid
        rows={rows.map((row) => editedRows[row.id] || row)} // Use editedRows first
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
      />
    </Box>
  );
}
