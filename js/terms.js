document.addEventListener("DOMContentLoaded", function() {
    // Obtén el enlace o el botón
    var openTermsButton = document.getElementById("openTerms");

    // Agrega un evento de clic al enlace o botón
    openTermsButton.addEventListener("click", function(event) {
        // Evita que el enlace funcione como un enlace normal
        event.preventDefault();

        // Abre una ventana emergente con los términos y condiciones
        var termsPopup = window.open("./terms.html", "TermsPopup", "width=500, height=400, scrollbars=yes");

        // Enfoca la ventana emergente
        termsPopup.focus();
    });
});
