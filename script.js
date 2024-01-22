// The previous script.js content remains the same until the `renderPagination` function

async function getRepositories() {
    const usernameInput = document.getElementById('usernameInput');
    const searchInput = document.getElementById('searchInput');
    const perPage = perPageInput.value;
    const username = usernameInput.value;

    if (!username) {
        alert('Please enter a GitHub username.');
        return;
    }

    if (perPage < 10 || perPage > 100) {
        alert('Repositories per page should be between 10 and 100.');
        return;
    }

    currentUsername = username;
    currentPage = 1;

    try {
        loader.style.display = 'block';
        repositoryList.innerHTML = '';
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`);
        const repositories = await response.json();
        loader.style.display = 'none';

        if (repositories.length === 0) {
            repositoryList.innerHTML = '<li>No repositories found.</li>';
        } else {
            repositories.forEach(repo => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>${repo.name}</strong>
                    <p>${repo.description || 'No description available.'}</p>
                    <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                `;
                repositoryList.appendChild(listItem);
            });
        }

        // Calculate total pages for pagination
        const linkHeader = response.headers.get('Link');
        if (linkHeader) {
            const links = linkHeader.split(',');
            const lastPageLink = links.find(link => link.includes('rel="last"'));
            if (lastPageLink) {
                totalPages = parseInt(lastPageLink.match(/&page=(\d+)/)[1]);
            }
        }

        // Render pagination buttons
        renderPagination();
    } catch (error) {
        console.error('Error fetching repositories:', error);
        alert('An error occurred while fetching repositories. Please try again.');
    }
}

// The rest of the script remains unchanged

