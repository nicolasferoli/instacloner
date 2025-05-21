export interface Env {
  // Variável de ambiente para armazenar seu token da API da Apify
  APIFY_TOKEN: string;
  // Variável de ambiente para o ID do seu Actor da Apify
  APIFY_INSTAGRAM_ACTOR_ID: string;
}

export default {
  async fetch(request: Request, env: Env /*, ctx: ExecutionContext */): Promise<Response> {
    // ctx foi comentado pois não está sendo usado e pode causar erro de tipo
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Em produção, restrinja ao seu domínio frontend
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

		const url = new URL(request.url);

    if (url.pathname === '/api/apify-insta-profile') {
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

        if (!env.APIFY_TOKEN) {
          console.error('Token da APIFY_TOKEN não configurado no Worker.');
          return new Response(JSON.stringify({ message: 'Configuração do servidor incompleta (token ausente).' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        if (!env.APIFY_INSTAGRAM_ACTOR_ID) {
          console.error('ID do Actor da APIFY_INSTAGRAM_ACTOR_ID não configurado no Worker.');
          return new Response(JSON.stringify({ message: 'Configuração do servidor incompleta (ID do actor ausente).' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const trimmedUsername = username.trim();

        // Input para o Actor da Apify (pode variar dependendo do Actor)
        // Consulte a documentação do Actor específico que você está usando.
        const actorInput = {
          usernames: [trimmedUsername],
          // Outros parâmetros que o seu Actor possa precisar...
          // resultsLimit: 1, 
        };

        // URL para executar o Actor e obter o resultado do último run (ou de um run específico)
        // Consulte a documentação da API da Apify para a melhor forma de executar e obter resultados
        // https://docs.apify.com/api/v2#/reference/actors/run-actor-and-get-dataset-items
        const apifyActorRunUrl = `https://api.apify.com/v2/acts/${env.APIFY_INSTAGRAM_ACTOR_ID}/runs?token=${env.APIFY_TOKEN}`;
        
        console.log(`Chamando Apify Actor: ${env.APIFY_INSTAGRAM_ACTOR_ID} para o usuário: ${trimmedUsername}`);

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
          return new Response(JSON.stringify({ message: `Erro ao iniciar o scraper da Apify: ${apifyResponse.statusText}` }), {
            status: apifyResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // A resposta da execução de um run geralmente contém informações sobre o run, incluindo o datasetId.
        // Você precisará então buscar os itens do dataset.
        const runDetails = await apifyResponse.json() as any; // Tipar isso melhor com base na resposta da Apify
        const datasetId = runDetails.data?.defaultDatasetId;

        if (!datasetId) {
          console.error('Dataset ID não encontrado na resposta da Apify run.', runDetails);
          return new Response(JSON.stringify({ message: 'Falha ao obter resultados da Apify (datasetId ausente).'}), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Buscando os itens do dataset
        const datasetItemsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${env.APIFY_TOKEN}`;
        console.log(`Buscando itens do dataset da Apify: ${datasetId}`);
        const datasetResponse = await fetch(datasetItemsUrl);

        if (!datasetResponse.ok) {
          const errorText = await datasetResponse.text();
          console.error(`Erro ao buscar itens do dataset da Apify: ${datasetResponse.status} ${datasetResponse.statusText}`, errorText);
          return new Response(JSON.stringify({ message: `Erro ao buscar resultados da Apify: ${datasetResponse.statusText}` }), {
            status: datasetResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const results = await datasetResponse.json() as any[]; // Tipar isso com base no output do seu Actor

        if (!results || results.length === 0) {
          console.log('Nenhum resultado encontrado no dataset da Apify para o usuário:', trimmedUsername);
          return new Response(JSON.stringify({ message: 'Perfil não encontrado ou sem dados via Apify.' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Assumindo que o Actor retorna um array de perfis, e pegamos o primeiro.
        // Você PRECISARÁ AJUSTAR os nomes dos campos abaixo com base na saída REAL do seu Actor da Apify.
        const profile = results[0];
        const profilePicUrl = profile.profilePicUrl || profile.profile_pic_url || profile.profilePictureUrl || profile.avatarUrl;
        const fullName = profile.fullName || profile.full_name;
        // O username já temos, mas o actor pode retornar uma versão canonica.
        const apifyUsername = profile.username || trimmedUsername;

        if (!profilePicUrl || !fullName) {
          console.error('Dados de foto ou nome completo ausentes nos resultados da Apify:', profile);
          return new Response(JSON.stringify({ message: 'Dados incompletos recebidos da Apify.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const responseData = {
          profilePicUrl: profilePicUrl,
          fullName: fullName,
          username: apifyUsername,
        };

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error: any) {
        console.error('Erro no Worker ao processar /api/apify-insta-profile:', error);
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