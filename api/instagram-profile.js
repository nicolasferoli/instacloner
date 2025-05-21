// Arquivo versão JavaScript para a Vercel
// Usa ES Modules para compatibilidade com "type": "module" no package.json

// Variável de ambiente para armazenar seu token da API do ScrapingDog
const SCRAPINGDOG_API_KEY = process.env.SCRAPINGDOG_API_KEY || '682dd599e54091ba210f54e7';

export default async function handler(request, response) {
  // Configurações de CORS
  const allowedOrigins = [
    'https://instacloner.vercel.app',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];
  
  // Verificar a origem
  const origin = request.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Lidar com requisições preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return response.status(204).end();
  }

  // Apenas permitir requisições POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido. Use POST.' });
  }

  console.log("Accessed /api/instagram-profile endpoint (Node.js handler)");

  try {
    const { username } = request.body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return response.status(400).json({ message: 'Nome de usuário ausente ou inválido.' });
    }

    if (!SCRAPINGDOG_API_KEY) {
      console.error('Token da SCRAPINGDOG_API_KEY não configurado nas variáveis de ambiente.');
      return response.status(500).json({ message: 'Configuração do servidor incompleta (API key ausente).' });
    }
    
    // Remover o símbolo @ do início do nome de usuário, se existir
    const trimmedUsername = username.trim().startsWith('@') 
      ? username.trim().substring(1) 
      : username.trim();
      
    const scrapingDogUrl = `https://api.scrapingdog.com/instagram?api_key=${SCRAPINGDOG_API_KEY}&username=${trimmedUsername}`;
    
    console.log(`Chamando ScrapingDog API para o usuário: ${trimmedUsername}`);

    const scrapingDogResponse = await fetch(scrapingDogUrl, {
      method: 'GET'
    });

    if (!scrapingDogResponse.ok) {
      const errorText = await scrapingDogResponse.text();
      console.error(`Erro ao chamar ScrapingDog API: ${scrapingDogResponse.status} ${scrapingDogResponse.statusText}`, errorText);
      
      // Tentar extrair mensagem de erro da resposta JSON, se disponível
      let apiErrorMessage = `Erro ao buscar dados do perfil: ${scrapingDogResponse.statusText}`;
      try {
        const parsedError = JSON.parse(errorText);
        if (parsedError && parsedError.message) {
          apiErrorMessage = parsedError.message;
        }
      } catch (e) {
        // errorText não era JSON, usar como está se não for muito longo
        if(errorText.length < 100) apiErrorMessage = errorText;
      }
      
      return response.status(scrapingDogResponse.status).json({ message: apiErrorMessage });
    }

    const results = await scrapingDogResponse.json();

    if (!results || !results.username) {
      console.error('Resposta inválida ou erro da ScrapingDog API:', results);
      let message = 'Falha ao obter dados do perfil (resposta inesperada da API).';
      if (results && results.message) {
        message = results.message;
      }
      
      return response.status(500).json({ message });
    }
    
    const profilePicUrl = results.profile_pic_url || results.profile_pic_url_hd;
    const fullName = results.full_name;
    const apiUsername = results.username;

    if (!profilePicUrl || !fullName || !apiUsername) {
      console.error('Dados de foto, nome completo ou username ausentes nos resultados da ScrapingDog API:', results);
      return response.status(500).json({ message: 'Dados incompletos recebidos do provedor de API.' });
    }

    // Log da URL da imagem para debug
    console.log("URL da imagem de perfil retornada pela API:", profilePicUrl);

    // Verificar se é uma URL válida
    let validatedProfilePicUrl = profilePicUrl;
    try {
      new URL(profilePicUrl);
    } catch (e) {
      console.error("URL da imagem inválida:", profilePicUrl);
      validatedProfilePicUrl = ''; // Fornecer URL vazia para acionar o fallback no front-end
    }

    // Usar a URL do proxy para evitar problemas de CORS
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(validatedProfilePicUrl)}`;

    const responseData = {
      profilePicUrl: proxyUrl,
      fullName,
      username: apiUsername,
    };

    return response.status(200).json(responseData);

  } catch (error) {
    console.error(`Erro no handler /api/instagram-profile:`, error);
    return response.status(500).json({ 
      message: `Erro interno no servidor: ${error.message || error.toString()}` 
    });
  }
} 