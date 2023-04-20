const app = require('express')();
const server = require('http').createServer(app);
var cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./swaggerdocs');

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

app.use(cookieParser());

app.use(
    rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 100,
      message: "You exceeded request limit",
      headers: true,
    })
);

const io = require('socket.io')(server , {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const PersonRouter = require("./routes/personRoutes");
app.use(PersonRouter);

const LogsRouter = require("./routes/logsRoutes");
app.use(LogsRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));



/*   Socket.io connection   */
io.on('connection', socket => {
    socket.on('new_message', (id, employee_name, employee_age, employee_salary) => {
        socket.broadcast.emit('new_message', id, employee_name, employee_age, employee_salary)
    })
    socket.on('update_message', (id, employee_name, employee_age, employee_salary) => {
        socket.broadcast.emit('update_message', id, employee_name, employee_age, employee_salary)
    })
    socket.on('delete_message', (id) => {
        socket.broadcast.emit('delete_message', id)
    })
 });

module.exports = server.listen(8080);