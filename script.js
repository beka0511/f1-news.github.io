document.addEventListener('DOMContentLoaded', function() {

    initNavigation();
    loadHomePage();
    loadDrivers();
    loadTeams();
    loadStandings();
    loadCalendar();
    loadMedia();
    initModals();
    
    updateFooterStats();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
    });
 
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
        
            navLinksContainer.classList.remove('active');
        
            const targetId = this.getAttribute('href').substring(1);
            
        
            navLinks.forEach(l => l.classList.remove('active'));
            


            this.classList.add('active');
            
           
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
           
            document.getElementById(targetId).classList.add('active');
            
            
            window.scrollTo(0, 0);
            
            switch(targetId) {
                case 'drivers':
                    loadDrivers();
                    break;
                case 'teams':
                    loadTeams();
                    break;
                case 'standings':
                    loadStandings();
                    break;
                case 'calendar':
                    loadCalendar();
                    break;
                case 'media':
                    loadMedia();
                    break;
            }
        });
    });
    
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
         
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
            this.classList.add('active');
            
        
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
         
            document.getElementById(tabId).classList.add('active');
        });
    });

    document.querySelectorAll('.media-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.media-tab-btn').forEach(b => b.classList.remove('active'));
       
            this.classList.add('active');
            
            document.querySelectorAll('.media-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.getElementById(tabId).classList.add('active');
        });
    });
}


function loadHomePage() {
    loadNews();
    loadTopDrivers();
}

function loadNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;
    
    newsGrid.innerHTML = '';
    
    F1Data.news.forEach(newsItem => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <img src="${newsItem.image}" alt="${newsItem.title}">
            <div class="news-content">
                <div class="news-category">${newsItem.category}</div>
                <h3 class="news-title">${newsItem.title}</h3>
                <p class="news-summary">${newsItem.summary}</p>
                <div class="news-date">${formatDate(newsItem.date)}</div>
            </div>
        `;
        newsGrid.appendChild(newsCard);
    });
}
function loadTopDrivers() {
    const topDriversContainer = document.getElementById('top-drivers');
    if (!topDriversContainer) return;
    









    const topDrivers = [...F1Data.drivers]
        .sort((a, b) => b.points - a.points)
        .slice(0, 5);
    
    topDriversContainer.innerHTML = '';
    
    topDrivers.forEach((driver, index) => {
        const driverCard = document.createElement('div');
        driverCard.className = 'top-driver-card';
        driverCard.innerHTML = `
            <div class="driver-position">${index + 1}</div>
            <div class="driver-number">#${driver.number}</div>
            <h3 class="driver-name">${driver.name}</h3>
            <div class="driver-team">${driver.team}</div>
            <div class="driver-points">${driver.points} очков</div>
        `;
        driverCard.style.borderLeft = `5px solid ${driver.teamColor}`;
        topDriversContainer.appendChild(driverCard);
    });
}
function loadDrivers() {
    const driversGrid = document.getElementById('drivers-grid');
    const teamFilter = document.getElementById('team-filter');
    
    if (!driversGrid) return;
    
   
    if (teamFilter && teamFilter.children.length <= 1) {
        const teams = [...new Set(F1Data.drivers.map(d => d.team))];
        teams.sort().forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamFilter.appendChild(option);
        });
    }
    
    
    const searchInput = document.getElementById('driver-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterDrivers);
    }
    
    if (teamFilter) {
        teamFilter.addEventListener('change', filterDrivers);
    }
    

    displayDrivers(F1Data.drivers);
    
    function filterDrivers() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedTeam = teamFilter ? teamFilter.value : '';
        
        const filtered = F1Data.drivers.filter(driver => {
            const matchesSearch = driver.name.toLowerCase().includes(searchTerm) ||
                                 driver.team.toLowerCase().includes(searchTerm) ||
                                 driver.nationality.toLowerCase().includes(searchTerm);
            const matchesTeam = !selectedTeam || driver.team === selectedTeam;
            
            return matchesSearch && matchesTeam;
        });
        
        displayDrivers(filtered);
    }
}
function displayDrivers(drivers) {
    const driversGrid = document.getElementById('drivers-grid');
    if (!driversGrid) return;
    
    driversGrid.innerHTML = '';
    
    drivers.forEach(driver => {
        const driverCard = document.createElement('div');
        driverCard.className = 'driver-card';
        driverCard.innerHTML = `
            <div class="driver-number">#${driver.number}</div>
            <h3 class="driver-name">${driver.name}</h3>
            <div class="driver-team">${driver.team}</div>
            <div class="driver-nationality">${driver.nationality}</div>
            <div class="driver-points">${driver.points} очков</div>
            <div class="driver-wins">${driver.wins} побед</div>
        `;
        driverCard.style.borderLeft = `5px solid ${driver.teamColor}`;
        
        driverCard.addEventListener('click', () => showDriverModal(driver.id));
        
        driversGrid.appendChild(driverCard);
    });
}

function loadTeams() {
    const teamsGrid = document.getElementById('teams-grid');
    if (!teamsGrid) return;
    
    teamsGrid.innerHTML = '';
    
    F1Data.teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <div class="team-color-bar" style="background-color: ${team.color}"></div>
            <div class="team-content">
                <div class="team-logo-container">
                    <img src="${team.logo}" alt="${team.name} логотип" class="team-logo" 
                         onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyMiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNzc3Ij4KICAgICAgICAgICR7dGVhbS5uYW1lLnN1YnN0cmluZygwLDIpfQogICAgICAgIDwvdGV4dD48L3N2Zz4='">
                </div>
                <h3 class="team-name">${team.name}</h3>
                <div class="team-base">${team.base}</div>
                <div class="team-principal">Руководитель: ${team.teamPrincipal}</div>
                <div class="team-stats">
                    <div class="team-stat">
                        <span class="team-stat-value">${team.championships}</span>
                        <span class="team-stat-label">Чемпионства</span>
                    </div>
                    <div class="team-stat">
                        <span class="team-stat-value">${team.wins}</span>
                        <span class="team-stat-label">Побед</span>
                    </div>
                </div>
                <button class="team-details-btn" data-team-id="${team.id}">
                    Подробнее
                </button>
            </div>
        `;
        
        teamsGrid.appendChild(teamCard);
    });
    
    document.querySelectorAll('.team-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const teamId = parseInt(this.getAttribute('data-team-id'));
            showTeamModal(teamId);
        });
    });
}

