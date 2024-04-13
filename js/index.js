document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (!searchTerm) return;
  
      try {
        const users = await searchUsers(searchTerm);
        displayUsers(users);
      } catch (error) {
        console.error('Error searching for users:', error);
      }
    });
  
    async function searchUsers(query) {
      const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      const data = await response.json();
      return data.items;
    }
  
    async function getUserRepositories(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      const data = await response.json();
      return data.length;
    }
  
    async function displayUsers(users) {
      userList.innerHTML = '';
      for (const user of users) {
        const li = document.createElement('li');
        const repoCount = await getUserRepositories(user.login);
        li.innerHTML = `
          <div>
            <a href="${user.html_url}" target="_blank">${user.login}</a>
            <span>Repositories: ${repoCount}</span>
          </div>`;
        userList.appendChild(li);
      }
    }
  });
  