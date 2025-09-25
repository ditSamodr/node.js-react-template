import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
} from '@mui/material';
import {
  DataGrid,
  GridApi,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridSlots,
  useGridApiRef,
} from '@mui/x-data-grid';
import CustomDataGridFooter from 'components/common/table/CustomDataGridFooter';
import CustomDataGridHeader from 'components/common/table/CustomDataGridHeader';
import CustomDataGridNoRows from 'components/common/table/CustomDataGridNoRows';
import dayjs from 'dayjs';
import SimpleBar from 'simplebar-react';
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';


// Define the type for a Lead
type Lead = {
  id: number;
  lead_name: string;
  lead_phone: string | null;
  lead_email: string | null;
  lead_address: string | null;
};

// Define the initial state for an empty lead
const emptyLead: Omit<Lead, 'id'> = {
  lead_name: '',
  lead_phone: null,
  lead_email: null,
  lead_address: null,
};

const CustomersPage = () => {
const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<Omit<Lead, 'id'>>(emptyLead);
  const [editId, setEditId] = useState<number | null>(null);
  const apiRef = useGridApiRef<GridApi>();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/leads`);
      const data: Lead[] = await res.json();
      setRows(data);
      apiRef.current.setRows(data);
    } catch (err) {
      // noop: could add a toast here
    } finally {
      setLoading(false);
    }
  }, [apiRef]);

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    apiRef.current.setQuickFilterValues([searchText]);
  }, [searchText, apiRef]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchText(value);
    if (value === '') {
      apiRef.current.setRows(rows);
    }
  };

  const handleOpenAdd = () => {
    setFormValues(emptyLead);
    setAddOpen(true);
  };

  const handleCloseAdd = () => setAddOpen(false);
  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value === '' ? null : value }));
  };

  const submitAdd = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      if (!res.ok) throw new Error('Failed to create');
      handleCloseAdd();
      await fetchLeads();
    } catch (_) {
      // noop
    }
  };

  const submitEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (editId == null) return;
    try {
      const res = await fetch(`${API_URL}/leads/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      if (!res.ok) throw new Error('Failed to update');
      handleCloseEdit();
      await fetchLeads();
    } catch (_) {
      // noop
    }
  };

  const handleDelete = async (id: GridRowId) => {
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchLeads();
    } catch (_) {
      // noop
    }
  };

  const beginEdit = (row: Lead) => {
    setEditId(row.id);
    setFormValues({
      lead_name: row.lead_name ?? '',
      lead_phone: row.lead_phone ?? '',
      lead_email: row.lead_email ?? '',
      lead_address: row.lead_address ?? '',
    });
    setEditOpen(true);
  };

  // Define the columns for the DataGrid
  const columns: GridColDef<Lead>[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'lead_name', headerName: 'Name', minWidth: 160, flex: 1 },
      { field: 'lead_phone', headerName: 'Phone', minWidth: 160, flex: 1 },
      { field: 'lead_email', headerName: 'Email', minWidth: 200, flex: 1 },
      { field: 'lead_address', headerName: 'Address', minWidth: 200, flex: 1 },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        filterable: false,
        width: 160,
        renderCell: (params: GridRenderCellParams<Lead>) => {
          return (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={() => beginEdit(params.row)}>
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ],
    [beginEdit, handleDelete],
  );

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
      >
        <Box />
        <Button variant="contained" onClick={handleOpenAdd}>
          Add Lead
        </Button>
      </Stack>

      <Box
        sx={{
          overflow: 'hidden',
          minHeight: 0,
          position: 'relative',
          height: { xs: 'auto', sm: 1 },
        }}
      >
        <DataGrid
          autoHeight={false}
          rowHeight={52}
          columns={columns}
          loading={loading}
          apiRef={apiRef}
          onResize={() => {
            apiRef.current.autosizeColumns({ includeOutliers: true, expand: true });
          }}
          hideFooterSelectedRowCount
          disableColumnResize
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          rowSelection={false}
          slots={{
            loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
            pagination: CustomDataGridFooter,
            toolbar: CustomDataGridHeader,
            noResultsOverlay: CustomDataGridNoRows,
          }}
          slotProps={{
            toolbar: {
              title: 'Leads',
              flag: 'leads',
              value: searchText,
              onChange: handleSearchChange,
              clearSearch: () => setSearchText(''),
            },
            pagination: { labelRowsPerPage: rows.length },
          }}
          initialState={{ pagination: { paginationModel: { page: 1, pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            boxShadow: 1,
            px: 3,
            borderColor: 'common.white',
            overflow: 'auto',
            height: 1,
            width: 1,
          }}
        />
      </Box>

      <Dialog
        open={addOpen}
        onClose={handleCloseAdd}
        fullWidth
        maxWidth="sm"
        component="form"
        onSubmit={submitAdd}
      >
        <DialogTitle>Add Lead</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'grid', gap: 2 }}>
          <TextField
            label="Name"
            name="lead_name"
            value={formValues.lead_name}
            onChange={handleFormChange}
            required
          />
          <TextField
            label="Phone Number"
            name="lead_phone"
            value={formValues.lead_phone ?? ''}
            onChange={handleFormChange}
            required
          />
          <TextField
            label="Email"
            name="lead_email"
            type="email"
            value={formValues.lead_email ?? ''}
            onChange={handleFormChange}
          />
          <TextField
            label="Address"
            name="lead_address"
            value={formValues.lead_address ?? ''}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
        component="form"
        onSubmit={submitEdit}
      >
        <DialogTitle>Edit Lead</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'grid', gap: 2 }}>
          <TextField
            label="Lead Name"
            name="lead_name"
            value={formValues.lead_name}
            onChange={handleFormChange}
            required
          />
          <TextField
            label="Phone Number"
            name="lead_phone"
            value={formValues.lead_phone ?? ''}
            onChange={handleFormChange}
          />
          <TextField
            label="Email"
            name="lead_email"
            type="email"
            value={formValues.lead_email ?? ''}
            onChange={handleFormChange}
          />
          <TextField
            label="Address"
            name="lead_address"
            value={formValues.lead_address ?? ''}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CustomersPage;