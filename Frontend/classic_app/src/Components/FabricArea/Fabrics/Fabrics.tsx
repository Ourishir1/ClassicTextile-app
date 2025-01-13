import { useEffect, useState } from "react";
import "./Fabrics.css";
import fabricService from "../../../Services/FabricService";
import { Fabric } from "../../../Models/Fabric";
import { Grid2 } from "@mui/material";
import FabricCard from "../FabricCard/FabricCard";

export function Fabrics(): JSX.Element {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);

  useEffect(() => {
    fabricService
      .getAllFabrics()
      .then((fabric) => setFabrics(fabric))
      .catch((err) => alert(err.response.data));
  }, []);

  // Group fabrics by name
  const groupedFabrics = fabrics.reduce((acc: { [key: string]: Fabric[] }, fabric) => {
    acc[fabric.name] = acc[fabric.name] ? [...acc[fabric.name], fabric] : [fabric];
    return acc;
  }, {});

  return (
    <div className="Fabrics">
      <h1>Fabrics</h1>
      <Grid2 display={"flex"} flexWrap={"wrap"}>
        {Object.keys(groupedFabrics).map((fabricName) => (
          <FabricCard fabricGroup={groupedFabrics[fabricName]} key={fabricName} />
        ))}
      </Grid2>
    </div>
  );
}
