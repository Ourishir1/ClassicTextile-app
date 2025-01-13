import { Route, Routes } from "react-router-dom";
import "./Routing.css";
import { Register_Page } from "../Register_Page/Register_Page";
import { Fabrics } from "../FabricArea/Fabrics/Fabrics";
import { HomePage } from "../HomeArea/HomePage/HomePage";
import { FabricByCategory } from "../FabricArea/FabricByCategory/FabricByCategory";
import ContactUs from "../ContactUs/ContactUs";
import { UserProfile } from "../UserProfile/UserProfile";
import { MyOrders } from "../MyOrders/MyOrders";
import { CheckOut } from "../CheckOut/CheckOut";
import { AddFabricForm } from "../FabricArea/AddFabricForm/AddFabricForm";
import { EditFabric } from "../FabricArea/EditFabric/EditFabric";
import UserManagement from "../AdminArea/UsersManagement/UsersManagement";
import OrderManagement from "../AdminArea/OrderManagement/OrderManagement";

export function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Routes>
            <   Route path="/*" Component={HomePage}/>
                <Route path="/Register" Component={Register_Page}/>
                <Route path="/fabrics" Component={Fabrics}/>
                <Route path="/contactUs" Component={ContactUs}/>
                <Route path="/fabrics/:category" Component={FabricByCategory} />
                <Route path="/userProfile" Component={UserProfile}/>
                <Route path="/MyOrders" Component={MyOrders} />
                <Route path="/checkOut" Component={CheckOut} />
                <Route path="/admin/users" Component={UserManagement} />
                <Route path="/admin/addFabric" Component={AddFabricForm} />
                <Route path="/admin/orders" Component={OrderManagement} />
                <Route path="/editFabric" Component={EditFabric}/>


                
    
                
            </Routes>
        </div>
    );
}
