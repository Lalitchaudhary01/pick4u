// src/sockets/driverSocket.js
export default function driverSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // Driver joins their personal room
    socket.on("driver-join", (driverId) => {
      socket.join(driverId);
      console.log(`Driver ${driverId} joined room`);
    });

    // Driver updates location
    socket.on("driver-location", ({ driverId, lat, lng }) => {
      // Emit location to all customers tracking this driver
      io.to(driverId).emit("driver-location-update", { lat, lng });
    });

    // Driver updates order status
    socket.on("order-status-update", ({ orderId, status, driverId }) => {
      // Emit status to customers tracking this order
      io.to(orderId).emit("order-status", { orderId, status });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
}
