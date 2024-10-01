document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('loginForm');
    var submitButton = document.getElementById('submitButton');
    var errorMsg = document.getElementById('error-message');

    // Événement de soumission du formulaire
    form.addEventListener('submit', function(event) {
        cooldownBouton();
        // Permet de continuer avec la soumission si besoin
        // event.preventDefault(); // Décommenter si tu veux tester sans soumettre le formulaire
    });

    // Fonction pour gérer le cooldown du bouton
    function cooldownBouton() {
        errorMsg.innerText = '';  // Réinitialise le message d'erreur s'il existe
        submitButton.disabled = true;  // Désactive le bouton
        submitButton.innerText = 'Connexion en cours...';

        // Réactive le bouton après 3 secondes
        setTimeout(function() {
            submitButton.innerText = 'Connexion échouée, réessayer';  // Affiche message d'échec
            setTimeout(function() {
                submitButton.disabled = false;  // Réactive le bouton après l'échec
                submitButton.innerText = 'Se connecter';  // Remet le texte d'origine
            }, 2000);  // Garde "Connexion échouée" pendant 2 secondes
        }, 3000);  // 3000 millisecondes = 3 secondes
    }

    // Validation des caractères (lettres et chiffres seulement)
    function validateInput(event) {
        var regex = /^[a-zA-Z0-9]*$/;
        var input = event.target.value;

        if (!regex.test(input)) {
            errorMsg.innerText = 'Seules les lettres et les chiffres sont autorisés.';
            event.target.value = input.replace(/[^a-zA-Z0-9]/g, "");  // Supprime les caractères non valides
        } else {
            errorMsg.innerText = ''; 
        }
    }

    // Attache les événements de validation aux inputs
    document.getElementById('login').addEventListener('input', validateInput);
    document.getElementById('password').addEventListener('input', validateInput);
});
