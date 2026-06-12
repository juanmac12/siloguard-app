import { Redirect } from "expo-router";

export default function Index() {
  // Después acá va la lógica: si el usuario ya está logueado → Dashboard
  // Por ahora, siempre va al welcome
  return <Redirect href="/welcome" />;
}
