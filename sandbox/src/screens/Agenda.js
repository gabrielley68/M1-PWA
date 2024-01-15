const weekdays = [
  "lundi", "mardi", "mercredi",
  "jeudi", "vendredi", "samedi", "dimanche" 
];

function Agenda(props){
  // const capitalizedWeekdays = weekdays.map((day) => day.toUpperCase());

  return (
    <div className="m-3">
      <ul>
      {weekdays.map((day) => (
        <li
          key={day}
          className={day == props.day ? "fw-bold" : ""}
          style={{fontWeight: day == props.day ? 700 : 400}}
        >
          {props.day == day ? (
            <b>
              {day.toUpperCase()}
            </b>
          ) : (
              day.toUpperCase()
          )}
        </li>
      ))}
      </ul>
    </div>
  )
}

export default Agenda;