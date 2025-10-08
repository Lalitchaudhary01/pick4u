export default function driverSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Driver joins personal room
    socket.on("join-driver-room", (driverId) => {
      socket.join(driverId);
      console.log(`Driver ${driverId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
