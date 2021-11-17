import RugImg from "../assets/tokens/token_RUG.svg";
import SRugImg from "../assets/tokens/token_sRUG.svg";
import { SvgIcon } from "@material-ui/core";
import { ReactComponent as Rug } from "../assets/tokens/token_RUG.svg";
import { ReactComponent as SRug } from "../assets/tokens/token_sRUG.svg";

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

function getSrugTokenImage() {
  return <SvgIcon component={SRug} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getRugTokenImage(w?: number, h?: number) {
  const height = h == null ? "32px" : `${h}px`;
  const width = w == null ? "32px" : `${w}px`;
  return <SvgIcon component={Rug} viewBox="0 0 32 32" style={{ height, width }} />;
}

export function getTokenImage(name: string) {
  if (name === "rug") return getRugTokenImage();
  if (name === "srug") return getSrugTokenImage();
}
