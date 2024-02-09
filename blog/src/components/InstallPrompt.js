function InstallPrompt(props){
  return (
    <div className='p-3 fixed-bottom end-0'>
      <button type="button" className="btn btn-info" onClick={props.onInstall}>
        Installer l'application
      </button>
    </div>
  );
}

export default InstallPrompt;