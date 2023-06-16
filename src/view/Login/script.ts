export const loginViewScript = `
const onSubmit = () => {
            document.getElementById('submitWrapper').innerHTML = 'Loading <div class="spinner"></div>'
            document.getElementById('submitWrapper').setAttribute('disabled', 'true');
            const authValue = 'Basic ' + document.getElementById('username').value + ':' + document.getElementById('password').value
            fetch("/", 
            {
                credentials: 'include',
                headers: {
                    'authorization': authValue
                },
            }).then(_ => location.reload())
            return false;
        }
`;
