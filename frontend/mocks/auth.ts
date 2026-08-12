import { MockLoginResponse } from "@/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function mockLogin(
  email: string,
  senha: string
): Promise<MockLoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const isEmailValid = EMAIL_REGEX.test(email);
  const isSenhaValid = senha === "123456";

  if (isEmailValid && isSenhaValid) {
    return {
      success: true,
      user: {
        nome: "Usuário PetCare",
        email,
      },
    };
  }

  return { success: false };
}
