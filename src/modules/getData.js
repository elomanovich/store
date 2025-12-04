export default function getData() {
    const goodsWrapper = document.querySelector('.goods');
    const dataUrl = new URL('./db/db.json', window.location.href);
    return fetch(dataUrl, { cache: 'no-store' })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Данные не были получены, ошибка: ' + response.status);
            }
        })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.warn(err);
            goodsWrapper.innerHTML = '<div style="color:red; font-size:30px;">Упс, что-то пошло не так</div>';
        });

}
