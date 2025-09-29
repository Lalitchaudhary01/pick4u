import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { trackOrder } from "../../api";
import { io } from "socket.io-client";

export default function TrackOrder() {
  const { id } = useParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    trackOrder(id).then((res) => setStatus(res.data.status));

    const socket = io("http://localhost:5000");
    socket.emit("order-join", id);
    socket.on("order-status", (data) => {
      if (data.orderId === id) setStatus(data.status);
    });

    return () => socket.disconnect();
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Track Order</h2>
      <p>Order ID: {id}</p>
      <p>Status: {status}</p>
    </div>
  );
}
