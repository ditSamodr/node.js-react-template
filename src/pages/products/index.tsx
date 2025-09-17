import {
  Box,
  LinearProgress,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { DataGrid, GridApi, GridColDef, GridSlots, useGridApiRef } from '@mui/x-data-grid';
import axios from 'axios';
import CustomDataGridFooter from 'components/common/table/CustomDataGridFooter';
import CustomDataGridHeader from 'components/common/table/CustomDataGridHeader';
import CustomDataGridNoRows from 'components/common/table/CustomDataGridNoRows';
import ProductCell from 'components/sections/dashboard/topProducts/ProductCell';
import { ItemType, TopProductsRowData, topProductsTableData } from 'data/dashboard/table';
import { currencyFormat } from 'helpers/utils';
import { ChangeEvent, useEffect, useState, FormEvent } from 'react';
import SimpleBar from 'simplebar-react';

interface ProductData{
  id?: string;
  title: string;
  price: string;
  sold: string;
  image: string | null;
}

const ProductsPage = () => {
  const [searchText, setSearchText] = useState('');

  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    sold: '',
    image: ''
  });

  const [formData, setFormData] = useState<ProductData>({
    title: '',
    price: '',
    sold: '',
    image: ''
  });

  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      sold: '',
      image: '',
    });
    setEditingProductId(null);
  };

  type Product = {
    id: string;
    product: {title: string; image:string};
    price: number;
    sold: number;
  };

  const apiRef = useGridApiRef<GridApi>();

  useEffect(() => {
    apiRef.current.setRows(products);//ambil data dari sini
  }, [apiRef]);

  useEffect(() => {
    apiRef.current.setQuickFilterValues([searchText]);
  }, [searchText, apiRef]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.currentTarget.value;
    setSearchText(searchValue);
    if (searchValue === '') {
      apiRef.current.setRows(products);
    }
  };

  const ProductForm = () =>{
    const [newProduct, setNewProduct] = useState({
      title: '',
      price: '',
      sold: '',
      image: ''
    });
  };

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          //const response = await axios.get('http://localhost:3001/api/products'); //LOCAL
          const response = await axios.get('https://umbra-2.prolead.id/api/products'); //SERVER
          const productsArray = response.data; 
          
          if (Array.isArray(productsArray)) {
            const formattedData: TopProductsRowData[] = productsArray.map((item: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
                id: item.id.toString(),
                product: { 
                    title: item.title, 
                    image: item.image,  // eslint-disable-line @typescript-eslint/no-explicit-any
                },
                price: item.price,
                sold: item.sold,
            }));
            setProducts(formattedData);
        } else {
            console.error("API response is not an array:", response.data);
        }
        } catch (err) {
          console.error("Failed to fetch products:", err);
          setError("Failed to load products.");
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }, []);
    if (error) {
      return <div>Error: {error}</div>;
    }

  const handleNewProductChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      //await axios.delete(`http://localhost:3001/api/products/${productId}`); //LOCAL
      await axios.delete(`https://umbra-2.prolead.id/api/products/${productId}`); //SERVER
      
      // Update the UI by filtering out the deleted product
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product.');
    }
  };

  const handleUpdateProduct = async (editingProductId: string) => {
    try {
      const response = await axios.put(
        //`http://localhost:3001/api/products/${editingProductId}`, //LOCAL
        `https://umbra-2.prolead.id/api/products/${editingProductId}`, //SERVER
        {
         // ...formData,
          title: newProduct.title,
          price: parseFloat(newProduct.price),
          sold: parseInt(newProduct.sold),
          image: newProduct.image,
        }
      );

      //Update the UI with the new data
      // setProducts((prev) =>
      //   prev.map((product) =>
      //     product.id === editingProductId ? response.data.data : product
      //   )
      // );
      //resetForm();
      setNewProduct({ title: '', price: '', sold: '' , image: ''});
      window.location.reload(); 
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
        // If there is an editing ID, call the update function
        await handleUpdateProduct(editingProductId);
    } else {
        // Otherwise, call the add function
        await handleAddProduct(e);
    }
};

  const handleAddProduct = async (event: FormEvent) => {
    event.preventDefault();
    if (newProduct.title && newProduct.price && newProduct.sold && newProduct.image) {
      //const response = await axios.post('http://localhost:3001/api/products', //LOCAL
      const response = await axios.post('https://umbra-2.prolead.id/api/products', //SERVER
        {
        title: newProduct.title || '',
        price: parseInt(newProduct.price) || 0,
        sold: parseInt(newProduct.sold) || 0,
        image: newProduct.image || '',
      });
      console.log('Product added successfully', response.data);
      // Clear form
      setNewProduct({ title: '', price: '', sold: '' , image: ''});
      window.location.reload(); 
      
      const updatedProd = response.data.data;

    }
  };

    
  
  const handleEditClick = (productData: TopProductsRowData)=>{
    setNewProduct({
      title: productData.product.title,
      price: productData.price.toString(),
      sold: productData.sold.toString(),
      image: productData.product.image || '',
    });
    setEditingProductId(productData.id);
  }

  const topProductsColumns: GridColDef<TopProductsRowData>[] = [
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
    field: 'productImage',
    headerName: 'Description',
    width: 200,
    // Use renderCell to display the raw string value
    renderCell: (params) => {
      // Access the nested 'image' property
      return params.row.product.image;
    },
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
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <div>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEditClick(params.row as TopProductsRowData)}
        >
          Update
        </Button>
        
         <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDeleteProduct(params.row.id)}
        >
          Delete
        </Button>
        {/* You can add more buttons here, like an "Edit" button */}
      </div>
    ),
  },
];

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
        onSubmit={handleSubmit}
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
          name="title"
          value={newProduct.title}
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
        <TextField
          label="Description"
          name="image"
          value={newProduct.image}
          onChange={handleNewProductChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ alignSelf: 'center', height: '56px' }}>
          {editingProductId ? 'Update Product': 'Add Product'}
          
        </Button>
      </Box>
      <SimpleBar>
        <DataGrid
          rows={products}
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
                apiRef.current.setRows(products);
              },
            },
            pagination: { labelRowsPerPage: products.length },
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
