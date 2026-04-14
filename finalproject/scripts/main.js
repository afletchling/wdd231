const cardHolder = document.getElementById('card-holder');
const searchHolder = document.getElementById('search-form');
const filterHolder = document.getElementById('filter-holder');
const lastVisit = document.getElementById('last-visit');
const navButton = document.getElementById('menu');
const navHolder = document.querySelector('.navigation');

let cards = [];
const filters = {
    'All': () => true,
    'Above 150': (data) => data.h > 150,
    'Below 150': (data) => data.h <= 150,
};

async function run() {
    if (lastVisit) {
        lastVisit.textContent = new Date(Number.parseInt(localStorage.getItem('lastVisited') || Date.now())).toLocaleString('en-US');
        localStorage.setItem('lastVisited', Date.now());
    }

    if (cardHolder) {
        const { default: companyData } = await import('./companies.mjs');

        async function fetchData(stocks) {
            let data = [];

            try
            {
                let reqData = await fetch("./data/stocks.json");
                reqData = await reqData.json();

                for (const stock of reqData) {
                    if (stocks.includes(stock.name)) {
                        data.push(stock);
                    }
                }
            }
            catch (exp)
            {
                console.error(exp);
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
            stocks = await fetchData(stocks);

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

if (navButton) {
    navButton.addEventListener('click', () => {
        navButton.classList.toggle('active');
        navHolder.classList.toggle('active');
    });
}

run();