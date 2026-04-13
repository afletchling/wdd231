const cardHolder = document.getElementById('card-holder');
const searchHolder = document.getElementById('search-form');
const filterHolder = document.getElementById('filter-holder');
let cards = [];
const filters = {
    'All': () => true,
    'Above 200': (data) => data.h > 200,
    'Below 200': (data) => data.h < 200,
};

async function run() {
    if (cardHolder) {
        const { default: companyData } = await import('./companies.mjs');

        function fetchData(stocks) {
            let data = [];

            for (const stock of stocks) { // I realized that all stock api's are not really available for commercial use, so this project will fall flat in such.
                data.push({
                    name: stock,
                    h: Math.floor(Math.random() * 10000) / 10,
                    l: Math.floor(Math.random() * 10000) / 10
                });
            }

            return data;
        }

        async function createCard(data) {
            const card = document.createElement('section');
            const title = document.createElement('h2');
            const desc = document.createElement('p');
            title.textContent = data.name;
            desc.innerHTML = `
                High: ${data.h} <br>
                Low: ${data.l}
            `;

            card.appendChild(title);
            card.appendChild(desc);
            cards.push(card);
            cardHolder.append(card);
            return title;
        }

        async function createCards(stocks, filter) {
            for (const card of cards) {
                cardHolder.removeChild(card);
            }
            cards = [];
            stocks = fetchData(stocks);

            if (filter) {
                stocks = stocks.filter(filter);
            }

            for (const stock of stocks) {
                createCard(stock);
            }
        }

        if (searchHolder) {
            const args = new URLSearchParams(window.location.search);
            if (args.has('search')) {
                createCards([args.get('search').toLocaleUpperCase()]);
            }
        } else if (filterHolder) {
            for (const [name, filter] of Object.entries(filters)) {
                const li = document.createElement('li');
                const button = document.createElement('a');
                button.textContent = name;

                button.addEventListener('click', () => createCards(companyData, filter));

                li.appendChild(button);
                filterHolder.appendChild(li);
            }

            createCards(companyData);
        } else {
            createCards(companyData);
        }
    }
}

run();