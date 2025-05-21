
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import LoadingOverlay from "@/components/LoadingOverlay";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Sucesso",
        description: "Cadastro realizado com sucesso!",
      });
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {loading && <LoadingOverlay />}
      
      <div className="clonegram-container p-8 w-full max-w-md">
        <Logo />
        
        <h1 className="text-2xl font-bold text-center mb-6 text-instacloner-textPrimary">Criar uma nova conta</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              className="w-full py-6 px-4"
              placeholder="Nome completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Input
              className="w-full py-6 px-4"
              placeholder="E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Input
              className="w-full py-6 px-4"
              placeholder="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Input
              className="w-full py-6 px-4"
              placeholder="Confirmar senha"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          <div className="pt-2">
            <button type="submit" className="clonegram-button-primary">
              Cadastrar
            </button>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-instacloner-textSecondary">
              Já tem uma conta? <a href="/" className="text-blue-500 font-medium">Entrar</a>
            </p>
          </div>
        </form>
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

export default Register;
