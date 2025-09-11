import { Box, LinearProgress, TextField, Button, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import { DataGrid, GridApi, GridColDef, GridSlots, useGridApiRef } from '@mui/x-data-grid';
import CustomDataGridFooter from 'components/common/table/CustomDataGridFooter';
import CustomDataGridHeader from 'components/common/table/CustomDataGridHeader';
import CustomDataGridNoRows from 'components/common/table/CustomDataGridNoRows';
import ProductCell from 'components/sections/dashboard/topProducts/ProductCell';
import { ItemType, TopProductsRowData, topProductsTableData } from 'data/dashboard/table';
import { currencyFormat } from 'helpers/utils';
import { ChangeEvent, useEffect, useState, FormEvent } from 'react';
import SimpleBar from 'simplebar-react';

export const topProductsColumns: GridColDef<TopProductsRowData>[] = [
  {
    field: 'product',
    valueGetter: (params: ItemType) => {
      return params.title;
    },
    renderCell: (params) => {
      return <ProductCell value={params?.row.product} />;
    },
    headerName: 'Name',
    minWidth: 200,
  },
  {
    field: 'price',
    renderCell: (params) => {
      return <>{currencyFormat(params.value)}</>;
    },
    headerName: 'Price',
    width: 100,
  },
  { field: 'sold', headerName: 'Units Sold', width: 100, align: 'left' },
];

const ProductsPage = () => {

    const [searchText, setSearchText] = useState('');

    const [newProduct, setNewProduct] = useState({
      name: '',
      price: '',
      sold: '',
    });
    const apiRef = useGridApiRef<GridApi>();


    useEffect(() => {
      apiRef.current.setRows(topProductsTableData);//ambil data dari sini
    }, [apiRef]);
  
    useEffect(() => {
      apiRef.current.setQuickFilterValues([searchText]);
    }, [searchText, apiRef]);
  
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const searchValue = event.currentTarget.value;
      setSearchText(searchValue);
      if (searchValue === '') {
        apiRef.current.setRows(topProductsTableData);
      }
    };

    const handleNewProductChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

      const handleAddProduct = (event: FormEvent) => {
    event.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.sold) {
      const newEntry = {
        id: Date.now(), // Unique ID for the new row
        product: { title: newProduct.name, image: '' },
        price: parseFloat(newProduct.price),
        sold: parseInt(newProduct.sold),
      };

      //topProductsTableData.push(newEntry);
      apiRef.current.setRows([...topProductsTableData]);

      // Clear form
      setNewProduct({ name: '', price: '', sold: '' });
    }
  };
    
  
  return (
      <Box
      sx={{
        overflow: 'hidden',
        minHeight: 0,
        position: 'relative',
        height: { xs: 'auto', sm: 1 },
      }}
    >
            <Box
        component="form"
        onSubmit={handleAddProduct}
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          alignItems: 'center',
          flexWrap: 'wrap',
          p: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
        }}
      >
        <TextField
          label="Product Name"
          name="name"
          value={newProduct.name}
          onChange={handleNewProductChange}
          required
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="price-input">Price</InputLabel>
          <OutlinedInput
            id="price-input"
            name="price"
            value={newProduct.price}
            onChange={handleNewProductChange}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Price"
            type="number"
            required
          />
        </FormControl>
        <TextField
          label="Units Sold"
          name="sold"
          value={newProduct.sold}
          onChange={handleNewProductChange}
          type="number"
          required
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ alignSelf: 'center', height: '56px' }}
        >
          Add Product
        </Button>
      </Box>
      <SimpleBar>
        <DataGrid
          autoHeight={false}
          columns={topProductsColumns}
          onResize={() => {
            apiRef.current.autosizeColumns({
              includeOutliers: true,
              expand: true,
            });
          }}
          rowHeight={52}
          loading={false}
          apiRef={apiRef}
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
              title: 'Top Products by Units Sold',
              flag: 'products',
              value: searchText,
              onChange: handleChange,
              clearSearch: () => {
                setSearchText('');
                apiRef.current.setRows(topProductsTableData);
              },
            },
            pagination: { labelRowsPerPage: topProductsTableData.length },
          }}
          initialState={{ pagination: { paginationModel: { page: 1, pageSize: 5 } } }}
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
      </SimpleBar>
    </Box>
  );
};

export default ProductsPage;
