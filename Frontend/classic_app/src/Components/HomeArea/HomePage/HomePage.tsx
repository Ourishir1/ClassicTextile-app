import { Card, Grid2 } from "@mui/material";
import { WelcomeCard } from "../WelcomeCard/WelcomeCard";
import "./HomePage.css";
import { AreYouADesigner } from "../AreYouADesinger/AreYouADesigner";
import { CategoryCard } from "../../CategoryCard/CategoryCard";
import { Category } from "../../../Models/enums/Category";

export function HomePage(): JSX.Element {
    return (
        <div>
        <Card id="HomeCards" sx={{paddingBottom:0}}>
        <WelcomeCard/>
        <Grid2  display={"flex"} flexWrap={"wrap"} justifyContent={"space-evenly"}>
            <CategoryCard category={Category.CHIFFON}/>
            <CategoryCard category={Category.SILK}/>
            <CategoryCard category={Category.VELVET}/>
        </Grid2>
        </Card>
        <AreYouADesigner/>
        
        <Grid2  display={"flex"} flexWrap={"wrap"}  justifyContent={"space-evenly"}>
            <CategoryCard category={Category.CREPE}/>
            <CategoryCard category={Category.JERSEY}/>
            <CategoryCard category={Category.LEATHER}/>
        </Grid2>
        <Grid2  display={"flex"} flexWrap={"wrap"} justifyContent={"space-evenly"}>
            <CategoryCard category={Category.ORGANZA}/>
            <CategoryCard category={Category.SATIN}/>
            <CategoryCard category={Category.SPANDEX}/>
        </Grid2>

        </div>

    );
}
