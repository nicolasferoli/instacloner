import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Obter o token da API do arquivo .env ou variável de ambiente
const SCRAPECREATORS_API_KEY = process.env.SCRAPECREATORS_API_KEY || 'Hdbw4RGIHNUUS9us4RHd58uH16A2';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rota para buscar perfil do Instagram
app.post('/api/instagram-profile', async (req, res) => {
  console.log("Chamada para /api/instagram-profile recebida");
  
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ message: 'Nome de usuário ausente ou inválido.' });
    }

    console.log(`Buscando perfil para usuário: ${username}`);
    
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
      
      return res.status(scrapeCreatorsResponse.status).json({ message: apiErrorMessage });
    }

    const results = await scrapeCreatorsResponse.json();
    console.log("Resposta recebida da API:", JSON.stringify(results, null, 2));

    if (results.status !== 'ok' || !results.data || !results.data.user) {
      console.error('Resposta inválida ou erro da Scrape Creators API:', results);
      let message = 'Falha ao obter dados do perfil (resposta inesperada da API).';
      if (results.message) {
        message = results.message;
      }
      
      const statusCode = (results.status && typeof results.status === 'number') 
        ? results.status 
        : (scrapeCreatorsResponse.status !== 200 ? scrapeCreatorsResponse.status : 500);
      
      return res.status(statusCode).json({ message });
    }
    
    const userProfile = results.data.user;
    const profilePicUrl = userProfile.profile_pic_url;
    const fullName = userProfile.full_name;
    const apiUsername = userProfile.username; 

    if (!profilePicUrl || !fullName || !apiUsername) {
      console.error('Dados de foto, nome completo ou username ausentes nos resultados da Scrape Creators API:', userProfile);
      return res.status(500).json({ message: 'Dados incompletos recebidos do provedor de API.' });
    }

    // Log da URL da imagem para debug
    console.log("URL da imagem de perfil retornada pela API:", profilePicUrl);

    // Usar o proxy de imagem para evitar bloqueio de CORS
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(profilePicUrl)}`;
    console.log("URL do proxy:", proxyUrl);

    const responseData = {
      profilePicUrl: proxyUrl,
      fullName,
      username: apiUsername,
    };

    console.log("Dados enviados ao cliente:", responseData);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error(`Erro no handler /api/instagram-profile:`, error);
    return res.status(500).json({ 
      message: `Erro interno no servidor: ${error.message || error.toString()}` 
    });
  }
});

// Rota para proxy de imagens (para evitar problemas de CORS)
app.get('/api/image-proxy', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    
    if (!imageUrl) {
      return res.status(400).send('URL da imagem é obrigatória');
    }
    
    console.log(`Proxy de imagem solicitado para: ${imageUrl}`);
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error(`Erro ao buscar imagem: ${response.status} ${response.statusText}`);
      return res.status(response.status).send('Erro ao buscar imagem');
    }
    
    // Pegar o tipo de conteúdo da resposta original
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Transformar em buffer e enviar
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('Erro no proxy de imagem:', error);
    res.status(500).send('Erro interno no servidor');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de API rodando em http://localhost:${PORT}`);
}); 