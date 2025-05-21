// api/apify-insta-profile.js

export default async function handler(request, response) {
  // Permitir requisições de qualquer origem para desenvolvimento
  // Em produção, você pode querer restringir isso ou deixar a Vercel gerenciar.
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido. Use POST.' });
  }

  try {
    const { username } = request.body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return response.status(400).json({ message: 'Nome de usuário ausente ou inválido.' });
    }

    const APIFY_TOKEN = process.env.APIFY_TOKEN;
    const APIFY_INSTAGRAM_ACTOR_ID = process.env.APIFY_INSTAGRAM_ACTOR_ID; // Você precisará me fornecer este ID

    if (!APIFY_TOKEN) {
      console.error('Token da APIFY_TOKEN não configurado nas variáveis de ambiente da Vercel.');
      return response.status(500).json({ message: 'Configuração do servidor incompleta (token ausente).' });
    }
    
    if (!APIFY_INSTAGRAM_ACTOR_ID) {
      console.error('ID do Actor da APIFY_INSTAGRAM_ACTOR_ID não configurado nas variáveis de ambiente da Vercel.');
      return response.status(500).json({ message: 'Configuração do servidor incompleta (ID do actor ausente).' });
    }

    const trimmedUsername = username.trim();

    // Input para o Actor da Apify - PRECISA SER AJUSTADO COM BASE NO SEU ACTOR ESCOLHIDO
    // Exemplo genérico, assumindo que o actor pode aceitar um array de usernames
    // ou directUrls. Você precisa verificar a documentação do SEU actor.
    const actorInput = {
       // Opção 1: Se o actor espera usernames
       // usernames: [trimmedUsername],
       // Opção 2: Se o actor espera URLs diretas (como no seu exemplo anterior)
       directUrls: [`https://www.instagram.com/${trimmedUsername}/`],
       // Adicione outros parâmetros obrigatórios ou opcionais do seu actor aqui
       // Exemplo: resultsLimit: 1, (para buscar apenas 1 perfil)
       // Exemplo: resultsType: "profile", (ou "posts", "details", etc. dependendo do actor)
    };
    
    // Se você souber que o actor é, por exemplo, "shu8hvrXbJbY3Eb9W" e ele espera 'directUrls':
    // const actorInput = {
    //   directUrls: [`https://www.instagram.com/${trimmedUsername}/`],
    //   resultsType: "posts", // Ou "profile" se disponível e mais leve
    //   resultsLimit: 1, // Se você só quer os dados do perfil, não múltiplos posts
    //   // ... outros parâmetros específicos do actor shu8hvrXbJbY3Eb9W
    // };


    const apifyActorRunUrl = `https://api.apify.com/v2/acts/${APIFY_INSTAGRAM_ACTOR_ID}/runs?token=${APIFY_TOKEN}`;
    
    console.log(`Chamando Apify Actor: ${APIFY_INSTAGRAM_ACTOR_ID} para o usuário: ${trimmedUsername}`);

    const apifyResponse = await fetch(apifyActorRunUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actorInput),
    });

    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      console.error(`Erro ao chamar Apify Actor Run: ${apifyResponse.status} ${apifyResponse.statusText}`, errorText);
      return response.status(apifyResponse.status).json({ message: `Erro ao iniciar o scraper da Apify: ${apifyResponse.statusText}` });
    }

    const runDetails = await apifyResponse.json();
    const datasetId = runDetails.data?.defaultDatasetId;

    if (!datasetId) {
      console.error('Dataset ID não encontrado na resposta da Apify run.', runDetails);
      return response.status(500).json({ message: 'Falha ao obter resultados da Apify (datasetId ausente).' });
    }

    // Adicionado &limit=1 para pegar apenas o primeiro item (o perfil) e &clean=true para dados mais limpos
    const datasetItemsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=1&clean=true`; 
    console.log(`Buscando itens do dataset da Apify: ${datasetId}`);
    const datasetResponse = await fetch(datasetItemsUrl);

    if (!datasetResponse.ok) {
      const errorText = await datasetResponse.text();
      console.error(`Erro ao buscar itens do dataset da Apify: ${datasetResponse.status} ${datasetResponse.statusText}`, errorText);
      return response.status(datasetResponse.status).json({ message: `Erro ao buscar resultados da Apify: ${datasetResponse.statusText}` });
    }

    const results = await datasetResponse.json();

    if (!results || results.length === 0) {
      console.log('Nenhum resultado encontrado no dataset da Apify para o usuário:', trimmedUsername);
      return response.status(404).json({ message: 'Perfil não encontrado ou sem dados via Apify.' });
    }

    const profile = results[0]; // Pegamos o primeiro item do dataset

    // AJUSTE ESTES CAMPOS COM BASE NA SAÍDA REAL DO SEU ACTOR ESCOLHIDO
    const profilePicUrl = profile.profilePicUrlHd || profile.profilePicUrl || profile.profile_pic_url_hd || profile.profile_pic_url || profile.profilePictureUrl || profile.avatarUrl;
    const fullName = profile.fullName || profile.full_name;
    const apifyUsername = profile.username || trimmedUsername; // O username pode vir canonizado

    if (!profilePicUrl || !fullName) {
      console.error('Dados de foto ou nome completo ausentes nos resultados da Apify:', profile);
      // Logue o objeto 'profile' inteiro para ver o que a Apify retornou
      console.log('Objeto de perfil completo da Apify:', JSON.stringify(profile, null, 2));
      return response.status(500).json({ message: 'Dados incompletos recebidos da Apify. Verifique os logs da função.' });
    }

    const responseData = {
      profilePicUrl: profilePicUrl,
      fullName: fullName,
      username: apifyUsername,
    };

    return response.status(200).json(responseData);

  } catch (error) {
    console.error('Erro na Vercel Function /api/apify-insta-profile:', error);
    // Evite vazar detalhes do erro para o cliente em produção, mas útil para depuração
    return response.status(500).json({ message: `Erro interno no servidor: ${error.message || error.toString()}` });
  }
} 