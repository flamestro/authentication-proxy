export const loginView = `
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Authentication Proxy</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
    * {
     font-size: 1.7rem;
    }
     input {
     width: 20rem; 
     height: 4rem; 
     border-radius: 15px; 
     margin: 10px; 
     }
     form {
     display: flex; 
     flex-direction: column; 
     align-items: center; 
     width: 100%;
     }
     
     #wrapper {
     display: flex; 
     flex-direction: column; 
     align-items: center; 
     justify-content: center;
     width: 100%; 
     height: 100%;  
     font-size: 1.5rem; 
     }
     #submit {
        cursor: pointer;
     }
     
    }
    </style>
    <script type="text/javascript">
   
    const onSubmit = () => {
        document.getElementById('submitWrapper').innerHTML = '<i class="fa fa-spinner fa-spin"></i>Loading'
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
    </script>
</head>
<body>
<div id="wrapper">

    <div>
        You are not authorized to access this page.
    </div>
    <div>
        <form method="post" 
        onsubmit="return onSubmit();">
            <input type="text" name="username" id="username" placeholder="Username" autocomplete="on"/>
            <input type="password" name="password" id="password" autocomplete="on" placeholder="Password"/>
            <div id="submitWrapper"><input id="submit" type="submit" value="Login" /></div>
        </form>
    </div>
</div>
</body>
</html>
`;