function loadStandings() {
    loadDriversStandings();
    loadConstructorsStandings();
}

function loadDriversStandings() {
    const tbody = document.getElementById('drivers-standings-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const sortedDrivers = [...F1Data.drivers].sort((a, b) => b.points - a.points);
    
    sortedDrivers.forEach((driver, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>#${driver.number}</strong><br>
                ${driver.name}
            </td>
            <td>${driver.team}</td>
            <td><strong>${driver.points}</strong></td>
            <td>${driver.wins}</td>
            <td>${driver.podiums}</td>
        `;
        tbody.appendChild(row);
    });
}

function loadConstructorsStandings() {
    const tbody = document.getElementById('constructors-standings-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const teamPoints = {};
    const teamWins = {};
    const teamPodiums = {};
    
    F1Data.drivers.forEach(driver => {
        if (!teamPoints[driver.team]) {
            teamPoints[driver.team] = 0;
            teamWins[driver.team] = 0;
            teamPodiums[driver.team] = 0;
        }
        
        teamPoints[driver.team] += driver.points;
        teamWins[driver.team] += driver.wins;
        teamPodiums[driver.team] += driver.podiums;
    });
    const sortedTeams = Object.entries(teamPoints)
        .sort(([, a], [, b]) => b - a)
        .map(([team]) => team);
    
    sortedTeams.forEach((teamName, index) => {
        const team = F1Data.teams.find(t => t.name === teamName);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>${teamName}</strong><br>
                ${team ? team.base : ''}
            </td>
            <td><strong>${teamPoints[teamName]}</strong></td>
            <td>${teamWins[teamName]}</td>
            <td>${teamPodiums[teamName]}</td>
        `;
        tbody.appendChild(row);
    });
}
function loadCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    const sortedRaces = [...F1Data.calendar].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    sortedRaces.forEach(race => {
        const raceCard = document.createElement('div');
        raceCard.className = 'calendar-card';
        raceCard.innerHTML = `
            <img src="${race.image}" alt="${race.circuit}">
            <div class="calendar-info">
                <h3 class="calendar-name">${race.name}</h3>
                <div class="circuit-name">${race.circuit}</div>
                <div class="calendar-date">
                    <i class="far fa-calendar"></i> ${formatDate(race.date)}
                </div>
                <div class="calendar-location">
                    <i class="fas fa-map-marker-alt"></i> ${race.location}
                </div>
                <div class="calendar-distance">
                    Длина круга: ${race.circuitLength} км
                </div>
                <button class="race-details-btn" data-race-id="${race.id}">
                    Детали трассы
                </button>
            </div>
        `;
        
        calendarGrid.appendChild(raceCard);
    });
    document.querySelectorAll('.race-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const raceId = parseInt(this.getAttribute('data-race-id'));
            showRaceModal(raceId);
        });
    });
}
function loadMedia() {
    loadVideos();
    loadMediaNews();
}

