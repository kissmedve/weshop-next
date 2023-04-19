export const randomString = () => {
  let string = "";
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:&%@$";
  for (let i = 0; i < 10; i++) {
    let charIndex = Math.floor(Math.random() * characters.length + 1);
    string += characters[charIndex];
  }
  return string;
};
