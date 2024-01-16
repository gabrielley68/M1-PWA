function getIdFromUrl(url){
  const parsedUrl = url.split('/');
  return parsedUrl[parsedUrl.length - 2];
}

function getImageSrcFromId(id){
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export { 
  getIdFromUrl,
  getImageSrcFromId
}