const navButton = document.getElementById('menu');
const navHolder = document.querySelector('.navigation');
const businessHolder = document.querySelector('.business');

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
        `;

        holder.appendChild(title);
        holder.appendChild(subtitle);
        holder.appendChild(detail);
        detail.appendChild(image);
        detail.appendChild(data);
        businessHolder.appendChild(holder);
    }

    fetch('data/members.json').then(data => data.json()).then(data => {
        for (const company of data) {
            createCompany(company);
        }
    }).catch(reason => console.error(`Failed to fetch company data: ${reason}`));
}

if (navButton) {
	navButton.addEventListener('click', () => {
		navButton.classList.toggle('active');
		navHolder.classList.toggle('active');
	});
}