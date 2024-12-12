export function createDeleteModal(nameItem, onDeleteConfirm) {
    const modalHTML = `
    <div id="myModal" class="modal-confirm-delete">
        <div class="modal-confirm">
            <div class="modal-content">
                <div class="modal-header flex-column">
                    <div class="icon-box"  >
                        <i class="material-icons">&#xE5CD;</i>
                    </div>
                    <h4 class="modal-title w-100">Are you sure?</h4>
                    <button type="button" class="close-confirm-delete close" data-dismiss="modal" aria-hidden="true" style="font-size: 30px; color: #000">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="font-size: 16px; color: #000;">Do you really want to delete <span style="color: #000; font-weight: 600; background-color: #ff5656; padding: 4px 10px; border-radius: 4px;" id="pondNameDisplay">${nameItem}</span> ? This process cannot be undone.</p>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn-cancel-delete btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-danger btn__confirm-delete">Delete</button>                    
                </div>
            </div>
        </div>
    </div>
    `; 
    // Append modal to the body or any container
    document.body.insertAdjacentHTML('afterbegin', modalHTML); 
    const modalContainerDeleteConfirm = document.querySelector('.modal-confirm-delete');
    const btnCloseConfirmDelete = document.querySelector('.close-confirm-delete');
    const modalMiniConfirmDelete = document.querySelector('.modal-confirm');
    const btnCancelDelete = document.querySelector('.btn-cancel-delete');
    const btnDelete = document.querySelector('.btn__confirm-delete'); 
    const closeModal = () => {
        modalContainerDeleteConfirm.remove();
    };
    btnCancelDelete.addEventListener('click', closeModal);
    btnCloseConfirmDelete.addEventListener('click', closeModal);
    modalContainerDeleteConfirm.addEventListener('click', closeModal);
    modalMiniConfirmDelete.addEventListener('click', function(e){
        e.stopPropagation();
    })

    btnDelete.addEventListener('click', () => {
        onDeleteConfirm();
        closeModal();
    });

}

export function toastMessage(type, title, message){
    const modalToast = `
        <div id="toast" class="">
            <div class="toast_main row toast--${type}">
                <div class="toast__icon  ">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div class="toast_body  ">
                    <h3 class="toast__title">${title}</h3>
                    <p class="toast__msg">${message}</p>
                </div>
                <div class="toast__close ">
                    <i class="fas fa-times"></i>
                </div>
            </div> 
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', modalToast);

    const closeToast = document.querySelector('.toast__close');
    const toastBig = document.getElementById('toast');

    closeToast.onclick = () => {
        toastBig.remove();
    }
         
    setTimeout(function () {
        var toast = document.getElementById('toast');
        if (toast) {
            toast.style.opacity = '0';  
            setTimeout(function () {
                toast.style.display = 'none';  
            }, 500);  
        }
    }, 3000);
}


export function callToast(result, message) {
    let title = null;
    let type = null;
    if (result) {
       title = "Success";
        type = "success";
    } else {
        title = "Error";
        type = "error";
    }
    toastMessage(type, title, message);
}
 
export function loading(){
    const modalLoading = `
        <div id="loading-overlay" class="ccccc">
            <div class="loader"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', modalLoading);
}

export function removeLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove(); // Xóa phần tử loading khỏi DOM
    }
}
