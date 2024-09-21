 // Object validator
function Validator(options){

   function validate(inputElement, rule){
      var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
      var errorMessage = rule.test(inputElement.value);
               if(errorMessage){
                  errorElement.innerText = errorMessage;
                  inputElement.parentElement.classList.add('invalid');
               }
               else {
                  errorElement.innerText = '';
                  inputElement.parentElement.classList.remove('invalid');
               }
   }
   
   var formElement = document.querySelector(options.form);
      //  console.log(formElement);
   if(formElement){
      options.rules.forEach(function(rule){
         var inputElement = formElement.querySelector(rule.selector);
      var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

         // console.log(inputElement);
          if(inputElement){
            // xu ly trong truongw hop blur khoi input
            inputElement.onblur = function(){
                validate(inputElement, rule);
            }
            // xu ly khi nguoi dung nhap vao input
            inputElement.oninput = function(){
               errorElement.innerText = '';
               inputElement.parentElement.classList.remove('invalid');
            }
          }
      });
   }
}  
 // Dinh ngia cac rule
 //Nguyen tac chung
 // 1. Khi have error => message error
 // 2. Nguoc lai => no return
 Validator.isEmail = function(selector){
   return {
      selector: selector,
      test: function(value){
         var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
         return regex.test(value) ? undefined : 'Please enter email'
      }
   };
}
Validator.isRequired = function(selector){
   return {
      selector: selector,
      test: function(value){
         return  value.trim() ? undefined : 'Please fill in'
      }
   };
}
Validator.minLength = function(selector,min){
   return {
      selector: selector,
      test: function(value){
         return  value.length >= min ? undefined : `Please enter at least ${min} character`
      }
   };
}
Validator.isConfirmed = function(selector, getConfirmValue){
   return {
      selector: selector,
      test: function(value){
         return value === getConfirmValue() ?  undefined : 'Password are not same' 
      }
   };
}