const navButton = document.getElementById('menu');
const navHolder = document.querySelector('.navigation');
const businessHolder = document.querySelector('.business');
const weatherData = document.getElementById('weather-data');
const viewButton = document.getElementById('view');

if (navButton) {
	navButton.addEventListener('click', () => {
		navButton.classList.toggle('active');
		navHolder.classList.toggle('active');
	});
}

if (businessHolder) {
    function createCompany(company) {
        const holder = document.createElement('section');
        const title = document.createElement('h2');
        const subtitle = document.createElement('h3');
        const detail = document.createElement('div');
        const image = document.createElement('img');
        const data = document.createElement('p');
        title.textContent = company.name || '';
        subtitle.textContent = company.subtitle || '';
        detail.classList.add('business-detail');
        image.src = company.image || '';
        image.alt = company.name || '';
        data.innerHTML = `
            <span class="bold">ADDRESS:</span> ${company.address || ''} <br>
            <span class="bold">PHONE:</span> ${company.phone || ''} <br>
            <span class="bold">URL:</span> ${company.url || ''} <br>
            <span class="bold">RANK:</span> ${company.rank || 'Bronze'} <br>
        `;

        holder.appendChild(title);
        holder.appendChild(subtitle);
        holder.appendChild(detail);
        detail.appendChild(image);
        detail.appendChild(data);
        businessHolder.appendChild(holder);
    }

    async function queryCompanyData() {
        let data = await fetch('data/members.json');
        if (data.ok) {
            data = await data.json();

            if (weatherData) {
                data = data.filter((company) => company.rank == 'Gold' || company.rank == 'Silver').sort((a) => (Math.random() * 2) - 1);
                data = data.splice(0, 3);
            }

            for (const company of data) {
                createCompany(company);
            }
        }
    }

    viewButton.addEventListener('click', () => {
        businessHolder.classList.toggle('grid');
        businessHolder.classList.toggle('list');
        viewButton.textContent = `Change View: ${businessHolder.classList.contains('list') ? 'List' : 'Grid'}`;
    });

    queryCompanyData();
}

if (weatherData) {
    const URL = 'https://api.openweathermap.org/data/2.5';
    async function fillData() {
        let data = await fetch(`${URL}/forecast/daily?lat=49.695087&lon=-112.845262&cnt=4&units=imperial&appid=85fd394a0405664633b0796bead3e79e`);
        if (data.ok) {
            data = await data.json();
        } else {
            console.log(`Failed to fetch data: ${await data.text()}`);
            data = { // placeholder data since the API key is not active currently.
                list: [
                    {
                        dt: 1774001448,
                        weather: {
                            description: "light rain"
                        },
                        temp: {
                            "day": 16,
                            "min": 10,
                            "max": 18
                        }
                    },
                    {
                        dt: 1774087848,
                        weather: {
                            description: "moderate rain"
                        },
                        temp: {
                            "day": 12,
                            "min": 5,
                            "max": 14
                        }
                    },
                    {
                        dt: 1774174248,
                        weather: {
                            description: "heavy rain"
                        },
                        temp: {
                            "day": 6,
                            "min": -1,
                            "max": 8
                        }
                    },
                    {
                        dt: 1774260648,
                        weather: {
                            description: "sunny"
                        },
                        temp: {
                            "day": 23,
                            "min": 17,
                            "max": 27
                        }
                    }
                ]
            };
        }

        const currentDay = data.list.splice(0, 1)[0];
        const desc = currentDay.weather.description;
        weatherData.innerHTML = [
            `<span class="bold">${currentDay.temp.day}C</span>`,
            desc.split(' ').map((word) => word.charAt(0).toLocaleUpperCase() + word.substring(1)).join(' '),
            ...data.list.map((day) => {
                return `${new Date(day.dt * 1000).toLocaleDateString('en-us', {weekday: 'long'})}: ${day.temp.day}C`
            })
        ].join('<br>');
    };

    fillData();
}