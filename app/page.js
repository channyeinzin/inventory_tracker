'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const saveItem = async () => {
    const item = itemName;
    const docRef = doc(collection(firestore, 'inventory'), item);

    if (currentItem) {
      // If renaming, delete the old document
      if (currentItem.name !== itemName) {
        const oldDocRef = doc(collection(firestore, 'inventory'), currentItem.name);
        await deleteDoc(oldDocRef);
      }
    }

    await setDoc(docRef, { quantity });
    await updateInventory();
    handleClose();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setItemName(item.name);
      setQuantity(item.quantity);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setQuantity(1);
    setCurrentItem(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredList = inventory.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredInventory(filteredList);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">{currentItem ? 'Update Item' : 'Add Item'}</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant='outlined'
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={saveItem}
            >
              {currentItem ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box width="800px" display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="contained"
          onClick={() => handleOpen()}
        >
          ADD NEW ITEM
        </Button>
        <TextField
          variant='outlined'
          label="Search Items"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Box>

      <Box border="1px solid #333" mt={2}>
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>

        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => handleOpen({ name, quantity })}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
