export const tooManyAttemptsView = (nextAttempt: Date) => `
<div style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%;">
    <div>
        Too many login attempts! 
        Try again later (will unlock gate at ${nextAttempt.getDate()})
    </div>
</div>
`;
