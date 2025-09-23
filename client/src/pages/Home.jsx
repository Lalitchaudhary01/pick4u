import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600">
            Fast. Reliable. Local deliveries.
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Book same-hour, same-day or standard deliveries with real-time
            tracking and trusted drivers.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/book"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
            >
              Book Delivery
            </Link>
            <Link to="/pricing" className="px-6 py-3 border rounded-lg">
              See Pricing
            </Link>
          </div>
        </div>
      </header>

      <section className="container py-12 grid md:grid-cols-3 gap-6">
        <Feature
          title="Instant Delivery"
          desc="Get deliveries in under an hour in your city."
        />
        <Feature
          title="Live Tracking"
          desc="Track the driver live on the map."
        />
        <Feature
          title="Secure Payments"
          desc="Multiple payment options & COD."
        />
      </section>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
