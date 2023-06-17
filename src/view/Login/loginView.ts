import { loginViewStyle } from "./style";
import { loginViewScript } from "./script";

export const loginView = `
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Proxy</title>

    <style>${loginViewStyle}</style>
    <script type="text/javascript">${loginViewScript}</script>
</head>
<body>
    <div class="login-container">
        <h2>Login</h2>
        <form onsubmit="return onSubmit();" method="post">
            <div class="input-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" id="submitWrapper">Login</button>
        </form>
    </div>
</body>
</html>
`;
