
function validator(formSelector){

    var formRules = {};
    var formElement = document.querySelector(formSelector);
    var _this = this;

    function getParent(input, parent){
        while(input.parentElement){
            if(input.parentElement.matches(parent)){
                return input.parentElement;
            }
            input = input.parentElement;
        }
    }

    // object chứa các function rules
    var validatorRules = {
        required: function(value){
            return value ? undefined : 'Vui lòng nhập thông tin này.';
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Thông tin này phải là email.';
        },
        min: function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
            }
        },
        max: function(max){
            return function(value){
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự`;
            }
        },
        confirmPassword: function(value) {
            return value === formElement.querySelector('input[name="password"]').value ? undefined : 'Nhập lại mật khẩu không chính xác.';
        }
    };

    if(formElement){
        var inputs = formElement.querySelectorAll('input[name][rules]');
        
        for(var input of inputs){
            var rules = input.getAttribute('rules').split('|');
            
            for(var rule of rules){
                var ruleBoolean = rule.includes(':');
                var ruleName;

                if(ruleBoolean){
                    ruleName = rule.split(':');
                    rule = ruleName[0];
                }

                var ruleFunc = validatorRules[rule];

                if(ruleBoolean){
                    ruleFunc = ruleFunc(ruleName[1]);
                }
                
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                }
                else{
                    formRules[input.name] = [ruleFunc];
                }
            }

            input.onblur = handleValidate;
            input.oninput = cleanErrorMessege;
        }

        function handleValidate(e){
            var rules = formRules[e.target.name];
            var messageError;
            
            for(var rule of rules){
                messageError = rule(e.target.value);
                if(messageError) break;
            }

            if(messageError){
                var parentElement = getParent(e.target, '.form-group');
                if(parentElement){
                    parentElement.classList.add('invalid');
                    var messageElement = parentElement.querySelector('.form-message');
                    
                    if(messageElement){
                        messageElement.innerText = messageError;
                    }
                }
            }
            else{
                var parentElement = getParent(e.target, '.form-group');
                if(parentElement){
                    parentElement.classList.add('valid');
                }
            }

            return !messageError;
        }

        function cleanErrorMessege(e){
            var parentElement = getParent(e.target, '.form-group');
            var messageElement = parentElement.querySelector('.form-message');

            if(parentElement.classList.contains('invalid') || parentElement.classList.contains('valid')){
                parentElement.classList.remove('invalid');
                parentElement.classList.remove('valid');
                messageElement.innerText = "";
            }
        }

        formElement.onsubmit = function(e){
            e.preventDefault();
    
            var inputs = formElement.querySelectorAll('input[name][rules]');
            var isValid = true;
    
            for(var input of inputs){
                if(!handleValidate({ target: input})){
                    isValid = false;
                }
            }
    
            if(isValid){
                if(typeof _this.onSubmit === 'function') {
    
                    var enableInputs = formElement.querySelectorAll('[name]');
    
                    var formValues = Array.from(enableInputs).reduce(function(value, input) {
                        switch(input.type){
                            case 'checkbox':
                                if(!value.hasOwnProperty(input.name)){
                                    value[input.name] = "";
                                }
                                if(!input.matches(':checked')){
                                    return value;
                                }
                                if(!Array.isArray(input.name)){
                                    value[input.name] = [];
                                }
                                value[input.name].push(input.value);
                                break;
                            case 'radio':
                                if(input.matches(':checked')){
                                    value[input.name] = input.value;
                                }
                                if(!value.hasOwnProperty(input.name)){
                                    value[input.name] = "";
                                }
                                break;
                            case 'file':
                                value[input.name] = input.file;
                                break;
                            default:
                                value[input.name] = input.value;
                        }
                        return value;
                    }, {})
    
                    _this.onSubmit(formValues);
                }
                else{
                    formElement.submit();
                }
            }
        }

    }

}


export default validator;