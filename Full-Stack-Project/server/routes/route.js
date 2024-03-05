import express from 'express';
import { tokenAuthentication, getUserDetails } from '../middleware/middleware.js';
import { register, login } from '../controllers/UserController.js';
import { hostRoom } from '../controllers/RoomController.js';

const route = express.Router();

    
// Define routes...

route.get('/me', tokenAuthentication, getUserDetails);
route.post('/register', register);
route.post('/login', login);
route.get("/host",tokenAuthentication,hostRoom);



export default route;

