import { createAppContainer, createSwitchNavigator } from "react-navigation";

import Welcome from "~/pages/Welcome";
import Dashboard from "~/pages/Dashboard";

//createAppContainer retorna um container com as paginas para serem navegadas
const Routes = (userLogged = false) =>
    createAppContainer(
        createSwitchNavigator(
            {
                Welcome,
                Dashboard
            },
            {
                initialRouteName: userLogged ? "Dashboard" : "Welcome"
            }
        )
    );

export default Routes;
