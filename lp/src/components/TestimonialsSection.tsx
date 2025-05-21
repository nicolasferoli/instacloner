import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  imageSrc: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, imageSrc }) => (
  <div className="bg-dark-300 rounded-xl p-8 border border-dark-100 shadow-lg hover:shadow-insta transition-shadow">
    <Quote className="w-10 h-10 text-instagram-pink opacity-50 mb-4" />
    <p className="text-lg font-medium mb-6">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img src={imageSrc} alt={author} className="w-full h-full object-cover" />
      </div>
      <p className="text-gray-300 font-semibold">– {author}</p>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Perdi 1 ano com um mentiroso. O InstaCloner me mostrou a verdade em 3 minutos.",
      author: "Ana Luiza",
      imageSrc: "/lp/testimonial-1.jpg"
    },
    {
      quote: "Usei pra espionar meu concorrente. Em 1 semana, tripliquei minhas vendas.",
      author: "Ricardo Moraes",
      imageSrc: "/lp/testimonial-2.jpg"
    },
    {
      quote: "Minha namorada dizia que não usava Instagram. Descobri 3 perfis falsos dela.",
      author: "Lucas Augusto",
      imageSrc: "/lp/testimonial-3.jpg"
    }
  ];

  return (
    <section className="py-20 px-4 relative" id="testimonials">
      <div className="absolute inset-0 -z-10 bg-dark-gradient-alt"></div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Histórias reais de pessoas que descobriram a verdade com o InstaCloner
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              imageSrc={testimonial.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 