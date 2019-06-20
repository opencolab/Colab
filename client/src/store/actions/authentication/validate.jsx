import {EmailRegex, NamesRegex, PasswordRegex, UsernameRegex} from '../../data/mapping/regex';
import {EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, USERNAME} from "../../data/mapping/user";

export const validate = (type, value) => {
    let valid;

    if (value === "") {
        return true;
    }

    if (type === FIRST_NAME) {
        valid = NamesRegex.test(value);
    }

    if (type === LAST_NAME) {
        valid = NamesRegex.test(value);
    }

    if (type === USERNAME) {
        valid = UsernameRegex.test(value);
    }

    if (type === PASSWORD) {
        valid = PasswordRegex.test(value);
    }

    if (type === EMAIL) {
        valid = EmailRegex.test(value);
    }

    return valid;
};

// REVIEW: Unused constant confirmPassword
export const confirmPassword = (value1, value2) => {
    return value1 === value2;
};