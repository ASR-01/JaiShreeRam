import app from "./app";
import { PORT } from "./secret";
import GlobalErrorMiddleware from "./middlewares/globalError.middleware";

app.listen(PORT, () => {
  console.log(`Server Is Listing on Port ${PORT}`);
});
app.use(GlobalErrorMiddleware);
