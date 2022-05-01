
const inputFullName = $('#input-fullName');
const inputUsername = $('#input-username');
const inputPassword = $('#input-password');
const inputReTypePassword = $('#input-retypePassword');
const signupBtn = $('#signupBtn');

signupBtn.on('click', async (e) =>{
    e.preventDefault();
    let fullNameIsValid = false;
    let usernameIsValid = false;
    let passwordIsValid = false;
    let passwordIsMatched = false;
    
    switch(""){
        case inputFullName.val().trim():
            inputFullName.addClass('invalid-input');
        case inputUsername.val().trim():
            inputUsername.addClass('invalid-input');
        case inputPassword.val().trim():
            inputPassword.addClass('invalid-input');
        case inputReTypePassword.val().trim():
            inputReTypePassword.addClass('invalid-input');
        default:
            break;
    }

    if(inputFullName.val().trim().length < 3){
        // full name must be 3 characters length
        inputFullName.prev().text('full name must be 3 characters length')
        inputFullName.addClass('invalid-input');
        fullNameIsValid = false;
    }else{
        fullNameIsValid = true;
    }
    if(inputUsername.val().trim().length < 3){
        //password must be 8 characters length
        inputUsername.prev().text('username must be 3 characters length')
        inputUsername.addClass('invalid-input');
        usernameIsValid = false;
    }else{
        usernameIsValid = true;
    }
    if(inputPassword.val().trim().length < 8){
        //password must be 8 characters length
        inputPassword.prev().text('password must be 8 characters length')
        inputPassword.addClass('invalid-input');
        passwordIsValid = false;
    }else{
        passwordIsValid = true;
    }
    if(inputPassword.val() !== inputReTypePassword.val()){
        inputReTypePassword.prev().text('password does not match')
        inputReTypePassword.addClass('invalid-input');
        //password does not match 
        passwordIsMatched = false;
    }else{
        passwordIsMatched = true;
    }
    let formIsValid = fullNameIsValid && usernameIsValid && passwordIsValid && passwordIsMatched;
    if(!formIsValid){
        return
    }
    
    const response = await axios.post('/user/signup',{
        fullName: inputFullName.val(),
        username: inputUsername.val(),
        password: inputPassword.val(),
        })
    window.location.href = '/login'
})
inputFullName.on('input', () =>{
    inputFullName.removeClass('invalid-input');
})
inputUsername.on('input', () =>{
    inputUsername.removeClass('invalid-input');
})
inputPassword.on('input', () =>{
    inputPassword.removeClass('invalid-input');
})
inputReTypePassword.on('input', () =>{
    inputReTypePassword.removeClass('invalid-input');
})