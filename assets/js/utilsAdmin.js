// 
const link_btn = document.querySelector('.click_btn-subnav');
const miniNav = document.querySelector('.box-admin');
link_btn.addEventListener('click', (e) => {
    miniNav.classList.add('open_mini-nav');
    e.stopPropagation();
})
miniNav.addEventListener('click', (e) => {
    e.stopPropagation();
})
document.addEventListener('click', (e) => {
    miniNav.classList.remove('open_mini-nav');
})