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
        }
        
    }catch(error){
        console.log(error)
    }
    
}

loginBtn.on('click', (e) =>{
    e.preventDefault();
    login();
})