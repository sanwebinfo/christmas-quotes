import quotes from '.././src/data/quotes.json';

interface Quote {
  id: number;
  quote: string;
}

const quotesPerPage = 6;
let currentPage = parseInt(localStorage.getItem('currentPage') || '1', 10);

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
  const loadingSpinner = document.getElementById('loading-spinner');
  const darkModeToggle = document.getElementById('toggle-hide');

  if (!container || !loadingSpinner || !prevBtn || !nextBtn || !darkModeToggle) return;

  loadingSpinner.classList.remove('is-hidden');
  container.classList.add('is-hidden');
  prevBtn.classList.add('is-hidden');
  nextBtn.classList.add('is-hidden');
  darkModeToggle.classList.add('is-hidden');

  setTimeout(() => {
    container.innerHTML = '';
    const startIndex = (page - 1) * quotesPerPage;
    const endIndex = startIndex + quotesPerPage;

    const quotesToRender = quotes.slice(startIndex, endIndex);
    quotesToRender.forEach((quote: Quote) => {
      const card = document.createElement('div');
      card.className = 'box';

      card.innerHTML = `
          <div class="content">
            <p class="quote-text">${quote.quote}</p>
            <button class="button is-small is-primary copy-btn mt-3">
              <i class="fas fa-copy"></i>
            </button>
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

    loadingSpinner.classList.add('is-hidden');
    container.classList.remove('is-hidden');
    prevBtn.classList.remove('is-hidden');
    nextBtn.classList.remove('is-hidden');
    darkModeToggle.classList.remove('is-hidden');

    localStorage.setItem('currentPage', page.toString());
  
  }, 500);
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
