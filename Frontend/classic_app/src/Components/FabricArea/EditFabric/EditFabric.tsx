import React, { useEffect, useState } from "react";
import { TextField, Button, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import fabricService from "../../../Services/FabricService";
import { Fabric } from "../../../Models/Fabric";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useForm, Controller } from "react-hook-form";
import "./EditFabric.css";
import { Category } from "../../../Models/enums/Category";
import { Status } from "../../../Models/enums/Status";

interface CustomJwtPayload extends JwtPayload {
  isAdmin: boolean;
}

// Helper function to extract enum values as strings
const getEnumValues = (enumObject: any): string[] => {
  return Object.keys(enumObject).filter((key) => isNaN(Number(key)));
};

export function EditFabric(): JSX.Element {
  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [searchParams] = useSearchParams();
  const fabricIdFromParams = parseInt(searchParams.get("fabricId") || "", 10);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors }, control } = useForm<Fabric>();

  // Decode token to check admin privileges
  const token = localStorage.getItem("token");
  let isAdmin: boolean | undefined;
  if (token) {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    isAdmin = decodedToken.isAdmin;
  }

  useEffect(() => {
    if (!isAdmin) {
      alert("Unauthorized access");
      navigate("/home"); 
      return;
    }

    fabricService
      .getOneFabric(fabricIdFromParams)
      .then((fetchedFabric) => {
        setFabric(fetchedFabric);
        setValue("id", fetchedFabric.id);
        setValue("name", fetchedFabric.name);
        setValue("description", fetchedFabric.description);
        setValue("price", fetchedFabric.price);
        setValue("status", fetchedFabric.status); 
        setValue("category", fetchedFabric.category); 
        setValue("image", fetchedFabric.image); 
        setValue("color",fetchedFabric.color);
      })
      .catch((err) => alert(err.response?.data || "Error fetching fabric details"));
  }, [fabricIdFromParams, isAdmin, navigate, setValue]);


  

  if (!fabric) {
    return <div className="EditFabric">Loading...</div>;
  }


  return (
    <div className="EditFabric">
      <h1>Edit Fabric</h1>
      <form onSubmit={handleSubmit((data) => fabricService.updateFabric(data).then(data=>navigate("/fabrics")).catch(err=>console.log(err.message)))}>
        <TextField
          {...register("name")}
          label="Fabric Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          {...register("description")}
          label="Description"
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          {...register("price")}
          label="Price"
          type="number"
          fullWidth
          error={!!errors.price}
          helperText={errors.price?.message}
        />
        
        {/* Category Select */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Controller
            name="category"
            control={control}
            defaultValue={fabric.category || ""} // Default value for category
            render={({ field }) => (
              <Select
                {...field}
                label="Category"
                error={!!errors.category}
              >
                {getEnumValues(Category).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.category && <span>{errors.category.message}</span>}
        </FormControl>

        {/* Status Select */}
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Controller
            name="status"
            control={control}
            defaultValue={fabric.status || ""} // Default value for status
            render={({ field }) => (
              <Select
                {...field}
                label="Status"
                error={!!errors.status}
              >
                {getEnumValues(Status).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.status && <span>{errors.status.message}</span>}
        </FormControl>

       

        <TextField
          {...register("image")}
          label="Image URL"
          fullWidth
          error={!!errors.image}
          helperText={errors.image?.message}
        />
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
      </form>
    </div>
  );
}
