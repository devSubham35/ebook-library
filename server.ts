import app from "./src/app";
import { config } from "./src/config/config";


const startServer = () => {

    return app.listen(config.port, () => {
        console.log(`🚀🚀🚀 Server is running at PORT ${config.port}`)
    });
}

startServer();