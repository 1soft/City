export function checkVal(...values: any[]) {
    for (let i = 0; i < arguments.length; i++) {
        if (!values[i]) {
            throw Error("value must not be empty or not valid");
        }
    }
}