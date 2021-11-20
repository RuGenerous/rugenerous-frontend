import RugImg from "../assets/tokens/RUG.png";
import SRugImg from "../assets/tokens/SRUG.png";

function toUrl(tokenPath: string): string {
  const host = window.location.origin;
  return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
  if (name === "rug") {
    return toUrl(RugImg);
  }

  if (name === "srug") {
    return toUrl(SRugImg);
  }

  throw Error(`Token url doesn't support: ${name}`);
}
