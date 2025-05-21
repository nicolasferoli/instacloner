export interface Env {
  // Variável de ambiente para armazenar seu token da API da Scrape Creators
  SCRAPECREATORS_API_KEY: string; 
}

export default {
  async fetch(request: Request, env: Env /*, ctx: ExecutionContext */): Promise<Response> {
    // ctx foi comentado pois não está sendo usado e pode causar erro de tipo
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Em produção, restrinja ao seu domínio frontend
      'Access-Control-Allow-Methods': 'POST, OPTIONS', // Mantendo POST para a requisição do cliente
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Endpoint alterado para /api/instagram-profile
    if (url.pathname === '/api/instagram-profile') { 
      if (request.method !== 'POST') { // Mantendo a expectativa de POST do cliente
        return new Response(JSON.stringify({ message: 'Método não permitido. Use POST.' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        const body = await request.json() as { username?: string };
        const username = body.username;

        if (!username || typeof username !== 'string' || !username.trim()) {
          return new Response(JSON.stringify({ message: 'Nome de usuário ausente ou inválido.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Verificação da nova variável de ambiente
        if (!env.SCRAPECREATORS_API_KEY) {
          console.error('Token da SCRAPECREATORS_API_KEY não configurado no Worker.');
          return new Response(JSON.stringify({ message: 'Configuração do servidor incompleta (API key ausente).' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const trimmedUsername = username.trim();

        // Nova lógica para chamar a API Scrape Creators
        const scrapeCreatorsUrl = `https://api.scrapecreators.com/v1/instagram/profile?username=${trimmedUsername}`;
        
        console.log(`Chamando Scrape Creators API para o usuário: ${trimmedUsername}`);

        const scrapeCreatorsResponse = await fetch(scrapeCreatorsUrl, {
          method: 'GET', // API da Scrape Creators espera GET
          headers: {
            'x-api-key': env.SCRAPECREATORS_API_KEY,
            // 'Content-Type': 'application/json', // Geralmente não necessário para GET simples
          },
        });

        if (!scrapeCreatorsResponse.ok) {
          const errorText = await scrapeCreatorsResponse.text();
          console.error(`Erro ao chamar Scrape Creators API: ${scrapeCreatorsResponse.status} ${scrapeCreatorsResponse.statusText}`, errorText);
          return new Response(JSON.stringify({ message: `Erro ao buscar dados do perfil: ${scrapeCreatorsResponse.statusText}` }), {
            status: scrapeCreatorsResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const results = await scrapeCreatorsResponse.json() as any; 

        if (results.status !== 'ok' || !results.data || !results.data.user) {
          console.error('Resposta inválida ou erro da Scrape Creators API:', results);
          let message = 'Falha ao obter dados do perfil (resposta inesperada da API).';
          if (results.message) { // Se a API ScrapeCreators retornar uma mensagem de erro específica
            message = results.message;
          }
          return new Response(JSON.stringify({ message }), {
            status: results.status && typeof results.status === 'number' ? results.status : 500, // Tenta usar o status da API se for um número
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const userProfile = results.data.user;

        const profilePicUrl = userProfile.profile_pic_url;
        const fullName = userProfile.full_name;
        const apiUsername = userProfile.username; 

        if (!profilePicUrl || !fullName || !apiUsername) {
          console.error('Dados de foto, nome completo ou username ausentes nos resultados da Scrape Creators API:', userProfile);
          return new Response(JSON.stringify({ message: 'Dados incompletos recebidos do provedor de API.' }), {
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const responseData = {
          profilePicUrl: profilePicUrl,
          fullName: fullName,
          username: apiUsername,
        };

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error: any) {
        console.error(`Erro no Worker ao processar /api/instagram-profile:`, error);
        return new Response(JSON.stringify({ message: `Erro interno no worker: ${error.message || error.toString()}` }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Endpoint não encontrado.', {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },
}; // Removido 'satisfies ExportedHandler<Env>' para simplificar e evitar erro de tipo 