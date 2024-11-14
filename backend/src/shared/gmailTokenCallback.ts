// callback.ts
import { getAccessToken } from "./gmailAuth";

// Replacr with Code value from URL params
const code =
  "4/0AeanS0a7VUPz7NMBCd5RzUMK9DYcogM0LMPWu1f0TemkpGSOUIs0FAgQD6PX0C-k8SBX0Q";

async function main() {
  try {
    await getAccessToken(code);
  } catch (error) {
    console.error("Wystąpił błąd podczas uzyskiwania tokenów:", error);
  }
}

main();
