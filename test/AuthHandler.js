import Axios from 'axios';


function setAuthcredential(credential){

    localStorage.setItem('authCredential', credential);
}

function getAuthcredential(){
    let cred = localStorage.getItem('authCredential');
    Axios.post('http://localhost:8080/token', {
        headers: {
            'Authorization': cred
        }
    }
    ).then((res)=>{
        return res.data;
    })
}

module.exports = {
    setAuthcredential,
    getAuthcredential
}