const app = require('express')();
const server = require('http').createServer(app);

const bodyParser = require('body-parser')

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

const io = require('socket.io')(server , {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const Router = require("./routes/personRoutes");

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(Router);

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