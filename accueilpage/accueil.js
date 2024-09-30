//----------------------------Déconnexion-------------------------------//

document.getElementById("logout-button").addEventListener("click", function() {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Optionnel : Supprimer les autres données de connexion comme les tentatives de connexion
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('blockTime');

    // Rediriger l'utilisateur vers la page de connexion ou d'accueil
    window.location.href = "../index.html";
});

//----------------------------Vérification de connexion-------------------------------//

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si le token est présent dans le localStorage
    const token = localStorage.getItem('token');
    
    // Si le token n'est pas présent, rediriger vers la page de connexion
    if (!token) {
        window.location.href = "../index.html"; // Rediriger vers la page de connexion
    }
});

/***************************************Prenom accueil*********************************************/
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si le token est présent dans le localStorage
   
    const saveusername = localStorage.getItem('storedusername');

    if (saveusername) {
        console.log(saveusername);
        const prenomtext = document.getElementById('prenom');
        prenomtext.textContent = saveusername;
    }
});


//-----------------------------------récuperer l'image------------------------------------//

document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('storedusername');

    if (userId) {
        fetch(`http://192.168.64.194:3000/user/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur dans la requête: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                const imgElement = document.getElementById('pdp');

                if (imgElement) {
                    if (data.PDP) {
                        // Assurez-vous que `data.PDP` est une URL ou un chemin valide pour l'image
                        // Vous pouvez éventuellement ajuster le chemin si nécessaire
                        imgElement.src = data.PDP;
                    } else {
                        imgElement.alt = 'Photo de profil non disponible';
                        console.error('Photo de profil non disponible.');
                        console.log(data.PDP);
                    }
                } else {
                    console.error("L'élément 'pdp' n'existe pas.");
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                const imgElement = document.getElementById('pdp');
                if (imgElement) {
                    imgElement.alt = 'Erreur lors du chargement des données.';
                }
            });
    } else {
        console.error('Aucun ID utilisateur trouvé dans le stockage local.');
        const imgElement = document.getElementById('pdp');
        if (imgElement) {
            imgElement.alt = 'Aucun utilisateur trouvé.';
        }
    }
});

/**********************Supprimer Compte et Menu déroulant*********************/

const menuButton = document.getElementById('pdp');
const dropdownMenu = document.getElementById('dropdownMenu');

menuButton.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {

    const Opt1 = document.getElementById('Opt1');
});