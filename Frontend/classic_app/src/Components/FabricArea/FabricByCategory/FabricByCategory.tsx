import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  // Import useParams
import fabricService from "../../../Services/FabricService";
import { Fabric } from "../../../Models/Fabric";
import { Grid2 } from "@mui/material";
import FabricCard from "../FabricCard/FabricCard";

export function FabricByCategory(): JSX.Element {
    const { category } = useParams<{ category: string }>();  // Get category from the URL
    const [fabrics, setFabrics] = useState<Fabric[]>([]);

    useEffect(() => {
        if (category) {
            fabricService.getFabricByCategory(category as any)  // Pass category to service
                .then(fabric => setFabrics(fabric))
                .catch(err => alert(err.response?.data || 'Error fetching fabrics'));
        }
    }, [category]);  // Run this effect when category changes

    return (
        <div className="Fabrics">
            <h1>Fabrics - {category}</h1>
            <Grid2 display={"flex"} flexWrap={"wrap"}>
                {fabrics.map(fabric => (
                    <FabricCard fabricGroup={fabrics} key={fabric.id} />
                ))}
            </Grid2>
        </div>
    );
}
