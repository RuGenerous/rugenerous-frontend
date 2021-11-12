import RugLogo from "../../assets/RuGenerous Logo.svg";
import "./notfound.scss";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://rug.farm" target="_blank">
          <img className="branding-header-icon" src={RugLogo} alt="RugDAO" />
        </a>

        <h4>Page not found</h4>
      </div>
    </div>
  );
}
