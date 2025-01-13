import { Box, Card } from "@mui/material";
import { Category } from "../../Models/enums/Category";
import "./CategoryCard.css";
import { useNavigate } from "react-router-dom";
interface CategoryProp{
    category:Category
    
}


export function CategoryCard(props:CategoryProp): JSX.Element {
    const imagePath = require(`/Users/ourishirkani/JS/React/classic_app/src/Images/FabricCategories/${Category[props.category]}.jpeg`);
    const nav=useNavigate();
    const handleNavigate = () => {
        nav(`/fabrics/${Category[props.category]}`);
    };
    
    return (
        <Card className="CategoryCard" sx={{
            backgroundImage: `url(${imagePath})`,
            backgroundSize: "cover", // Ensures the image covers the card
            backgroundPosition: "center", // Centers the image
            backgroundRepeat: "no-repeat", // Prevents tiling
            }} >
            <button className="CategoryButton"  onClick={handleNavigate}>{Category[props.category]} </button>
           
         </Card>
    );
} 
