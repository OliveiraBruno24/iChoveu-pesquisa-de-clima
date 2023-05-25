// Remova os comentários a medida que for implementando as funções
const TOKEN = import.meta.env.VITE_TOKEN;

const inputEl = document.querySelector('#search-input');
export const searchCities = async (term) => {
  term = inputEl.value;
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`);
    const data = await response.json();
    return data;
  } catch {
    if (data.length === 0) {
      return error.message; // como eu sei oq é esse erro? sempre vejo usarem assim mas n sei de onde busca essa msg
    }
  }
};

export const getWeatherByCity = (/* cityURL */) => {
//   seu código aqui
};
