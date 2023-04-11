export const loginView = `
<html>
<head>
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
</head>
<body>
<div id="wrapper">
    <div>
        You are not authorized to access this page.
    </div>
    <div>
        <form method="post" 
        onsubmit="fetch(document.location.origin, {credentials: 'include',
                                                    headers: {
                                                      'authorization': 'Basic ' + document.getElementById('username').value + ':' + document.getElementById('password').value
                                                    },}).then(_ => location.reload()); return false;">
            <input type="text" name="username" id="username" placeholder="Username" autocomplete="on"/>
            <input type="password" name="password" id="password" autocomplete="on" placeholder="Password"/>
            <input id="submit" type="submit" value="Login" />
        </form>
    </div>
</div>
</body>
</html>
`;
