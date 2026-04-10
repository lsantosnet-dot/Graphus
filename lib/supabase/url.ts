export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your local IP or production domain
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel for preview/prod
    "http://localhost:3000";
  
  // Inclui https:// se não for localhost
  url = url.includes("http") ? url : `https://${url}`;
  
  // Garante que não tenha barra no final (Supabase redireciona para rotas filhas às vezes)
  // Mas para o emailRedirectTo, uma barra no final é padrão.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  
  return url;
};
