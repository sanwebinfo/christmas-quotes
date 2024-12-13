import quotes from '.././src/data/quotes.json';

interface Quote {
  id: number;
  quote: string;
}

let currentPage = 1;
const quotesPerPage = 6;

function copyToClipboard(text: string, button: HTMLButtonElement) {
  navigator.clipboard.writeText(text).then(() => {
    button.innerHTML = `<i class="fas fa-check"></i>`;
    setTimeout(() => (button.innerHTML = `<i class="fas fa-copy"></i>`), 1500);
  }).catch((err) => {
    console.error("Error copying text: ", err);
  });
}

function renderQuotes(page: number) {
  const container = document.getElementById('quotes-container');
  const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
  const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;

  if (!container) return;

  container.innerHTML = '';
  const startIndex = (page - 1) * quotesPerPage;
  const endIndex = startIndex + quotesPerPage;

  const quotesToRender = quotes.slice(startIndex, endIndex);
  quotesToRender.forEach((quote: Quote) => {
    const card = document.createElement('div');
    card.className = 'column is-half';

    card.innerHTML = `
      <div class="card">
        <div class="card-content">
          <p class="quote-text">${quote.quote}</p>
          <button class="button is-small is-primary copy-btn mt-3">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>
    `;

    const copyBtn = card.querySelector('.copy-btn') as HTMLButtonElement;
    copyBtn.addEventListener('click', () => copyToClipboard(quote.quote, copyBtn));

    container.appendChild(card);
  });

  const totalPages = Math.ceil(quotes.length / quotesPerPage);
  if (totalPages <= 1) {
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  } else {
    renderPagination(page, totalPages);
  }
}

function renderPagination(currentPage: number, totalPages: number) {
  const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
  const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;

  if (currentPage === 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (currentPage === totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

document.getElementById('prev-btn')?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderQuotes(currentPage);
  }
});

document.getElementById('next-btn')?.addEventListener('click', () => {
  const totalPages = Math.ceil(quotes.length / quotesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderQuotes(currentPage);
  }
});

function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.contains('has-background-dark');
  body.classList.toggle('has-background-dark', !isDarkMode);
  body.classList.toggle('has-text-white', !isDarkMode);

  localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');

  const toggleInput = document.getElementById('dark-mode-toggle') as HTMLInputElement;
  toggleInput.checked = !isDarkMode;
}

const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme)) {
  document.body.classList.add('has-background-dark');
  document.body.classList.add('has-text-white');
  const toggleInput = document.getElementById('dark-mode-toggle') as HTMLInputElement;
  toggleInput.checked = true;
} else {
  document.body.classList.remove('has-background-dark');
  document.body.classList.remove('has-text-white');
  const toggleInput = document.getElementById('dark-mode-toggle') as HTMLInputElement;
  toggleInput.checked = false;
}

try {
  if (!quotes || quotes.length === 0) {
    throw new Error("No quotes found. Please check the quotes data.");
  }
  renderQuotes(currentPage);
} catch (error) {
  console.error("Error rendering quotes:", error);
  const container = document.getElementById('quotes-container');
  if (container) {
    container.innerHTML = `<p class="has-text-danger">Failed to load quotes</p>`;
  }
}

document.getElementById('dark-mode-toggle')?.addEventListener('change', toggleDarkMode);
