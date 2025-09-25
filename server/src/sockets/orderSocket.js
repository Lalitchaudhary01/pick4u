export default function orderSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Driver location update
    socket.on("driverLocation", ({ orderId, lat, lng }) => {
      console.log(`📍 Driver update for order ${orderId}:`, lat, lng);
      io.emit(`order-${orderId}-location`, { lat, lng }); // broadcast to order channel
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
