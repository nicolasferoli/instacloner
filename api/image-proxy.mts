import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
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

  try {
    const { url } = request.query;
    
    if (!url || typeof url !== 'string') {
      return response.status(400).send('URL da imagem é obrigatória e deve ser uma string');
    }
    
    console.log(`Proxy de imagem solicitado para: ${url}`);
    
    const imageResponse = await fetch(url);
    
    if (!imageResponse.ok) {
      console.error(`Erro ao buscar imagem: ${imageResponse.status} ${imageResponse.statusText}`);
      return response.status(imageResponse.status).send('Erro ao buscar imagem');
    }
    
    // Pegar o tipo de conteúdo da resposta original
    const contentType = imageResponse.headers.get('content-type');
    if (contentType) {
      response.setHeader('Content-Type', contentType);
    }
    
    // Pegar o buffer da imagem
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Enviar a imagem
    return response.send(buffer);
    
  } catch (error) {
    console.error('Erro no proxy de imagem:', error);
    return response.status(500).send('Erro interno no servidor');
  }
} 