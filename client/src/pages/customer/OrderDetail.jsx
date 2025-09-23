import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../utils/api";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/customer/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order #{order._id}</h2>
      <p>Status: {order.status}</p>
      <p>Pickup: {order.pickupAddress}</p>
      <p>Drop: {order.dropAddress}</p>
      <p>Weight: {order.package.weight}kg</p>
      <p>Delivery Type: {order.deliveryType}</p>
      <p>Fare: ₹{order.fare}</p>
      {order.driver && (
        <p>
          Driver: {order.driver.name} ({order.driver.phone})
        </p>
      )}
    </div>
  );
}