function loadVideos() {
    const videosGrid = document.getElementById('videos-grid');
    if (!videosGrid) return;
    
    videosGrid.innerHTML = '';
    
    F1Data.videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="play-btn">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <div class="video-meta">
                    <span><i class="far fa-eye"></i> ${video.views}</span>
                    <span><i class="far fa-clock"></i> ${video.duration}</span>
                    <span>${formatDate(video.date)}</span>
                </div>
            </div>
        `;
        
        videoCard.addEventListener('click', () => {
            window.open(video.url, '_blank');
        });
        
        videosGrid.appendChild(videoCard);
    });
}

function loadMediaNews() {
    const newsList = document.getElementById('news-list');
    if (!newsList) return;
    
    newsList.innerHTML = '';
    
    F1Data.news.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `
            <h4>${newsItem.title}</h4>
            <p>${newsItem.summary}</p>
            <div class="news-meta">
                <span class="news-category">${newsItem.category}</span>
                <span class="news-date">${formatDate(newsItem.date)}</span>
            </div>
        `;
        newsList.appendChild(newsElement);
    });
}


function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
 
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
}

function showTeamModal(teamId) {
    const team = F1Data.teams.find(t => t.id === teamId);
    if (!team) return;
    
    const modalBody = document.getElementById('team-modal-body');
    const drivers = F1Data.drivers.filter(d => team.drivers.includes(d.id));
    
    modalBody.innerHTML = `
        <div class="modal-team-header" style="border-left: 10px solid ${team.color}">
            <h2>${team.fullName}</h2>
            <div class="modal-team-info">
                <div><strong>База:</strong> ${team.base}</div>
                <div><strong>Руководитель:</strong> ${team.teamPrincipal}</div>
                <div><strong>Дебют в F1:</strong> ${team.firstEntry}</div>
            </div>
        </div>
        
        <div class="modal-team-stats">
            <div class="modal-stat">
                <div class="modal-stat-value">${team.championships}</div>
                <div class="modal-stat-label">Чемпионства</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${team.wins}</div>
                <div class="modal-stat-label">Победы</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${team.poles}</div>
                <div class="modal-stat-label">Поулы</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${team.fastestLaps}</div>
                <div class="modal-stat-label">Быстрые круги</div>
            </div>
        </div>
        
        <div class="modal-team-drivers">
            <h3>Пилоты 2025</h3>
            <div class="drivers-list">
                ${drivers.map(driver => `
                    <div class="modal-driver">
                        <div class="modal-driver-number">#${driver.number}</div>
                        <div class="modal-driver-info">
                            <h4>${driver.name}</h4>
                            <div class="modal-driver-details">
                                <div>${driver.nationality}</div>
                                <div>${driver.points} очков</div>
                                <div>${driver.wins} побед</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="modal-team-history">
            <h3>История команды</h3>
            <p>Одна из ${team.championships > 0 ? 'самых успешных' : 'старейших'} команд в Формуле 1. Команда дебютировала в ${team.firstEntry} году и с тех пор завоевала ${team.championships} чемпионских титулов.</p>
        </div>
    `;
    
    document.getElementById('team-modal').classList.add('active');
}

function showDriverModal(driverId) {
    const driver = F1Data.drivers.find(d => d.id === driverId);
    if (!driver) return;
    
    const modalBody = document.getElementById('driver-modal-body');
    const team = F1Data.teams.find(t => t.name === driver.team);



    const birthDate = new Date(driver.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    
    modalBody.innerHTML = `
        <div class="modal-driver-header" style="border-left: 10px solid ${driver.teamColor}">
            <h2>${driver.name} <span class="driver-number">#${driver.number}</span></h2>
            <div class="modal-driver-info">
                <div><strong>Команда:</strong> ${driver.team}</div>
                <div><strong>Национальность:</strong> ${driver.nationality}</div>
                <div><strong>Возраст:</strong> ${age} лет</div>
                <div><strong>Дата рождения:</strong> ${formatDate(driver.birthDate)}</div>
            </div>
        </div>
        
        <div class="modal-driver-stats">
            <div class="modal-stat">
                <div class="modal-stat-value">${driver.championships}</div>
                <div class="modal-stat-label">Титулы</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${driver.wins}</div>
                <div class="modal-stat-label">Победы</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${driver.podiums}</div>
                <div class="modal-stat-label">Подиумы</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${driver.points}</div>
                <div class="modal-stat-label">Очки</div>
            </div>
        </div>
        
        <div class="modal-driver-bio">
            <h3>Карьера</h3>
            <p>${driver.name} - ${driver.championships > 0 ? 'многократный чемпион мира' : 'один из ведущих гонщиков'} Формулы 1. Дебютировал в F1 и с тех пор показал выдающиеся результаты.</p>
            ${driver.championships > 0 ? `
                <div class="championships-list">
                    <h4>Чемпионские титулы:</h4>
                    <ul>
    ${driver.championshipYears.map(year => `<li>Сезон ${year}</li>`).join('')}
</ul>

                </div>
            ` : ''}
        </div>
        
        <div class="modal-driver-team">
            <h3>Текущая команда</h3>
            <div class="team-info-card" style="border-color: ${team.color}">
                <h4>${team.name}</h4>
                <div>${team.base}</div>
                <div>Руководитель: ${team.teamPrincipal}</div>
                <div>Чемпионства команды: ${team.championships}</div>
            </div>
        </div>
    `;
    
    document.getElementById('driver-modal').classList.add('active');
}

function showRaceModal(raceId) {
    const race = F1Data.calendar.find(r => r.id === raceId);
    if (!race) return;
    
    const modalBody = document.getElementById('race-modal-body');
    
    modalBody.innerHTML = `
        <div class="modal-race-header">
            <h2>${race.name} Гран-при</h2>
            <div class="modal-race-info">
                <div><strong>Трасса:</strong> ${race.circuit}</div>
                <div><strong>Место:</strong> ${race.location}</div>
                <div><strong>Дата:</strong> ${formatDate(race.date)}</div>
            </div>
        </div>
        
        <div class="modal-race-image">
            <img src="${race.image}" alt="Схема трассы ${race.circuit}" style="width: 100%; border-radius: 8px;">
        </div>
        
        <div class="modal-race-stats">
            <div class="modal-stat">
                <div class="modal-stat-value">${race.laps}</div>
                <div class="modal-stat-label">Круги</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${race.circuitLength}</div>
                <div class="modal-stat-label">Длина круга (км)</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${race.raceDistance}</div>
                <div class="modal-stat-label">Дистанция (км)</div>
            </div>
        </div>
        
        <div class="modal-race-details">
            <h3>Характеристики трассы</h3>
            <p>${race.circuit} - ${race.location.includes('Монако') ? 'легендарная городская трасса' : 'одна из самых техничных трасс'} календаря Формулы 1.</p>
            
            <div class="track-record">
                <h4>Рекорд круга:</h4>
                <div class="record-holder">${race.lapRecord}</div>
            </div>
            
            <div class="track-facts">
                <h4>Интересные факты:</h4>
                <ul>
                    <li>Трасса впервые приняла Гран-при Формулы 1</li>
                    <li>Считается ${race.name.includes('Монако') ? 'самой престижной гонкой сезона' : 'одной из самых быстрых трасс'}</li>
                    <li>Известна ${race.name.includes('Спа') ? 'непредсказуемой погодой' : 'высокими скоростями'}</li>
                </ul>
            </div>
        </div>
        
        <div class="modal-race-prev-winner">
            <h3>Победитель этого года</h3>
            <div class="winner-info">
                <div class="winner-name">Макс Ферстаппен</div>
                <div class="winner-team">Red Bull Racing</div>
                <div class="winner-time">Время: 1:27:45.914</div>
            </div>
        </div>
    `;
    
    document.getElementById('race-modal').classList.add('active');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function updateFooterStats() {
    const totalDrivers = document.getElementById('total-drivers');
    const totalTeams = document.getElementById('total-teams');
    const totalRaces = document.getElementById('total-races');
    
    if (totalDrivers) totalDrivers.textContent = F1Data.drivers.length;
    if (totalTeams) totalTeams.textContent = F1Data.teams.length;
    if (totalRaces) totalRaces.textContent = F1Data.calendar.length;
}

const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-team-header,
    .modal-driver-header,
    .modal-race-header {
        padding: 20px;
        background: rgba(0,0,0,0.2);
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .modal-team-stats,
    .modal-driver-stats,
    .modal-race-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }
    
    .modal-stat {
        text-align: center;
        padding: 20px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
    }
    
    .modal-stat-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--f1-red);
    }
    
    .modal-stat-label {
        font-size: 0.9rem;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .modal-team-drivers,
    .modal-driver-bio,
    .modal-race-details {
        margin: 30px 0;
    }
    
    .drivers-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
    }
    
    .modal-driver {
        display: flex;
        align-items: center;
        padding: 15px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        border-left: 5px solid var(--f1-red);
    }
    
    .modal-driver-number {
        font-size: 2rem;
        font-weight: bold;
        margin-right: 20px;
        opacity: 0.7;
    }
    
    .team-info-card {
        padding: 20px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        border-left: 5px solid;
        margin-top: 15px;
    }
    
    .track-record,
    .track-facts,
    .winner-info {
        margin: 20px 0;
        padding: 15px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
    }
    
    .record-holder {
        font-family: monospace;
        font-size: 1.2rem;
        color: var(--f1-yellow);
        margin-top: 10px;
    }
    
    .track-facts ul {
        margin-top: 10px;
        padding-left: 20px;
    }
    
    .track-facts li {
        margin-bottom: 8px;
    }
    
    .winner-name {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--f1-red);
    }
    
    .winner-team {
        color: #888;
        margin: 5px 0;
    }
    
    .winner-time {
        font-family: monospace;
        font-size: 1.1rem;
    }
`;

document.head.appendChild(modalStyles);
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3NzciPkYxIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }
}, true);


function displayDrivers(drivers) {
    const driversGrid = document.getElementById('drivers-grid');
    if (!driversGrid) return;
    
    driversGrid.innerHTML = '';
    
    drivers.forEach(driver => {
        const driverCard = document.createElement('div');
        driverCard.className = 'driver-card';
        driverCard.innerHTML = `
            <div class="driver-number">#${driver.number}</div>
            <div class="driver-image">
                <img src="${driver.image}" alt="${driver.name}" onerror="this.src='images/default-driver.jpg'">
            </div>
            <h3 class="driver-name">${driver.name}</h3>
            <div class="driver-team">${driver.team}</div>
            <div class="driver-nationality">${driver.nationality}</div>
            <div class="driver-points">${driver.points} очков</div>
            <div class="driver-wins">${driver.wins} побед</div>
        `;
        driverCard.style.borderLeft = `5px solid ${driver.teamColor}`;
        
        driverCard.addEventListener('click', () => showDriverModal(driver.id));
        
        driversGrid.appendChild(driverCard);
    });
}