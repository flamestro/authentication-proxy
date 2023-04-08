export const loginView = `
<div style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%;  font-size: 2rem; ">
    <div>
        You are not authorized to access this page.
    </div>
    <div>
        <form style="display: flex; flex-direction: column; align-items: center; width: 30rem; height: 30rem;" method="post" 
        onsubmit="fetch(document.location.origin, {credentials: 'include',
                                                    headers: {
                                                      'authorization': 'Basic ' + document.getElementById('username').value + ':' + document.getElementById('password').value
                                                    },}).then(_ => location.reload()); return false;">
            <input style="width: 30rem; height: 5rem; border-radius: 15px; margin: 10px; font-size: 2rem;" type="text" name="username" id="username" placeholder="Username"/>
            <input style="width: 30rem; height: 5rem; border-radius: 15px; margin: 10px; font-size: 2rem;"  type="password" name="password" id="password" placeholder="Password"/>
            <input style="width: 30rem; height: 5rem; border-radius: 15px; margin: 10px; font-size: 2rem;"  type="submit" value="Login" />
        </form>
    </div>
</div>
`;
