document.addEventListener("DOMContentLoaded", function() {
    const footerHtml = `<footer>
            <div class="container__img-footer-main">
                <div class="container__img-pd">
                    <div class="container">
                        <div class="container__footer-desc-area row">
                            <div class="footer-desc-item col-lg-4">
                                <a href="#" class="footer-desc-item-img">
                                    <img src="./assets/img/logo/Logo_Koi_Care.png" alt="">
                                </a>
                                <p class="desc-footer-infor">
                                    <i class="fa-solid fa-location-dot"></i>  Student Culture House, 643 dien Bien Phu, Phuong 1, Quan 3, HCM
                                </p>
                                <p class="desc-footer-infor">
                                    <i class="fa-solid fa-phone" style="margin-right: 0.4rem;"></i> +84 1234 567 890
                                </p>
                                <p class="desc-footer-infor">
                                    <i class="fa-solid fa-envelope"style="margin-right: 0.4rem;"></i> acnbokhb12@gmail.com

                                </p>
                            </div>
                            <div class="footer-desc-item col-lg-3">
                                <h2>Opening time</h2>
                                <div class="footer-desc-item-time">
                                    Monday- Tuesday
                                    <span>
                                        <i>10:10</i> am - <i>11:00</i> pm
                                    </span>
                                </div>
                                <div class="footer-desc-item-time">
                                    <p class="">Monday- Tuesday</p>
                                    <span>
                                        <i>10:10</i> am - <i>11:00</i> pm
                                    </span>
                                </div>
                                 
                            </div>
                            <div class="footer-desc-item col-lg-2">
                                <h2>Menu</h2>
                                <a href="" class="link__footer-nav">Home</a>
                                <a href="" class="link__footer-nav">About</a>
                                <a href="" class="link__footer-nav">Shop</a>
                                <a href="" class="link__footer-nav">Contact</a>
                            </div>
                            <div class="footer-desc-item col-lg-3">
                                <h2>Intagram feed</h2>
                                <p>Don’t miss any updates all the astonishing offers we bring for you.</p>
                                <div class="footer-desc-item-mess">
                                    <form action="">
                                        <input type="text" placeholder="E-mail" required>
                                        <button type="submit">Subcribe</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="container__footer-desc-bottom">
                            <div class="footer-desc-bottom-left">
                                <p>© 2024 Servicr is powered by <i>Koi Care System</i>. The property of their owners.</p>
                            </div>
                            <div class="footer-desc-bottom-right">
                                <ul class="list__icon__footer">
                                    <li class="item__con__footer">
                                        <a href="#"><i class="fa-brands fa-instagram"></i></a>
                                       
                                    </li>
                                    <li class="item__con__footer">
                                        <a href="#"><i class="fa-brands fa-google"></i></a>
                                        
                                    </li>
                                    <li class="item__con__footer">
                                        <a href="#"><i class="fa-brands fa-discord"></i></a>
                                    </li>
                                    <li class="item__con__footer">
                                        <a href="#"><i class="fa-brands fa-twitch"></i></a>
                                    </li>
                                    <li class="item__con__footer">
                                        <a href="#"><i class="fa-brands fa-youtube"></i></a>
                                    </li>
                                </ul>
                                 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>`;
    document.body.insertAdjacentHTML('beforeend', footerHtml);
    
})