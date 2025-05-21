// Arquivo versão JavaScript para a Vercel
// Usa ES Modules para compatibilidade com "type": "module" no package.json

// Variável de ambiente para armazenar seu token da API da Scrape Creators
const SCRAPECREATORS_API_KEY = process.env.SCRAPECREATORS_API_KEY || '';

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

    if (!SCRAPECREATORS_API_KEY) {
      console.error('Token da SCRAPECREATORS_API_KEY não configurado nas variáveis de ambiente.');
      return response.status(500).json({ message: 'Configuração do servidor incompleta (API key ausente).' });
    }
    
    const trimmedUsername = username.trim();
    const scrapeCreatorsUrl = `https://api.scrapecreators.com/v1/instagram/profile?handle=${trimmedUsername}`;
    
    console.log(`Chamando Scrape Creators API para o usuário: ${trimmedUsername}`);

    const scrapeCreatorsResponse = await fetch(scrapeCreatorsUrl, {
      method: 'GET',
      headers: {
        'x-api-key': SCRAPECREATORS_API_KEY,
      },
    });

    if (!scrapeCreatorsResponse.ok) {
      const errorText = await scrapeCreatorsResponse.text();
      console.error(`Erro ao chamar Scrape Creators API: ${scrapeCreatorsResponse.status} ${scrapeCreatorsResponse.statusText}`, errorText);
      
      // Tentar extrair mensagem de erro da resposta JSON, se disponível
      let apiErrorMessage = `Erro ao buscar dados do perfil: ${scrapeCreatorsResponse.statusText}`;
      try {
        const parsedError = JSON.parse(errorText);
        if (parsedError && parsedError.message) {
          apiErrorMessage = parsedError.message;
        }
      } catch (e) {
        // errorText não era JSON, usar como está se não for muito longo
        if(errorText.length < 100) apiErrorMessage = errorText;
      }
      
      return response.status(scrapeCreatorsResponse.status).json({ message: apiErrorMessage });
    }

    const results = await scrapeCreatorsResponse.json();

    if (results.status !== 'ok' || !results.data || !results.data.user) {
      console.error('Resposta inválida ou erro da Scrape Creators API:', results);
      let message = 'Falha ao obter dados do perfil (resposta inesperada da API).';
      if (results.message) {
        message = results.message;
      }
      
      const statusCode = (results.status && typeof results.status === 'number') 
        ? results.status 
        : (scrapeCreatorsResponse.status !== 200 ? scrapeCreatorsResponse.status : 500);
      
      return response.status(statusCode).json({ message });
    }
    
    const userProfile = results.data.user;
    const profilePicUrl = userProfile.profile_pic_url;
    const fullName = userProfile.full_name;
    const apiUsername = userProfile.username; 

    if (!profilePicUrl || !fullName || !apiUsername) {
      console.error('Dados de foto, nome completo ou username ausentes nos resultados da Scrape Creators API:', userProfile);
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