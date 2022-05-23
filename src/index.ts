import Zode from '@zode/zode'
import addUserRoutes from './routes/userRoutes'
const app = new Zode();
addUserRoutes(app);
export default app.start();