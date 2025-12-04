import getData from './modules/getData';
import renderCards from './modules/renderCards';
import renderCatalog from './modules/renderCatalog';
import toggleCheckbox from './modules/toggleCheckbox';
import toggleCart from './modules/toggleCart';
import addCart from './modules/addCart';
import actionPage from './modules/actionPage';
import productModal from './modules/productModal';
import accountPanel from './modules/account';
import sortCards from './modules/sortCards';
import contactForm from './modules/contactForm';
import responsiveNav from './modules/responsiveNav';
import mergeProductDetails from './modules/mergeProductDetails';

(async function () {
    try {
        const db = await getData();
        const normalizedDb = mergeProductDetails(db);
        renderCards(normalizedDb);
        renderCatalog();
        toggleCheckbox();
        toggleCart();
        addCart();
        sortCards();
        actionPage();
        productModal(normalizedDb);
        accountPanel();
        contactForm();
        responsiveNav();
    } catch (error) {
        console.warn('Ошибка инициализации приложения:', error);
    }
}());
