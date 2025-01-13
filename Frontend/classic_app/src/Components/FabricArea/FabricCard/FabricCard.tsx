import React, { useState, useEffect } from "react";
import "./FabricCard.css";
import { Fabric } from "../../../Models/Fabric";
import { jwtDecode } from "jwt-decode";
import orderService from "../../../Services/OrderService";
import { useNavigate } from "react-router-dom";
import fabricService from "../../../Services/FabricService";
import { Box, FormControl } from "@mui/material";

interface FabricCardProps {
  fabricGroup: Fabric[];
}

interface CustomJwtPayload {
  userId: number;
  isAdmin: boolean;
}

const FabricCard: React.FC<FabricCardProps> = ({ fabricGroup }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(fabricGroup[0].color); // Default to the first fabric's color
  const [currentFabric, setCurrentFabric] = useState<Fabric>(fabricGroup[0]);

  const isOutOfStock = fabricGroup.some(fabric => fabric.status === "OUT_OF_STOCK");
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<CustomJwtPayload>(token).userId : null;
  const isAdmin = token ? jwtDecode<CustomJwtPayload>(token).isAdmin : false;
  const nav = useNavigate();

  useEffect(() => {
    const selectedFabric = fabricGroup.find(fabric => fabric.color === selectedColor);
    if (selectedFabric) {
      setCurrentFabric(selectedFabric);
    }
  }, [selectedColor, fabricGroup]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }
    try {
      await orderService.addToCart(currentFabric.id, quantity, userId);
      alert("Item added to cart successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleEditFabric = () => {
    nav(`/editFabric?fabricId=${currentFabric.id}`);
  };

  const handleDeleteFabric = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fabric?"
    );
    if (confirmDelete) {
      try {
        await fabricService.deleteFabric(currentFabric.id);
        alert("Fabric deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete fabric:", error);
        alert("Failed to delete fabric. Please try again.");
      }
    }
  };

  return (
    <div
      className={`fabric-card ${isOutOfStock ? "out-of-stock" : ""}`}
      style={{ backgroundImage: `url(${currentFabric.image})` }}
    >
      {isOutOfStock && (
        <div className="fabric-badge">
          <span>Out of Stock</span>
        </div>
      )}

      {isAdmin && (
        <>
          <button
            className="delete-fabric-button"
            onClick={handleDeleteFabric}
            title="Delete Fabric"
          >
            🗑️
          </button>
          <button className="edit-fabric-button" onClick={handleEditFabric}>
            🔧
          </button>
        </>
      )}

      <div className="fabric-details">
        <h2 className="fabric-name">{currentFabric.name}</h2>
        <p className="fabric-description">{currentFabric.description}</p>
        <p className="fabric-price">₪{currentFabric.price.toFixed(2)} per/m</p>

        <div className="quantity-input">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            disabled={isOutOfStock}
          />
        </div>

       
          {/* Color Squares */}
          <Box className="colorSelector">
            {fabricGroup.map((fabric) => (
              <Box
                key={fabric.color}
                className={`colorSquare ${selectedColor === fabric.color ? "selected" : ""}`}
                style={{ backgroundColor: fabric.color.toLowerCase() }}
                onClick={() => handleColorChange(fabric.color)}
              />
            ))}
          </Box>
       

        <button onClick={handleAddToCart} disabled={isOutOfStock}>
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default FabricCard;
