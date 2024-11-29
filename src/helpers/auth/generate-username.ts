export const generateUsername = (name: string) => {
    const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    return `${name.replace(/\s+/g, '').toLowerCase()}${randomNumbers}`;
};