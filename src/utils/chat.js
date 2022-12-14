
import { Message } from "../../src/containers/fileMessageContainer.js";
import { daoMessages, daoProducts } from "../../src/daos/index.js";
import { Server as SocketServer } from "socket.io";
import { httpServer } from "../../server.js";



const logUsr = "";

export const socketChat=async ()=>{
  
const io = new SocketServer(httpServer);

  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    ///getFakerProducts();

    try {
      socket.server.emit("RENDER_PRODUCTS", await daoProducts.getAll(), logUsr);
      let chat = await daoMessages.getAll();
      socket.server.emit("RENDER_CHAT", chat);

    } catch (err) {
      console.log(err);
    }

    socket.on("ADD_PRODUCT", async (product) => {
      await daoProducts.save(product);
      io.sockets.emit("RENDER_PRODUCTS", await daoProducts.getAll());
    });

    socket.on("ADD_MESSAGE", async (message) => {
      const newMessage = new Message(
        message.author.email,
        message.author.name,
        message.author.lastname,
        message.author.age,
        message.author.alias,
        message.author.avatar,
        message.text);
      await daoMessages.save(newMessage);
      let chat = await daoMessages.getAll();
      socket.server.emit("RENDER_CHAT", chat);
    });

  });

}
