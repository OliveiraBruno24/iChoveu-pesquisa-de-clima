import { searchCities, getWeatherByCity } from './weatherAPI';

// const TOKEN = import.meta.env.VITE_TOKEN;
/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */
export function createCityElement(cityInfo) {
  const { name, country, temp, condition, icon } = cityInfo;

  const cityElement = createElement('li', 'city');

  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);

  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.appendChild(conditionElement);
  tempContainer.appendChild(tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const infoContainer = createElement('div', 'city-info-container');
  infoContainer.appendChild(tempContainer);
  infoContainer.appendChild(iconElement);

  cityElement.appendChild(headingElement);
  cityElement.appendChild(infoContainer);

  return cityElement;
}

/**
 * Lida com o evento de submit do formulário de busca
 */

export async function handleSearch(event) {
  event.preventDefault();
  clearChildrenById('cities');
  try {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value;
    // busca dados da cidade na API
    const cityData = await searchCities(searchValue);
    // mapeia os dados das cidades que peguei em cityData e chama a função pra pegar os dados do clima da cidade.
    const weatherPromises = cityData.map((city) => getWeatherByCity(city.url));
    // espera todas as promessas anteriores.
    const weatherData = await Promise.all(weatherPromises);
    // aqui eu quero 'casar' as informações da cidade com as do clima e extrair as q me interessam.
    const citiesInfo = cityData.map((city, index) => {
      return {
        country: city.country,
        name: city.name,
        temp: weatherData[index].temp,
        condition: weatherData[index].condition,
        icon: weatherData[index].icon,
      };
    });
    // aqui eu pego o elemento que tem o id cities, que é a lista de cidades da página.
    const citiesList = document.getElementById('cities');
    // itero em cada objeto que 'casei' em citiesInfo e coloco como filho do
    citiesInfo.forEach((city) => {
      // createCity... Recebe um objeto com as informações de uma cidade e retorna um elemento HTML.
      const cityElement = createCityElement(city);
      // então aqui, citiesLint é meu ul e está recebendo como 'filho' o objeto de cidades. Que 'casei' anteriormente
      citiesList.appendChild(cityElement);
    });
  } catch (error) {
    window.alert(error.message);
  }
}

// essa fritou os miolos kkkk tive q deixar as anotações pra n me perder
