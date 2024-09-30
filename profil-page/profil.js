document.getElementById('pdp').addEventListener('click', () => {
    document.getElementById('changer-photo').click();
});

document.getElementById('changer-photo').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePicElement = document.getElementById('pdp');  // Cibler l'élément avec l'ID 'pdp'
            if (profilePicElement) {
                profilePicElement.src = e.target.result;  // Mettre à jour la source de l'image
            } else {
                console.error('Element with ID "pdp" not found.');
            }

            // Envoyer la nouvelle image vers le serveur
            const formData = new FormData();
            formData.append('profilePicture', file);
            formData.append('username', localStorage.getItem('storedusername'));  // Ajouter le nom d'utilisateur

            fetch('http://192.168.64.194:3000/changer-photo', {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Si vous utilisez un token
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la mise à jour de la photo de profil.');
            });
        };
        reader.readAsDataURL(file);
    }
});

//--------------------------changer le nom--------------------------------//

document.getElementById('edit-name-button').addEventListener('click', () => {
    const oldUsername = localStorage.getItem('storedusername'); // Récupérer l'ancien nom d'utilisateur à partir du localStorage
    const newUsername = prompt("Entrez le nouveau nom:");

    if (newUsername && oldUsername) {
        // Met à jour le nom sur l'interface
        document.getElementById('username').textContent = newUsername;
        localStorage.setItem('storedusername', newUsername);

        // Envoie une requête PUT au serveur pour mettre à jour le nom dans la base de données
        fetch('http://192.168.64.194:3000/changer-nom', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: oldUsername, newUsername: newUsername }) // Envoie l'ancien et le nouveau nom
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Nom d'utilisateur mis à jour avec succès.") {
                alert("Nom mis à jour avec succès !");
            } else {
                alert("Erreur lors de la mise à jour du nom: " + data.message);
                // Optionnel: rétablir l'ancien nom si l'erreur se produit
                document.getElementById('username').textContent = oldUsername;
                localStorage.setItem('storedusername', oldUsername);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la mise à jour du nom:", error);
            alert("Erreur lors de la mise à jour du nom.");
            // Optionnel: rétablir l'ancien nom en cas d'erreur
            document.getElementById('username').textContent = oldUsername;
            localStorage.setItem('storedusername', oldUsername);
        });
    } else {
        alert("Le nom ne peut pas être vide.");
    }
});


/***********************************************Gestion du changement de mot de passe*//////////

document.getElementById('change-password-button').addEventListener('click', () => {
    const username = localStorage.getItem('storedusername'); // Récupérer l'ID utilisateur (ou login)
    const oldPassword = prompt("Entrez l'ancien mot de passe:");
    
    if (oldPassword && username) {
        const newPassword = prompt("Entrez le nouveau mot de passe:");
        if (newPassword) {
            // Envoyer la requête PUT pour changer le mot de passe
            fetch(`http://192.168.64.194:3000/changer-motdepasse`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, oldPassword: oldPassword, newPassword: newPassword }) // Envoyer les infos nécessaires
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du changement de mot de passe: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                alert(data.message); // Afficher le message de succès ou d'erreur reçu du serveur
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert("Erreur lors du changement de mot de passe.");
            });
        } else {
            alert("Le nouveau mot de passe ne peut pas être vide.");
        }
    } else {
        alert("L'ancien mot de passe ou le nom d'utilisateur ne peut pas être vide.");
    }
});
/***********************************************************************************/

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
                        imageUrl = data.PDP
                        document.body.style.backgroundImage = "url('" + imageUrl + "')";
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


document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si le token est présent dans le localStorage
   
    const saveusername = localStorage.getItem('storedusername');

    if (saveusername) {
        console.log(saveusername);
        const prenomtext = document.getElementById('username');
        prenomtext.textContent = saveusername;
    }
});


document.getElementById('accueil').addEventListener('click', () => {
    window.location.href = "../accueil-page/accueil.html";
});

//--------------------------Supprimer Compte---------------------------------//

document.getElementById("supprimer-compte").addEventListener("click", function() {

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");

    if (!confirmation) {
        return;
    }
    const username = localStorage.getItem('storedusername');

    if (!username) {
        alert("Nom d'utilisateur introuvable !");
        return;
    }

    // Envoyer une requête DELETE au backend pour supprimer le compte
    fetch('http://192.168.64.194:3000/supprimer', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Si l'authentification est requise
        },
        body: JSON.stringify({ username })  // Envoyer le nom d'utilisateur dans le corps de la requête
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du compte');
        }
        return response.json();
    })
    .then(data => {
        // Supprimer les données du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        // Rediriger l'utilisateur vers la page de connexion ou d'accueil
        window.location.href = "../index.html";
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la suppression du compte.');
    });
});

/* Vérification de connexion*/
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si le token est présent dans le localStorage
    const token = localStorage.getItem('token');
    
    // Si le token n'est pas présent, rediriger vers la page de connexion
    if (!token) {
        window.location.href = "../index.html"; // Rediriger vers la page de connexion
    }
});