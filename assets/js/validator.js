 // Object validator
function Validator(options){
   var selectorRules = {};

   function validate(inputElement, rule){
      var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
      var errorMessage;  //  = rule.test(inputElement.value)
      var rules = selectorRules[rule.selector]; // Take out rules of seclector
         lengthRule = rules.length;
         //Lap qua tung rule and check 
         for(var i =0; i<lengthRule;i++){
           errorMessage =  rules[i](inputElement.value);
           if(errorMessage) break; 
         }
               if(errorMessage){
                  errorElement.innerText = errorMessage;
                  inputElement.parentElement.classList.add('invalid');
               }
               else {
                  errorElement.innerText = '';
                  inputElement.parentElement.classList.remove('invalid');
               }

         return !errorMessage;      
   }


   // Lap qua moi rule and xu ly(lang nghe su kien, blur,input,..) 
   var formElement = document.querySelector(options.form);// Take element of form need do
      //  console.log(formElement);
   if(formElement){
      // WHen submit form
      formElement.onsubmit = (e) =>{
         e.preventDefault();

         var isFormValid = true;

         // Lap qua tung rule and validate
         options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);
            var isValid = validate(inputElement,rule);
            if(!isValid){
               isFormValid = false;
            }
         });
         
         if(isFormValid){
            if(typeof options.onSubmit === 'function' ){
               // truong hop submit voi js
               var enableInputs = formElement.querySelectorAll(' [name]');
               var formValues = Array.from(enableInputs).reduce(function (values, input) {
                  values [input.name] = input.value
                  return  values;

               }, {}); 
               options.onSubmit(formValues);
            }else{ // submit voi hanh vi mac dinh
               formElement.submit();
            }
         } 
            
      } 

      options.rules.forEach(function(rule){
         // console.log(rule);
         // Save lai cac rules for each input
          
         // selectorRules[rule.selector] = rule.test; // test o day la cai function test cua no;
         if(Array.isArray(selectorRules[rule.selector] )){
            selectorRules[rule.selector].push(rule.test);
         }else{
            selectorRules[rule.selector] =[ rule.test]
         }
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
      // console.log(selectorRules)
   }
}  
 // Dinh ngia cac rule
 //Nguyen tac chung
 // 1. Khi have error => message error
 // 2. Nguoc lai => no return
 Validator.isEmail = function(selector, message){
   return {
      selector: selector,
      test: function(value){
         var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
         return regex.test(value) ? undefined :  message || 'Please enter email'
      }
   };
}
Validator.isRequired = function(selector, message){
   return {
      selector: selector,
      test: function(value){
         return  value.trim() ? undefined :  message || 'Please fill in'
      }
   };
}
Validator.minLength = function(selector,min){
   return {
      selector: selector,
      test: function(value){
         return  value.length >= min ? undefined :  `Please enter at least ${min} character`
      }
   };
}
Validator.isConfirmed = function(selector, getConfirmValue, message){
   return {
      selector: selector,
      test: function(value){
         return value === getConfirmValue() ?  undefined : message || 'Password are not same' 
      }
   };
}
Validator.isPhoneNumber = function(selector, message){
   return {
      selector: selector,
      test: function(value){
         var regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
         return regex.test(value) ? undefined :  message || 'Invalid phone number'
      }
   };
}