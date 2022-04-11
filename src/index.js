import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    contryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    event.preventDefault();
    const textInput = refs.searchBox.value.trim();
    refs.contryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';

    if (textInput) {
        fetchCountries(textInput)
            .then(showCountriesCard)
            .catch(error => { return Notiflix.Notify.failure('Oops, there is no country with that name') });
    }
}

    function showCountriesCard(data) {
        if (data.length > 10) {
            return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
        countriesMarkup(data);
    }

    function countriesMarkup(data) {
        const markup = data.map(({ flags: { svg }, name: { official } }) => {
            return `<li class='text-decoration'>
            <img src='${svg}' alt='${official}' width=70 height=50/>
            <p>${official}</p>
            </li>`
        }).join('');

        if (data.length === 1) {
            const languages = Object.values(data[0].languages);
            const markupInfo = `<ul>
        <li><span class='infoDec'>Capital:</span> ${data[0].capital}</li>
        <li><span class='infoDec'>Population:</span> ${data[0].population}</li>
        <li><span class='infoDec'>Languages:</span> ${languages}</li>
</ul>`;
            refs.countryInfo.insertAdjacentHTML('beforeend', markupInfo);
        }
        return refs.contryList.insertAdjacentHTML('beforeend', markup);
    }


