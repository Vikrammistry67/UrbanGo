import app from './src/app.js';
import _config from './src/config/config.js';
import connectToDB from './src/config/db.js';
const PORT = _config.PORT || 3000;
connectToDB();
app.listen(PORT, () => console.log(`UrbanGo Server is running at PORT ${PORT}`));