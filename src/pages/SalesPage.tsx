import { useState, useEffect } from "react";
import Logo from "@/components/Logo";

const SalesPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl mb-8 shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-red-600 mb-4">
            🚨 VIGILÂNCIA TOTAL DO INSTAGRAM
          </h1>
          <div className="flex justify-center">
            <Logo />
          </div>
        </div>

        {/* Main Call to Action */}
        <div className="bg-white p-6 md:p-8 rounded-xl mb-8 shadow-md">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            🔥 VOCÊ ESTÁ A 1 CLIQUE DE VER TUDO O QUE ELES ESCONDEM
          </h2>
          
          <div className="text-center mb-6">
            <p className="text-lg md:text-xl font-bold mb-6">PARE DE SER TROUXA. VEJA A VERDADE. HOJE.</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center justify-center">
                <span className="text-yellow-500 mr-2">⚡</span> 
                <span className="font-medium"><strong>ACESSO COMPLETO</strong> a qualquer perfil - até privados</span>
              </li>
              <li className="flex items-center justify-center">
                <span className="text-yellow-500 mr-2">👻</span> 
                <span className="font-medium"><strong>ZERO RASTROS</strong> - Eles NUNCA vão descobrir</span>
              </li>
              <li className="flex items-center justify-center">
                <span className="text-yellow-500 mr-2">💸</span> 
                <span className="font-medium"><strong>7 DIAS DE GARANTIA</strong> - Teste sem medo</span>
              </li>
            </ul>
            
            <button className="bg-insta-gradient text-white font-bold py-4 px-8 rounded-lg text-lg md:text-xl animate-pulse-slow">
              👉 QUERO ACESSO IMEDIATO AGORA
            </button>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="bg-white p-6 md:p-8 rounded-xl mb-8 shadow-md">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
            🎯 O QUE VOCÊ VAI FAZER QUANDO TIVER ESSE PODER?
          </h3>
          
          <ul className="space-y-4 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✔️</span> 
              <span className="font-medium"><strong>Descobrir a verdade</strong> (antes que destrua sua vida)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✔️</span> 
              <span className="font-medium"><strong>Monitorar concorrentes</strong> (e ganhar vantagem suja)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✔️</span> 
              <span className="font-medium"><strong>Proteger seu relacionamento</strong> (ou confirmar suas piores suspeitas)</span>
            </li>
          </ul>
          
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
            <p className="font-medium">
              <strong>⚠️ ATENÇÃO:</strong> Isso não é brincadeira. Você está prestes a ter acesso ao que 99% das pessoas nunca terão.
            </p>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="bg-white p-6 md:p-8 rounded-xl mb-8 shadow-md">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
            💀 DEPOIMENTOS DE QUEM USOU (E NUNCA MAIS FOI O MESMO)
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded">
              <p className="italic mb-2">"Perdi 1 ano com um mentiroso. <img src="/Logo.svg" alt="InstaCloner" className="h-5 inline-block mx-1" /> me mostrou a verdade em 3 minutos."</p>
              <p className="text-right text-sm">– Ana Luiza, 28 anos</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <p className="italic mb-2">"Usei pra espionar meu concorrente. Em 1 semana, tripliquei minhas vendas."</p>
              <p className="text-right text-sm">– Ricardo, empresário</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <p className="italic mb-2">"Minha namorada dizia que não usava Instagram. Descobri 3 perfis falsos dela."</p>
              <p className="text-right text-sm">– Lucas, 24 anos</p>
            </div>
          </div>
        </div>
        
        {/* Limited Offer */}
        <div className="bg-white p-6 md:p-8 rounded-xl mb-8 shadow-md">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
            🚨 OFERTA RELÂMPAGO (VAI DEIXAR PASSAR?)
          </h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span> 
              <span className="font-medium"><strong>Monitoramento 24/7</strong> - Nada escapa</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span> 
              <span className="font-medium"><strong>Acesso a mensagens, stories e arquivados</strong> - TUDO</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span> 
              <span className="font-medium"><strong>100% invisível</strong> - Sem rastros, sem medo</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span> 
              <span className="font-medium"><strong>Bônus exclusivo:</strong> Localização em tempo real</span>
            </li>
          </ul>
          
          <div className="text-center mb-6">
            <p className="font-medium mb-2">⏰ ESSA OFERTA SOME EM:</p>
            <div className="bg-black text-white inline-block px-4 py-2 rounded">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
          
          <div className="text-center">
            <button className="bg-insta-gradient text-white font-bold py-4 px-8 rounded-lg text-lg md:text-xl animate-pulse-slow">
              🔥 EU QUERO ESSE PODER AGORA
            </button>
          </div>
        </div>
        
        {/* Thought-provoking Questions */}
        <div className="bg-white p-6 md:p-8 rounded-xl mb-8 shadow-md">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
            💣 PERGUNTAS QUE VÃO TE TIRAR O SONO
          </h3>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">❓</span> 
              <span className="font-medium">Quanto vale sua paz mental?</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">❓</span> 
              <span className="font-medium">Você prefere saber a verdade ou viver na mentira?</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">❓</span> 
              <span className="font-medium">O que você faria se pudesse ver TUDO agora?</span>
            </li>
          </ul>
        </div>
        
        {/* Bonus */}
        <div className="bg-white p-6 md:p-8 rounded-xl mb-8 shadow-md">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
            🎁 BÔNUS PARA COMPRAS IMEDIATAS (HOJE SÓ!)
          </h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">1️⃣</span> 
              <span className="font-medium"><strong>Guia "Como Confrontar sem Perder a Razão"</strong> (PDF)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">2️⃣</span> 
              <span className="font-medium"><strong>Aula Secreta:</strong> "Recuperando Ex em 3 Passos Sujos"</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">3️⃣</span> 
              <span className="font-medium"><strong>Checklist:</strong> "10 Sinais de Traição no Instagram"</span>
            </li>
          </ul>
          
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded mb-6">
            <p className="font-medium">
              <strong>⚠️</strong> Disponível apenas para as próximas 17 compras
            </p>
          </div>
          
          <div className="text-center">
            <button className="bg-insta-gradient text-white font-bold py-4 px-8 rounded-lg text-lg md:text-xl">
              QUERO TUDO ISSO AGORA MESMO
            </button>
          </div>
        </div>
        
        {/* Legal Notice */}
        <div className="bg-white p-6 md:p-8 rounded-xl mb-8 shadow-md">
          <h3 className="text-lg font-bold text-center mb-4">
            ⚠️ AVISO LEGAL IMPORTANTE
          </h3>
          
          <p className="text-sm mb-6 text-center">
            Esta ferramenta deve ser usada com responsabilidade. Não nos responsabilizamos por decisões tomadas com base nas informações obtidas. Consulte a legislação local antes de usar.
          </p>
          
          <div className="text-center text-sm text-gray-500 mb-6">
            © 2025 <img src="/Logo.svg" alt="InstaCloner" className="h-4 inline-block mx-1" /> | <a href="#" className="underline">Termos de Uso</a> | <a href="#" className="underline">Política de Privacidade</a>
          </div>
          
          <div className="text-center">
            <button className="border-2 border-black bg-black hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded-lg transition-colors">
              🖤 COMPRAR AGORA COM 10% DE DESCONTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
