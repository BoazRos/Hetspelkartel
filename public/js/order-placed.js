
function onDomLoaded() {
    const homeButton = document.querySelector('.home-button');
    homeButton.addEventListener('click', function () {
        location.href = '/';
    });
}

document.addEventListener('DOMContentLoaded', onDomLoaded);