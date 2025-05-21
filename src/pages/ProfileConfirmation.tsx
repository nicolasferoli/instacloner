
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileData {
  profilePic: string;
  username: string;
  fullName: string;
  bio: string;
  isPrivate: boolean;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

interface LocationState {
  username: string;
  profileData: ProfileData;
}

const ProfileConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = location.state as LocationState;
  
  useEffect(() => {
    if (!state?.username) {
      toast({
        title: "Erro",
        description: "Perfil não encontrado. Por favor, tente novamente.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [state, navigate, toast]);
  
  const handleClone = () => {
    navigate("/sales");
  };
  
  const handleBack = () => {
    navigate("/");
  };
  
  if (!state?.profileData) {
    return null;
  }
  
  const { profileData } = state;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="clonegram-container p-8 w-full max-w-md">
        <Logo />
        
        <div className="mt-6 flex flex-col items-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profileData.profilePic} alt={profileData.username} />
            <AvatarFallback>{profileData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold text-instacloner-textPrimary">@{profileData.username}</h2>
            <p className="text-instacloner-textSecondary">{profileData.fullName}</p>
          </div>
        </div>
        
        <div className="mt-8 bg-purple-50 p-6 rounded-xl">
          <p className="text-center text-lg text-instacloner-textPrimary">
            Deseja clonar este perfil do Instagram?
          </p>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button onClick={handleClone} className="clonegram-button-primary">
            Clonar perfil
          </button>
          
          <button onClick={handleBack} className="clonegram-button-secondary">
            Voltar
          </button>
        </div>
      </div>
      
      <div className="clonegram-container p-8 mt-6 w-full max-w-md">
        <div className="text-center">
          <p className="text-instacloner-textPrimary">
            Não tem uma conta? <a href="/register" className="text-blue-500 font-medium">Cadastre-se</a>
          </p>
        </div>
      </div>
      
      <div className="mt-6 w-full max-w-md px-4">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4 text-instacloner-textPrimary">Tenha acesso a diversas funções</h2>
          <p className="text-instacloner-textSecondary">
            Veja stories sem ser descoberto, baixe fotos de visualização única, oculte suas visualizações de mensagens e descubra quem visita seu perfil — e quantas vezes! Além disso, recupere conversas onde foi citado e muito mais!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileConfirmation;
