export interface Env {
  // Variável de ambiente para armazenar seu token da API da Scrape Creators
  SCRAPECREATORS_API_KEY: string; 
}

// Exportamos a função fetch diretamente
export async function fetch(request: Request, env: Env /*, ctx: ExecutionContext */): Promise<Response> {
    // ctx foi comentado pois não está sendo usado e pode causar erro de tipo
    const allowedOrigin = 'https://instacloner.vercel.app'; // Seu domínio Vercel
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin, 
      'Access-Control-Allow-Methods': 'POST, OPTIONS', 
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Lidar com a requisição preflight OPTIONS
    if (request.method === 'OPTIONS') {
      // Verificar se a origem da requisição é a permitida
      if (request.headers.get('Origin') === allowedOrigin) {
        return new Response(null, { headers: corsHeaders });
      } else {
        // Se a origem não for permitida, retornar uma resposta sem os cabeçalhos CORS de permissão
        return new Response(null, { status: 403 }); // Forbidden
      }
    }

    const url = new URL(request.url);

    // O endpoint é definido pelo nome do arquivo, então a verificação interna de url.pathname não é mais estritamente necessária aqui,
    // mas pode ser mantida para clareza ou se você planeja ter múltiplos handlers neste arquivo no futuro (menos comum).
    // Para a Vercel, /api/instagram-profile.ts já mapeia para este endpoint.
    console.log("Accessed /api/instagram-profile endpoint (new location)"); 
    if (request.method !== 'POST') { 
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

      if (!env.SCRAPECREATORS_API_KEY) {
        console.error('Token da SCRAPECREATORS_API_KEY não configurado no Worker.');
        return new Response(JSON.stringify({ message: 'Configuração do servidor incompleta (API key ausente).' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const trimmedUsername = username.trim();
      const scrapeCreatorsUrl = `https://api.scrapecreators.com/v1/instagram/profile?username=${trimmedUsername}`;
      
      console.log(`Chamando Scrape Creators API para o usuário: ${trimmedUsername}`);

      const scrapeCreatorsResponse = await globalThis.fetch(scrapeCreatorsUrl, {
        method: 'GET',
        headers: {
          'x-api-key': env.SCRAPECREATORS_API_KEY,
        },
      });

      if (!scrapeCreatorsResponse.ok) {
        const errorText = await scrapeCreatorsResponse.text();
        console.error(`Erro ao chamar Scrape Creators API: ${scrapeCreatorsResponse.status} ${scrapeCreatorsResponse.statusText}`, errorText);
        // Retornar a mensagem de erro da API, se disponível, ou uma genérica.
        let apiErrorMessage = `Erro ao buscar dados do perfil: ${scrapeCreatorsResponse.statusText}`;
        try {
            const parsedError = JSON.parse(errorText);
            if (parsedError && parsedError.message) {
                apiErrorMessage = parsedError.message;
            }
        } catch (e) {
            // errorText não era JSON, usar o statusText ou o errorText bruto se relevante
            if(errorText.length < 100) apiErrorMessage = errorText; // Evitar mensagens de erro muito longas e ilegíveis
        }
        return new Response(JSON.stringify({ message: apiErrorMessage }), {
          status: scrapeCreatorsResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const results = await scrapeCreatorsResponse.json() as any; 

      if (results.status !== 'ok' || !results.data || !results.data.user) {
        console.error('Resposta inválida ou erro da Scrape Creators API:', results);
        let message = 'Falha ao obter dados do perfil (resposta inesperada da API).';
        if (results.message) {
          message = results.message;
        }
        return new Response(JSON.stringify({ message }), {
          // Tenta usar o status da API se for um número, caso contrário, 500 ou o status da scrapeCreatorsResponse
          status: (results.status && typeof results.status === 'number') ? results.status : (scrapeCreatorsResponse.status !== 200 ? scrapeCreatorsResponse.status : 500),
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
      console.error(`Erro no Worker /api/instagram-profile:`, error);
      return new Response(JSON.stringify({ message: `Erro interno no servidor: ${error.message || error.toString()}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
} 