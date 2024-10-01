document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('registrationForm');
    var submitButton = document.getElementById('submitButton');
    var errorMsg = document.getElementById('error-message');

    // Événement de soumission du formulaire
    form.addEventListener('submit', function(event) {
        cooldownBouton();
        // Permet de continuer avec la soumission si besoin
        // event.preventDefault(); // Décommenter si tu veux tester sans soumettre le formulaire
    });

    // Validation des caractères (lettres et chiffres seulement)
    function validateInput(event) {
        var regex = /^[a-zA-Z0-9]*$/;
        var input = event.target.value;

        if (!regex.test(input)) {
            errorMsg.innerText = 'Seules les lettres et les chiffres sont autorisés pour le nom d\'utilisateur et le mot de passe.';
            event.target.value = input.replace(/[^a-zA-Z0-9]/g, "");  // Supprime les caractères non valides
        } else {
            errorMsg.innerText = ''; 
        }
    }

    // Validation de l'email
    function validateEmail() {
        var email = document.getElementById('email').value;
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Expression régulière pour vérifier l'email

        if (!regex.test(email)) {
            errorMsg.innerText = 'Veuillez entrer une adresse email valide.';
        } else {
            errorMsg.innerText = '';
        }
    }

    // Fonction pour gérer le cooldown du bouton
    function cooldownBouton() {
        errorMsg.innerText = '';  // Réinitialise le message d'erreur s'il existe
        submitButton.disabled = true;  // Désactive le bouton
        submitButton.innerText = 'Inscription en cours...';

        // Réactive le bouton après 3 secondes
        setTimeout(function() {
            submitButton.innerText = 'Inscription échouée, réessayer';  // Affiche message d'échec
            setTimeout(function() {
                submitButton.disabled = false;  // Réactive le bouton après l'échec
                submitButton.innerText = 'S\'inscrire';  // Remet le texte d'origine
            }, 2000);  // Garde "Inscription échouée" pendant 2 secondes
        }, 3000);  // 3000 millisecondes = 3 secondes
    }

    // Attache les événements de validation aux inputs
    document.getElementById('login').addEventListener('input', validateInput);
    document.getElementById('password').addEventListener('input', validateInput);
    document.getElementById('email').addEventListener('input', validateEmail);
});
