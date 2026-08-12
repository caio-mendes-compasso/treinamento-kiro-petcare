"use client";

import { useState } from "react";
import { testimonials, Testimonial } from "@/mocks/testimonials";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
      {imageError ? (
        <div
          className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-lg mb-4"
          aria-hidden="true"
        >
          {getInitials(testimonial.name)}
        </div>
      ) : (
        <img
          src={testimonial.avatar}
          alt={`Foto de ${testimonial.name}`}
          className="w-16 h-16 rounded-full object-cover mb-4"
          onError={() => setImageError(true)}
        />
      )}

      <p className="text-gray-900 font-semibold mb-2">{testimonial.name}</p>
      <p className="text-gray-700">{testimonial.text}</p>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold text-center mb-8">
        O que nossos clientes dizem
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}
