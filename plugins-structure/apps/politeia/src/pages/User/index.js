import userDetailsRoutes from "./Details";
import userSessionRoutes from "./Session";
import adminRoutes from "./Admin";

const userRoutes = [...userSessionRoutes, ...userDetailsRoutes, ...adminRoutes];

export default userRoutes;
