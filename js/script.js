
fetch('https://api.github.com/users/emilnilsson12/repos')
    .then(response => response.json())
    .then(repos => {

        console.log("Repos clean");
        console.table(repos, ["name", "updated_at"]);

        const noForks = repos.filter(repo => repo.fork == false);
        const excludeThisPortolio = noForks.filter(repo => repo.name != 'portfolio');
        const sortedByLastUpdate = sortByLastUpdated(excludeThisPortolio);

        renderRepos(sortedByLastUpdate);
    })

    
    function renderRepos(repos) {
        
        const ulTag = document.getElementById('navUl');
        ulTag.innerHTML = '<li><a href="#start"><div>BACK TO TOP</div></a></li>';
        const projectsSection = document.getElementById('projects');
        projectsSection.innerHTML = '';
        for (repo of repos) {
            
        // Add link in nav
        // Create a li for each repo, and add it to the nav
        const liTag = document.createElement('li');
        const liDiv = document.createElement('div');
        liDiv.innerHTML = `
            <a href="#${repo.name}">
                ${repo.name}
            </a>
        `;

        const articleTag = document.createElement('article');
        articleTag.classList.add('project');
        articleTag.id = `${repo.name}`;
        articleTag.innerHTML = `
            <h2>${repo.name}</h2>
            <p>${repo.description}</p>
        `;
        
        if (repo["has_pages"]) {
            const linkToLiveDemo = `<a href="https://${repo.owner.login}.github.io/${repo.name}/" target="_blank" class="liveDemo projectLink">Click here to try it!</a>`;
            console.log("Has live demo!");
            articleTag.insertAdjacentHTML('beforeend', linkToLiveDemo)

            liDiv.insertAdjacentHTML('beforeend', '<em>Live demo included</em>')
        }
        else {
            articleTag.insertAdjacentHTML('beforeend', "<div class='underConstruction projectLink'><strong>Live demo coming soon!</strong></div>")
        }
        
        liTag.appendChild(liDiv);
        ulTag.appendChild(liTag);

        projectsSection.appendChild(articleTag);
    }
}



function sortByLastUpdated(repos) {

    // Convert from string of format ["YYYY-MM-DDTHH:MM:SS"] 
    // To array of [YYYY, MM, DD]
    repos.forEach(repo => {

        // Replace string of whole date to just the year-month-day
        let repoDate = repo["updated_at"];
        repoDate = repoDate.split("-");
        repoDate[2] = repoDate[2].split("T")[0];

        // Replace the array of strings with array of numbers
        let dateFormattedWithNums = [];
        repoDate.forEach(dateSegment => {
            dateSegment = parseInt(dateSegment);
            dateFormattedWithNums.push(dateSegment);
        });
        repo["updated_at"] = dateFormattedWithNums;
    });

    do {
        swap = false;

        for (let i = 0; i < repos.length - 1; i++) {
            let temp;
            // let myDate = repos[i];
            // Bubble the oldest year down in the array
            if (repos[i]["updated_at"][0] < repos[i + 1]["updated_at"][0]) {
                temp = repos[i];
                repos[i] = repos[i + 1];
                repos[i + 1] = temp;
                swap = true;
            } else if (repos[i]["updated_at"][0] == repos[i + 1]["updated_at"][0]) {
                // If the year is the same
                // Bubble the oldest month down the array
                if (repos[i]["updated_at"][1] < repos[i + 1]["updated_at"][1]) {
                    temp = repos[i];
                    repos[i] = repos[i + 1];
                    repos[i + 1] = temp;
                    swap = true;
                } else if (repos[i]["updated_at"][1] == repos[i + 1]["updated_at"][1]) {
                    // If the year AND month is the same
                    // Bubble the oldest day down the array
                    if (repos[i]["updated_at"][2] < repos[i + 1]["updated_at"][2]) {
                        temp = repos[i];
                        repos[i] = repos[i + 1];
                        entries[i + 1] = temp;
                        swap = true;
                    }
                    // If the year, month AND day is the same then no swap is needed
                }
            }
        }
    } while (swap)
    return repos
}
