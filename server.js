const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const SwaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(cors());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

const routes = require('./routes/user');
const routes2 = require('./routes/enclosure');
const routes3 = require('./routes/note');
const routes4 = require('./routes/token');

app.use(express.json())

app.use('/', routes, routes2, routes3, routes4);
mongoose.set('strictQuery', true);





const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Demo app listening on port :' + listener.address().port)
}
)
mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }

);

const conn = mongoose.connection;

module.exports = {
    app
};

/*conn.on('connected', function () {
    
    conn.db.collection("users").dropIndex("password_1", function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("Index dropped");
        }
    });
});/*/
