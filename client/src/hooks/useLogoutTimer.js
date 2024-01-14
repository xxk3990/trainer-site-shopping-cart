import {
    handleLogout
} from "../services/auth-service";
export const useLogoutTimer = (minutes, setMinutes, seconds, setSeconds) => {
    window.interval = setInterval(() => {
        const newMinute = minutes - 1;
        console.log("minutes left: ", newMinute)
        setMinutes(newMinute);
        if (newMinute === 0) {
            endInterval()
            return 0;
        }
    }, 60000)
    if (minutes === 1) {
        const interval = setInterval(() => {
            seconds--;
            setSeconds(seconds);
            localStorage.setItem("seconds", seconds)
        }, 1000)
        if (seconds === 0) {
            window.location.href = "/login"
            console.log("clear interval condition reached");
            handleLogout()
            clearInterval(interval);
        }
    }
    const endInterval = () => {
        clearInterval(window.interval)
    }
}