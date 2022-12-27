import userDetailsRoutes from "./Details";
import userSessionRoutes from "./Session";

const userRoutes = [...userSessionRoutes, ...userDetailsRoutes];

export default userRoutes;
