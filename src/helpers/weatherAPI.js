// Remova os comentários a medida que for implementando as funções
const TOKEN = import.meta.env.VITE_TOKEN;

export const searchCities = async (term) => {
  // console.log(term);
  const response = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`);
  const data = await response.json();
  if (data.length === 0) {
    window.alert('Nenhuma cidade encontrada'); // como eu sei oq é esse erro? sempre vejo usarem assim mas n sei de onde busca essa msg
  }
  return data;
};

export const getWeatherByCity = (/* cityURL */) => {
//   seu código aqui
};
