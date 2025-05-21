import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProfileData {
  profilePicUrl: string;
  username: string;
  fullName: string;
}

const Home = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showProfileConfirmation, setShowProfileConfirmation] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite um nome de usuário",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setProfileData(null);
    
    try {
      const response = await fetch('/api/apify-insta-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Erro ao buscar perfil. A API da Apify retornou um erro." }));
        throw new Error(errorData.message || `Erro ${response.status} ao buscar o perfil via Apify.`);
      }

      const data: ProfileData = await response.json();
      
      if (!data.profilePicUrl || !data.fullName) { 
        throw new Error("Dados do perfil recebidos da Apify incompletos.");
      }

      setProfileData({
        username: username.trim(), 
        profilePicUrl: data.profilePicUrl,
        fullName: data.fullName,
      });
      setShowProfileConfirmation(true);

    } catch (error) {
      console.error("Erro ao buscar perfil via Apify:", error);
      toast({
        title: "Erro de API (Apify)",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao buscar o perfil via Apify.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleClone = () => {
    toast({
      title: "Sucesso",
      description: "Perfil clonado com sucesso!",
    });
    setShowProfileConfirmation(false);
  };
  
  const handleBack = () => {
    setProfileData(null);
    setShowProfileConfirmation(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {loading && <LoadingOverlay />}
      
      <div className="clonegram-container p-8 w-full max-w-md">
        <Logo />
        
        {!showProfileConfirmation ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <Input
                className="w-full py-6 px-4 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                placeholder="Digite o perfil que deseja clonar"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="text-center">
              <p className="text-instacloner-warning text-sm">
                * Lembre-se de usar o app com moderação. A pessoa com o Instagram clonado não será notificada de nada, então não comece ações anormais.
              </p>
            </div>
            
            <div>
              <button type="submit" className="clonegram-button-primary">
                Clonar perfil
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profileData?.profilePicUrl} alt={profileData?.username} />
              <AvatarFallback className="bg-gray-700 text-gray-100">{profileData?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold text-gray-100">@{profileData?.username}</h2>
              <p className="text-gray-400">{profileData?.fullName}</p>
            </div>
            
            <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <p className="text-center text-lg text-gray-200">
                Deseja clonar este perfil do Instagram?
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <button onClick={handleClone} className="clonegram-button-primary">
                Clonar perfil
              </button>
              
              <button onClick={handleBack} className="clonegram-button-secondary">
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 w-full max-w-md px-4">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4 text-gray-200">Tenha acesso a diversas funções</h2>
          <p className="text-gray-400">
            Acesse funções exclusivas: stories anônimos, download de mídia, visualizações ocultas e rastreamento de visitantes ao seu perfil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
