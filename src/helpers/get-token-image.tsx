import RugImg from "../assets/tokens/RUG.svg";
import SRugImg from "../assets/tokens/SRUG.png";

function toUrl(tokenPath: string): string {
  const host = window.location.origin;
  return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
  if (name === "time") {
    return toUrl(RugImg);
  }

  if (name === "memo") {
    return toUrl(SRugImg);
  }

  throw Error(`Token url doesn't support: ${name}`);
}
