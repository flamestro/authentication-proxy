export const loginView = `
<html>
<head>
    <style>
     input {
     width: 20rem; 
     height: 4rem; 
     border-radius: 15px; 
     margin: 10px; 
     font-size: 1.5rem;
     }
     form {
     display: flex; 
     flex-direction: column; 
     align-items: center; 
     width: 100%;
     height: 100%;
     }
     
     #wrapper {
     display: flex; 
     flex-direction: column; 
     align-items: center; 
     width: 100%; 
     height: 100%;  
     font-size: 1.5rem; 
     }
     @media only screen and (max-width: 600px) {
      input {
            width: 20rem; 
           height: 5rem; 
      }
      
      #wrapper {
        justify-content: center;
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
            <input type="text" name="username" id="username" placeholder="Username" autocomplete="username"/>
            <input type="password" name="password" id="password" autocomplete="current-password" placeholder="Password"/>
            <input type="submit" value="Login" />
        </form>
    </div>
</div>
</body>
</html>
`;
