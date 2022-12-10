export const loginView = `
<div style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%;">
    <div>
        You are not authorized to access this page.
    </div>
    <div>
        <form style="display: flex; flex-direction: column; align-items: center; width: 200px; height: 200px;" method="post" 
        onsubmit="fetch(document.location.origin, {credentials: 'include',
                                                    headers: {
                                                      'authorization': 'Basic ' + document.getElementById('username').value + ':' + document.getElementById('password').value
                                                    },}).then(_ => location.reload()); return false;">
            <input style="width: 200px; height: 50px; border-radius: 15px; margin: 10px;" type="text" name="username" id="username" placeholder="Username"/>
            <input style="width: 200px; height: 50px; border-radius: 15px; margin: 10px;"  type="password" name="password" id="password" placeholder="Password"/>
            <input style="width: 100px; height: 50px; border-radius: 15px; margin: 10px;"  type="submit" value="Login" />
        </form>
    </div>
</div>
`;
