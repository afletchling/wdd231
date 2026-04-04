const navButton = document.getElementById('menu');
const navHolder = document.querySelector('.navigation');
const businessHolder = document.querySelector('.business');

const timestampField = document.getElementById('timestamp');
const thankYouMessage = document.getElementById('thank-you');

const weatherData = document.getElementById('weather-data');
const viewButton = document.getElementById('view');

const memberHolder = document.getElementById('membership-holder');

const discoveryHolder = document.getElementById('discover-holder');

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

if (discoveryHolder) {
    function createDiscoverCard(business) {
        const holder = document.createElement('figure');
        const title = document.createElement('h2');
        const address = document.createElement('address');
        const description = document.createElement('p');
        const image = document.createElement('img');
        const button = document.createElement('button');
        title.textContent = business.name || '';
        address.textContent = business.address || '';
        description.textContent = business.description || '';
        button.textContent = 'Learn More';
        image.src = business.image || '';
        image.alt = business.name || '';

        holder.appendChild(title);
        holder.appendChild(image);
        holder.appendChild(address);
        holder.appendChild(description);
        holder.appendChild(button);
        discoveryHolder.appendChild(holder);
    }

    async function displayDiscovery() {
        const {default: data} = await import('../data/discovery.mjs');

        for (const business of data) {
            createDiscoverCard(business);
        }
    }

    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        if (localStorage.getItem('lastVisit')) {
            const daysSince = Math.floor((Date.now() - Number.parseInt(localStorage.getItem('lastVisit'))) / (24 * 60 * 60 * 1000));

            if (daysSince >= 1) {
                welcomeMessage.textContent = `You last visited ${daysSince} days ago.`;
            } else {
                welcomeMessage.textContent = 'Back so soon! Awesome!';
            }
        } else {
            welcomeMessage.textContent = 'Welcome! Let us know if you have any questions.'
        }

        localStorage.setItem('lastVisit', Date.now());
    }

    displayDiscovery();
}

if (weatherData) {
    const URL = 'https://api.openweathermap.org/data/2.5';
    async function fillData() {
        let data = await fetch(`${URL}/forecast?lat=49.695087&lon=-112.845262&cnt=4&units=imperial&appid=85fd394a0405664633b0796bead3e79e`);
        if (data.ok) {
            data = await data.json();
        } else {
            console.log(`Failed to fetch data: ${await data.text()}`);
        }

        const currentDay = data.list.splice(0, 1)[0];
        const desc = currentDay.weather[0].description;
        weatherData.innerHTML = [
            `<span class="bold">${currentDay.main.temp.toFixed(0)}C</span>`,
            desc.split(' ').map((word) => word.charAt(0).toLocaleUpperCase() + word.substring(1)).join(' '),
            ...data.list.map((day) => {
                return `${new Date(day.dt * 1000).toLocaleDateString('en-us', {weekday: 'long'})}: ${day.main.temp.toFixed(0)}C`
            })
        ].join('<br>');
    };

    fillData();
}

if (memberHolder) {
    const MEMBERSHIPS = ['gold', 'silver', 'bronze', 'na'];

    for (const membership of MEMBERSHIPS) {
        const memberButton = memberHolder.querySelector(`#${membership}`);
        const memberDialog = document.getElementById(`${membership}-dialog`);
        const closeButton = memberDialog.querySelector('.close-dialog');

        memberButton.addEventListener('click', () => {
            memberDialog.showModal();
        });

        closeButton.addEventListener('click', () => {
            memberDialog.close();
        })
    }
}

if (thankYouMessage) {
    const args = new URLSearchParams(window.location.search);

    thankYouMessage.innerHTML = `
        Thank you for applying! <br>
        First Name: ${args.get('firstname')} <br>
        Last Name: ${args.get('lastname')} <br>
        Organization Name: ${args.get('orgname')} <br>
        Email: ${args.get('email')} <br>
        Phone Number: ${args.get('phone')} <br>
        Timestamp: ${args.get('timestamp')} <br>
    `;
}

if (timestampField) {
    timestampField.value = new Date(Date.now()).toLocaleString('en-us');
}