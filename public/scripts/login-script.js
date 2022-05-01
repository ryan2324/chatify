const inputUsername = $('#input-username');
const inputPassword = $('#input-password');
const loginBtn = $('#loginBtn');

const login = async () =>{
    localStorage.removeItem('chatify')
    try{
        const response = await axios.post('/user/login',{
            username: inputUsername.val(),
            password: inputPassword.val()
        })
        if(response.status == 200){
            localStorage.setItem('chatify', JSON.stringify(response.data))
            window.location.href = '/'
        }else{
            console.log(response)
            inputUsername.addClass('invalid-input');
            inputPassword.addClass('invalid-input');
            inputPassword.prev().text('password does not match')
        }
    }catch(error){
        inputUsername.addClass('invalid-input');
        inputPassword.addClass('invalid-input');
        inputUsername.prev().text('username and password does not match')
        
    }
    
}
inputPassword.on('input', ()=>{
    inputUsername.prev().text('')
    inputPassword.removeClass('invalid-input');
})
inputUsername.on('input', ()=>{
    inputUsername.prev().text('')
    inputUsername.removeClass('invalid-input');
})
loginBtn.on('click', (e) =>{
    e.preventDefault();
    login();
})