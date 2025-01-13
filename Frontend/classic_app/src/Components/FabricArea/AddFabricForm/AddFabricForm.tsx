import { useState, useEffect } from "react";
import { Fabric } from "../../../Models/Fabric";
import "./AddFabricForm.css";
import { useForm } from "react-hook-form";
import fabricService from "../../../Services/FabricService";
import { Button, TextField, FormControl, Box, MenuItem, Card } from "@mui/material";
import { Color } from "../../../Models/enums/Color";                    
import { Category } from "../../../Models/enums/Category";
import { useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Helper function to extract enum values as strings
const getEnumValues = (enumObject: any): string[] => {
  return Object.keys(enumObject).filter((key) => isNaN(Number(key)));
};

interface CustomJwtPayload extends JwtPayload {
  isAdmin: boolean;
}

export function AddFabricForm(): JSX.Element {
  const { register, handleSubmit, setValue } = useForm<Fabric>();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const navigate = useNavigate();

  // Token decoding and checking admin status
  useEffect(() => {
    const token = localStorage.getItem("token");
    let isAdmin: boolean | undefined;
    if (token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      isAdmin = decodedToken.isAdmin;
    }
    
    if (!isAdmin) {
      alert("Unauthorized access");
      navigate("/home");
    }
  }, [navigate]);

  const addFabric = (fabric: Fabric) => {
    fabricService
      .addFabric(fabric)
      .then(() => {alert("It worked!"); navigate("/home");})
      .catch((err) => alert("Error adding fabric!"));
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setValue("color", color); // Set value in react-hook-form
  };

  return (
    <Card className="AddFabricFormCard">
      <div className="AddFabricForm">
        <form onSubmit={handleSubmit(addFabric)}>
          <TextField {...register("name")} label="Fabric Name" fullWidth />
          <TextField {...register("description")} label="Description" fullWidth />
          <TextField {...register("price")} label="Price" type="number" fullWidth />

          {/* Color Squares */}
          <FormControl fullWidth>
            <Box className="colorSelector">
              {getEnumValues(Color).map((color) => (
                <Box
                  key={color}
                  className={`colorSquare ${selectedColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </Box>
          </FormControl>

          {/* Category Dropdown */}
          <FormControl fullWidth>
            <TextField
              {...register("category")}
              label="Category"
              select
              fullWidth
            >
              {getEnumValues(Category).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <TextField {...register("image")} label="Upload Image URL" fullWidth />
          <Button type="submit" variant="contained" color="primary">
            Add Fabric
          </Button>
        </form>
      </div>
    </Card>
  );
}
