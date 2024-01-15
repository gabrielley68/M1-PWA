function Button(props){

  // Si 1 + 1 == 2, a = "bravo...", sinon "nul"
  const a = (1 + 1 == 2) ? "bravo les maths" : "nul";

  // Si 1 + 1 == 2, b = "bravo...", sinon false
  const b = (1 + 1 == 2) && "oui bravo les maths";

  // Si 1 + 1 == 2, c = 1 + 1 == 2 (donc true), sinon "nul"
  const c = (1 + 1 == 2) || "nul les maths";

  return (
    <div>
      {props.onClick ? 
        <button
          className={"btn " + props.className}
          type="button"
          onClick={props.onClick}
        >
          {props.name || "Click me"} {props.yelling && "!!!"}
        </button>
      :
        <a
          href={props.link}
          className={"btn " + (props.className || "btn-primary")}
          target="_blank"
        >
          {props.name || "Click me"} {props.yelling && "!!!"}
        </a>
      }
    </div>
  );
}

export default Button;